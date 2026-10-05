/* Runner King V2 Baseball Decision Engine
 * Situation -> Player Decision -> Defense Strategy -> Ball Route -> Runner Route -> Outcome Plan
 * Renderer consumes plans; it never decides baseball strategy.
 */
(function (global) {
  'use strict';
  const VERSION = 'v2.0.0-alpha.2';
  const Decision = Object.freeze({ ADVANCE:'ADVANCE', HOLD:'HOLD', READ:'READ', RETURN:'RETURN' });
  const Primitive = Object.freeze({
    FIELD:'FIELD', CATCH:'CATCH', THROW:'THROW', RELAY:'RELAY', STEP_BASE:'STEP_BASE', TAG_RUNNER:'TAG_RUNNER', APPEAL:'APPEAL',
    RUN:'RUN', HOLD:'HOLD', READ_BALL:'READ_BALL', RETURN:'RETURN', TAG_UP:'TAG_UP', SLIDE:'SLIDE', BRAKE:'BRAKE', SCORE:'SCORE', BLOCKED:'BLOCKED',
    SAFE:'SAFE', OUT:'OUT', FORCE_OUT:'FORCE_OUT', TAG_OUT:'TAG_OUT', APPEAL_OUT:'APPEAL_OUT', DOUBLE_PLAY:'DOUBLE_PLAY'
  });
  const Base = Object.freeze({ HOME:'HOME', FIRST:'1B', SECOND:'2B', THIRD:'3B' });
  const AirTypes = new Set(['FLY_BALL','LINE_DRIVE']);

  function assertSituation(s){
    if(!s||typeof s!=='object') throw new Error('Situation is required');
    if(!Number.isInteger(s.outs)||s.outs<0||s.outs>2) throw new Error('outs must be 0..2');
    if(!s.ball||!s.ball.type) throw new Error('ball.type is required');
    if(!s.player||!s.player.runnerId) throw new Error('player.runnerId is required');
  }
  function nextBase(base){ return ({HOME:Base.FIRST,'1B':Base.SECOND,'2B':Base.THIRD,'3B':Base.HOME})[base]||null; }
  function playerRunner(s){ return (s.runners||[]).find(r=>r.id===s.player.runnerId); }
  function isCaughtAirBall(s){ return AirTypes.has(s.ball.type) && s.ball.caught===true; }
  function isForceSituation(s,runner){
    if(!runner) return false;
    const occupied=new Set((s.runners||[]).map(r=>r.base));
    if(runner.base===Base.FIRST) return true;
    if(runner.base===Base.SECOND) return occupied.has(Base.FIRST);
    if(runner.base===Base.THIRD) return occupied.has(Base.FIRST)&&occupied.has(Base.SECOND);
    return false;
  }
  function chooseDefenseTarget(s,decision){
    const p=playerRunner(s);
    if(isCaughtAirBall(s)){
      if(decision===Decision.ADVANCE){
        return {targetRunnerId:p.id,targetBase:p.base,play:Primitive.APPEAL_OUT,reason:'CAUGHT_BALL_RETURN_OR_APPEAL',appeal:true};
      }
      return {targetRunnerId:null,targetBase:null,play:null,reason:'CAUGHT_BALL_NO_IMMEDIATE_PLAY'};
    }
    const force=isForceSituation(s,p), destination=p?nextBase(p.base):null;
    if(decision===Decision.ADVANCE&&force&&destination){
      return {targetRunnerId:p.id,targetBase:destination,play:Primitive.FORCE_OUT,reason:'FORCE_PLAY_PRIORITY'};
    }
    return {targetRunnerId:'BR',targetBase:Base.FIRST,play:Primitive.STEP_BASE,reason:'SECURE_BATTER_RUNNER'};
  }
  function buildRunnerRoute(s,decision){
    const p=playerRunner(s); if(!p) return [];
    if(isCaughtAirBall(s)){
      if(decision===Decision.RETURN) return [{actor:p.id,action:Primitive.RETURN,to:p.base,reason:'CAUGHT_BALL'}];
      if(decision===Decision.HOLD) return [{actor:p.id,action:Primitive.HOLD,at:p.base}];
      if(decision===Decision.READ) return [{actor:p.id,action:Primitive.READ_BALL,at:p.base}];
      return [{actor:p.id,action:Primitive.RUN,from:p.base,to:nextBase(p.base),illegalUntilTagUp:true}];
    }
    if(decision===Decision.ADVANCE) return [{actor:p.id,action:Primitive.RUN,from:p.base,to:nextBase(p.base)}];
    if(decision===Decision.RETURN) return [{actor:p.id,action:Primitive.RETURN,to:p.base}];
    if(decision===Decision.HOLD) return [{actor:p.id,action:Primitive.HOLD,at:p.base}];
    return [{actor:p.id,action:Primitive.READ_BALL,at:p.base}];
  }
  function buildBallRoute(s,defense){
    const f=s.ball.fielder||'FIELDER';
    const first={action:isCaughtAirBall(s)?Primitive.CATCH:Primitive.FIELD,actor:f,ballFrom:s.ball.zone||'BATTED_BALL'};
    if(!defense.targetBase) return [first];
    const route=[first,{action:Primitive.THROW,from:f,to:defense.targetBase}];
    if(defense.appeal) route.push({action:Primitive.APPEAL,actor:defense.targetBase,base:defense.targetBase,runnerId:defense.targetRunnerId});
    return route;
  }
  function terminalEvents(defense){
    if(!defense.play) return [];
    return [{action:defense.play,runnerId:defense.targetRunnerId,base:defense.targetBase}];
  }
  function resolve(situation,decision){
    assertSituation(situation);
    if(!Object.values(Decision).includes(decision)) throw new Error('Unknown player decision: '+decision);
    const defense=chooseDefenseTarget(situation,decision);
    return {
      engineVersion:VERSION,situationId:situation.id||null,decision,
      phase1:{type:'CAUSE_READ',ball:situation.ball,runners:situation.runners||[]},
      phase2:{type:'REACTION_CONSEQUENCE',runnerRoute:buildRunnerRoute(situation,decision),defenseStrategy:defense,ballRoute:buildBallRoute(situation,defense),terminalEvents:terminalEvents(defense)},
      trace:['SITUATION','PLAYER_DECISION:'+decision,'DEFENSE:'+defense.reason,'BALL_ROUTE','RUNNER_ROUTE','OUTCOME']
    };
  }
  function expandThreeBranches(s){ return [Decision.ADVANCE,Decision.HOLD,Decision.READ].map(decision=>({decision,plan:resolve(s,decision)})); }
  const api=Object.freeze({VERSION,Decision,Primitive,Base,resolve,expandThreeBranches,isForceSituation,isCaughtAirBall});
  global.RunnerKingEngineV2=api;
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
