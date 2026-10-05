/* Dependency-free smoke validator for CI/manual review. Mirrors alpha.2 expected policy. */
const E=require('./baseball-decision-engine.js');
const S=require('./scenarios-alpha2.js');
const I=require('./invariants.js');
let fail=[];let branches=0;
for(const s of S){const xs=E.expandThreeBranches(s);if(xs.length!==3)fail.push(`${s.id}: branch count`);for(const x of xs){branches++;const z=I.inspect(x.plan);if(!z.ok)fail.push(`${s.id}/${x.decision}: ${z.errors.join(',')}`);}for(const [d,e] of Object.entries(s.expected||{})){const p=E.resolve(s,d).phase2.defenseStrategy;if(p.targetBase!==e.defenseBase)fail.push(`${s.id}/${d}: target ${p.targetBase} != ${e.defenseBase}`);if(p.reason!==e.reason)fail.push(`${s.id}/${d}: reason ${p.reason} != ${e.reason}`);}}
console.log(JSON.stringify({ok:!fail.length,scenarios:S.length,branches,failures:fail},null,2));if(fail.length)process.exit(1);
