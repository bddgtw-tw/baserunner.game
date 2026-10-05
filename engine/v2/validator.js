/* V2 deterministic validator. Run in browser console after engine + scenarios load,
 * or under Node with require() when files are available locally.
 */
(function (global) {
  'use strict';

  function validate(engine, scenarios) {
    const failures = [];
    let assertions = 0;

    scenarios.forEach(s => {
      const branches = engine.expandThreeBranches(s);
      assertions++;
      if (branches.length !== 3) failures.push({ id: s.id, error: 'Expected exactly 3 player branches' });

      branches.forEach(({ decision, plan }) => {
        assertions++;
        if (!plan.phase1 || !plan.phase2) failures.push({ id: s.id, decision, error: 'Missing phase plan' });
        assertions++;
        if (!Array.isArray(plan.phase2.ballRoute) || !Array.isArray(plan.phase2.runnerRoute)) failures.push({ id: s.id, decision, error: 'Routes must be arrays' });
      });

      Object.entries(s.expected || {}).forEach(([decision, expected]) => {
        const plan = engine.resolve(s, decision);
        assertions++;
        if (plan.phase2.defenseStrategy.targetBase !== expected.defenseBase) {
          failures.push({ id: s.id, decision, error: `Defense target ${plan.phase2.defenseStrategy.targetBase} != ${expected.defenseBase}` });
        }
        assertions++;
        if (plan.phase2.defenseStrategy.reason !== expected.reason) {
          failures.push({ id: s.id, decision, error: `Defense reason ${plan.phase2.defenseStrategy.reason} != ${expected.reason}` });
        }
      });
    });

    return { ok: failures.length === 0, scenarios: scenarios.length, assertions, failures };
  }

  global.RunnerKingV2Validator = { validate };
  if (typeof module !== 'undefined' && module.exports) module.exports = { validate };
})(typeof window !== 'undefined' ? window : globalThis);
