# V2 Engine Alpha.2 — Red Team

Do not connect this resolver to production animation yet.

## Known deliberate gaps

1. A caught fly ball is not automatically an appeal out when the runner chooses ADVANCE. Legal tag-up timing is not yet modeled. Alpha.2 marks the route as `illegalUntilTagUp`; timing resolution comes next.
2. Defense target selection is a policy scaffold, not an optimal-defense solver. Throw distance, fielder arm, runner speed, lead runner value, score/inning and throw risk are not modeled.
3. A dropped fly/line ball currently reuses ground-ball force logic. This is structurally useful but strategically incomplete.
4. Batter-runner state is implicit (`BR`). It must become an explicit runner entity before multi-out continuation is trusted.
5. Double-play continuation is not resolved yet. `DOUBLE_PLAY` exists only as a primitive.
6. Tag plays versus force plays after force removal are not yet recalculated as state changes occur.
7. Scoring timing (third out force vs timing play) is not implemented.
8. Infield fly, interference/obstruction, dropped third strike and special-rule cases are outside alpha.2 scope.

## Gate for alpha.3

Implement legal tag-up state/timing, explicit batter-runner, state mutation after each out, and defense candidate scoring. Then expand fixtures to 30+ cases including legal sacrifice-fly advances and double-play continuation.
