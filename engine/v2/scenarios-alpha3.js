/* Alpha.3 focused fixtures: legal tag-up vs early leave. */
(function(g){'use strict';const S=[];const add=(id,outs,base,ball,runner,expected)=>S.push({id,outs,ball,runners:[{id:'R',base,...runner}],player:{runnerId:'R'},expected});
add('SF_R3_LEGAL',0,'3B',{type:'FLY_BALL',zone:'RF',fielder:'RF',caught:true},{taggedUp:true},{reason:'CHALLENGE_LEGAL_TAG_UP',targetBase:'HOME',play:'TAG_OUT'});
add('SF_R3_EARLY',0,'3B',{type:'FLY_BALL',zone:'CF',fielder:'CF',caught:true},{leftBeforeCatch:true},{reason:'LEFT_EARLY_APPEAL',targetBase:'3B',play:'APPEAL_OUT'});
add('F_R2_LEGAL',1,'2B',{type:'FLY_BALL',zone:'RF',fielder:'RF',caught:true},{leftAfterCatch:true},{reason:'CHALLENGE_LEGAL_TAG_UP',targetBase:'3B',play:'TAG_OUT'});
add('F_R2_EARLY',1,'2B',{type:'FLY_BALL',zone:'LF',fielder:'LF',caught:true},{leftBeforeCatch:true},{reason:'LEFT_EARLY_APPEAL',targetBase:'2B',play:'APPEAL_OUT'});
add('LD_R1_EARLY',0,'1B',{type:'LINE_DRIVE',zone:'SS',fielder:'SS',caught:true},{leftBeforeCatch:true},{reason:'LEFT_EARLY_APPEAL',targetBase:'1B',play:'APPEAL_OUT'});
add('LD_R1_LEGAL',0,'1B',{type:'LINE_DRIVE',zone:'2B',fielder:'2B',caught:true},{taggedUp:true},{reason:'CHALLENGE_LEGAL_TAG_UP',targetBase:'2B',play:'TAG_OUT'});
g.RunnerKingV2ScenariosAlpha3=S;if(typeof module!=='undefined'&&module.exports)module.exports=S;})(typeof window!=='undefined'?window:globalThis);
