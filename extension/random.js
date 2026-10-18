/* Discovery samples search candidates, not the full YouTube catalogue uniformly. */
(() => {
 const groups=NostalgicDiscoveryTerms,history=new Set(),historyLimit=256;
 const simple=groups.flatMap(g=>g.terms.map(topic=>({topic,language:g.language,category:g.category,source:'simple'})));
 const phrases=groups.flatMap(g=>g.terms.flatMap(term=>g.modifiers.map(modifier=>({topic:term+' '+modifier,language:g.language,category:g.category,source:'phrase'}))));
 const sample=random=>Math.max(0,Math.min(1-Number.EPSILON,Number(random())||0));
 const choose=(list,random)=>list[Math.floor(sample(random)*list.length)];
 const normalize=topic=>topic.normalize('NFKC').toLowerCase();
 function remember(topic){const key=normalize(topic);if(history.has(key))return false;history.add(key);if(history.size>historyLimit)history.delete(history.values().next().value);return true;}
 function fromPool(pool,random,categories=new Set(),languages=new Set()){
   const start=Math.floor(sample(random)*pool.length);
   for(let pass=0;pass<3;pass++)for(let i=0;i<pool.length;i++){
     const entry=pool[(start+i)%pool.length];if(pass<2&&categories.has(entry.category))continue;if(pass===0&&languages.has(entry.language))continue;
     if(remember(entry.topic))return entry;
   }
   return pool[start];
 }
 let cameraCursor=0;
 function camera(random,fallbackPool=simple){
   const prefixes=['IMG','DSC','MOV','MVI','VID','PICT'],joiners=[' ','_',''];
   for(let attempt=0;attempt<258;attempt++){
     const prefix=choose(prefixes,random),joiner=choose(joiners,random),number=attempt===0?Math.floor(sample(random)*10000):(cameraCursor++%10000);
     const topic=prefix+joiner+String(number).padStart(4,'0');if(remember(topic))return {topic,language:null,category:'camera',source:'camera'};
   }
   return fromPool(fallbackPool,random);
 }
 function randomJobs(cutoff,random=Math.random,count=6,selectedLanguages){
   const valid=new Set(groups.map(g=>g.language));
   const selected=Array.isArray(selectedLanguages)?selectedLanguages.filter(code=>valid.has(code)):[];
   const allowed=new Set(selected.length?selected:valid);
   const simplePool=simple.filter(entry=>allowed.has(entry.language)),phrasePool=phrases.filter(entry=>allowed.has(entry.language));
   const limit=new Date(cutoff+'T00:00:00Z'),first=Date.UTC(2005,0,1),span=limit.getTime()-first;
   if(!Number.isFinite(span)||span<=0)throw new Error('Invalid discovery cutoff');
   const strategies=['simple','phrase','simple','phrase','phrase','camera'];
   for(let i=strategies.length-1;i>0;i--){const j=Math.floor(sample(random)*(i+1));[strategies[i],strategies[j]]=[strategies[j],strategies[i]];}
   const jobs=[],categories=new Set(),languages=new Set();
   for(let i=0;i<Math.min(6,Math.max(0,count));i++){
     const strategy=strategies[i],entry=strategy==='camera'?camera(random,simplePool):fromPool(strategy==='simple'?simplePool:phrasePool,random,categories,languages);
     categories.add(entry.category);if(entry.language)languages.add(entry.language);
     const start=new Date(first+Math.floor(sample(random)*span));start.setUTCHours(0,0,0,0);
     const days=choose([30,90,180,365,1095],random),end=new Date(Math.min(limit.getTime(),start.getTime()+days*86400000));
     jobs.push({...entry,kind:'random',after:start.toISOString().slice(0,10),cutoff:end.toISOString().slice(0,10)});
   }
   return jobs;
 }
 function relatedJob(topic,cutoff,random=Math.random){
   if(random()<.25)return {topic,kind:'interest'};
   const limit=new Date(cutoff+'T00:00:00Z'),lastYear=limit.getUTCFullYear();
   const year=2005+Math.floor(random()*Math.max(1,lastYear-2005)),month=Math.floor(random()*12);
   const start=new Date(Date.UTC(year,month,1)),end=new Date(Date.UTC(year+2+Math.floor(random()*4),month,1));
   return {topic,kind:'interest',after:start.toISOString().slice(0,10),cutoff:new Date(Math.min(limit.getTime(),end.getTime())).toISOString().slice(0,10)};
 }
 globalThis.NostalgicRandom={randomJobs,relatedJob,stats:{languages:[...new Set(groups.map(g=>g.language))],baseTerms:simple.length,phraseCombinations:phrases.length,historyLimit}};
})();
