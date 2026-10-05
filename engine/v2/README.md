# Runner King V2 Baseball Decision Engine

## Objective

Replace per-question hard-coded consequence animations with a deterministic, rule-driven plan:

`Situation -> Player Decision -> Defense Strategy -> Ball Route -> Runner Route -> Outcome -> Renderer`

The 864 situations are a validation matrix, not 864 independent animation programs. Three player branches produce at least 2,592 decision cases, but they must be assembled from reusable baseball primitives.

## Two animation phases

### Phase 1 — Cause / Read
The batted ball and initial fielding action create the situation. Animation pauses at the decision point.

### Decision Point
Player chooses one of the exposed game choices. Current compatibility target is three branches: ADVANCE / HOLD / READ. RETURN exists as a primitive for future rule expansion.

### Phase 2 — Reaction / Consequence
The resolver recalculates the field state after the player's choice, selects a defense objective, creates ball and runner routes, resolves terminal events, then hands an `OutcomePlan` to the renderer.

## Core contract

The renderer must never decide baseball strategy. It only renders instructions such as:

- `FIELD(SS)`
- `THROW(SS, 2B)`
- `RUN(R1, 2B)`
- `STEP_BASE(2B)`
- `FORCE_OUT(R1)`

Baseball logic belongs in the resolver.

## Current alpha primitives

Defense: FIELD, CATCH, THROW, RELAY, STEP_BASE, TAG_RUNNER, APPEAL.

Runner: RUN, HOLD, RETURN, TAG_UP, SLIDE, BRAKE, SCORE, BLOCKED.

Outcome: SAFE, OUT, FORCE_OUT, TAG_OUT, DOUBLE_PLAY.

## Validation gates

1. Representative fixtures: 20–50 situations covering force/non-force, fly/ground/line ball, tag-up, two outs, multiple runners, scoring plays and appeals.
2. Every situation expands to three player branches without missing routes.
3. Baseball invariants reject impossible state transitions.
4. Red-team review checks alternative defensive choices and ambiguous plays.
5. Only after representative fixtures pass do we expand the 864 matrix.
6. The production renderer is connected only after the resolver output schema is stable.

## Alpha status

The first implementation intentionally supports only a small deterministic subset: force recognition and a basic defensive target policy. It is architecture scaffolding, not a claim that all baseball strategy is solved.

Next rule modules: fly-ball/tag-up, caught-ball return/appeal, lead-runner priority, two-out optimization, relay/cutoff, multi-runner congestion, scoring timing and double-play continuation.
