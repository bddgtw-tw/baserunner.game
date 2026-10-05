const engine = require('./baseball-decision-engine.js');
const scenarios = require('./scenarios-alpha2.js');
const invariants = require('./invariants.js');
const validation = require('./run-alpha2-validation.js');
const result = validation.run(engine, scenarios, invariants);
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;
