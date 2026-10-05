/* Runner King V2 Baseball Decision Engine
 * Goal: Situation -> Player Decision -> Defense Strategy -> Ball Route -> Runner Route -> Outcome Plan
 * Renderer must consume plans; it must not contain baseball rules.
 */
(function (global) {
  'use strict';

  const VERSION = 'v2.0.0-alpha.1';

  const Decision = Object.freeze({
    ADVANCE: 'ADVANCE',
    HOLD: 'HOLD',
    READ: 'READ',
    RETURN: 'RETURN'
  });

  const Primitive = Object.freeze({
    FIELD: 'FIELD', CATCH: 'CATCH', THROW: 'THROW', RELAY: 'RELAY',
    STEP_BASE: 'STEP_BASE', TAG_RUNNER: 'TAG_RUNNER', APPEAL: 'APPEAL',
    RUN: 'RUN', HOLD: 'HOLD', RETURN: 'RETURN', TAG_UP: 'TAG_UP',
    SLIDE: 'SLIDE', BRAKE: 'BRAKE', SCORE: 'SCORE', BLOCKED: 'BLOCKED',
    SAFE: 'SAFE', OUT: 'OUT', FORCE_OUT: 'FORCE_OUT', TAG_OUT: 'TAG_OUT',
    DOUBLE_PLAY: 'DOUBLE_PLAY'
  });

  const Base = Object.freeze({ HOME: 'HOME', FIRST: '1B', SECOND: '2B', THIRD: '3B' });

  function assertSituation(s) {
    if (!s || typeof s !== 'object') throw new Error('Situation is required');
    if (!Number.isInteger(s.outs) || s.outs < 0 || s.outs > 2) throw new Error('outs must be 0..2');
    if (!s.ball || !s.ball.type) throw new Error('ball.type is required');
    if (!s.player || !s.player.runnerId) throw new Error('player.runnerId is required');
  }

  function nextBase(base) {
    return ({ HOME: Base.FIRST, '1B': Base.SECOND, '2B': Base.THIRD, '3B': Base.HOME })[base] || null;
  }

  function isForceSituation(s, runner) {
    if (!runner) return false;
    if (runner.base === Base.FIRST) return true;
    const occupied = new Set((s.runners || []).map(r => r.base));
    if (runner.base === Base.SECOND) return occupied.has(Base.FIRST);
    if (runner.base === Base.THIRD) return occupied.has(Base.FIRST) && occupied.has(Base.SECOND);
    return false;
  }

  function chooseDefenseTarget(s, decision) {
    const player = (s.runners || []).find(r => r.id === s.player.runnerId);
    const force = isForceSituation(s, player);
    const destination = player ? nextBase(player.base) : null;

    // Alpha policy: prefer a force on the controlled runner; otherwise secure batter-runner at 1B.
    if (decision === Decision.ADVANCE && force && destination) {
      return { targetRunnerId: player.id, targetBase: destination, play: Primitive.FORCE_OUT, reason: 'FORCE_PLAY_PRIORITY' };
    }
    return { targetRunnerId: 'BR', targetBase: Base.FIRST, play: Primitive.STEP_BASE, reason: 'SECURE_BATTER_RUNNER' };
  }

  function buildRunnerRoute(s, decision) {
    const player = (s.runners || []).find(r => r.id === s.player.runnerId);
    if (!player) return [];
    if (decision === Decision.ADVANCE) return [{ actor: player.id, action: Primitive.RUN, from: player.base, to: nextBase(player.base) }];
    if (decision === Decision.RETURN) return [{ actor: player.id, action: Primitive.RETURN, to: player.base }];
    if (decision === Decision.HOLD) return [{ actor: player.id, action: Primitive.HOLD, at: player.base }];
    return [{ actor: player.id, action: 'READ_BALL', at: player.base }];
  }

  function buildBallRoute(s, defense) {
    const fielder = s.ball.fielder || 'FIELDER';
    return [
      { action: Primitive.FIELD, actor: fielder, ballFrom: s.ball.zone || 'BATTED_BALL' },
      { action: Primitive.THROW, from: fielder, to: defense.targetBase }
    ];
  }

  function resolve(situation, decision) {
    assertSituation(situation);
    if (!Object.values(Decision).includes(decision)) throw new Error('Unknown player decision: ' + decision);

    const defense = chooseDefenseTarget(situation, decision);
    const runnerRoute = buildRunnerRoute(situation, decision);
    const ballRoute = buildBallRoute(situation, defense);

    return {
      engineVersion: VERSION,
      situationId: situation.id || null,
      decision,
      phase1: {
        type: 'CAUSE_READ',
        ball: situation.ball,
        runners: situation.runners || []
      },
      phase2: {
        type: 'REACTION_CONSEQUENCE',
        runnerRoute,
        defenseStrategy: defense,
        ballRoute,
        terminalEvents: [{ action: defense.play, runnerId: defense.targetRunnerId, base: defense.targetBase }]
      },
      trace: [
        'SITUATION',
        'PLAYER_DECISION:' + decision,
        'DEFENSE:' + defense.reason,
        'BALL_ROUTE',
        'RUNNER_ROUTE',
        'OUTCOME'
      ]
    };
  }

  function expandThreeBranches(situation) {
    return [Decision.ADVANCE, Decision.HOLD, Decision.READ].map(decision => ({
      decision,
      plan: resolve(situation, decision)
    }));
  }

  const api = Object.freeze({ VERSION, Decision, Primitive, Base, resolve, expandThreeBranches, isForceSituation });
  global.RunnerKingEngineV2 = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
