/* Structural invariants: reject impossible or incomplete OutcomePlans before rendering. */
(function(global){'use strict';
function inspect(plan){const errors=[];if(!plan||!plan.phase1||!plan.phase2)return {ok:false,errors:['MISSING_PHASE']};const p=plan.phase2;
if(!Array.isArray(p.runnerRoute))errors.push('RUNNER_ROUTE_NOT_ARRAY');
if(!Array.isArray(p.ballRoute))errors.push('BALL_ROUTE_NOT_ARRAY');
if(!Array.isArray(p.terminalEvents))errors.push('TERMINAL_EVENTS_NOT_ARRAY');
(p.ballRoute||[]).forEach((e,i)=>{if(e.action==='THROW'&&(!e.from||!e.to))errors.push('INVALID_THROW@'+i);if(e.action==='APPEAL'&&!e.base)errors.push('INVALID_APPEAL@'+i);});
(p.runnerRoute||[]).forEach((e,i)=>{if(e.action==='RUN'&&(!e.from||!e.to))errors.push('INVALID_RUN@'+i);if(e.action==='RETURN'&&!e.to)errors.push('INVALID_RETURN@'+i);});
(p.terminalEvents||[]).forEach((e,i)=>{if((e.action==='FORCE_OUT'||e.action==='TAG_OUT'||e.action==='APPEAL_OUT')&&(!e.runnerId||!e.base))errors.push('INVALID_OUT@'+i);});
return {ok:errors.length===0,errors};}
global.RunnerKingV2Invariants={inspect};if(typeof module!=='undefined'&&module.exports)module.exports={inspect};})(typeof window!=='undefined'?window:globalThis);
