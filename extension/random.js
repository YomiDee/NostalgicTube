/* Topic-independent discovery. This samples YouTube search results, not its entire catalogue. */
(() => {
 const seeds=('music|guitar|piano|drums|dance|concert|street|walking|rain|snow|summer|winter|beach|forest|mountain|river|train|bus|bicycle|motorcycle|skate|surf|football|basketball|chess|school|birthday|wedding|family|garden|cat|dog|bird|horse|fish|cooking|bread|cake|drawing|painting|animation|robot|computer|science|space|moon|game|arcade|festival|village|city|travel|camping|fishing|rehearsal|practice|test|demo|cover|reunion|ensayo|viaje|pueblo|fiesta|lluvia|verano|escuela|playa|comida|baile|carrera|tren|gato|perro|自転車|猫|散歩|空|guitare|voyage|pluie|festa|viaggio').split('|');
 function randomJobs(cutoff,random=Math.random){
   const choose=a=>a[Math.floor(random()*a.length)],limit=new Date(cutoff+'T00:00:00Z'),first=Date.UTC(2005,0,1),span=Math.max(1,limit.getTime()-first),jobs=[];
   for(let i=0;i<6;i++){
     const start=new Date(first+Math.floor(random()*span));start.setUTCHours(0,0,0,0);
     const end=new Date(Math.min(limit.getTime(),start.getTime()+(30+Math.floor(random()*150))*86400000));
     const topic=i===5?choose(['IMG','DSC','MOV','MVI'])+' '+String(1000+Math.floor(random()*9000)):choose(seeds);
     jobs.push({topic,kind:'random',after:start.toISOString().slice(0,10),cutoff:end.toISOString().slice(0,10)});
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
 globalThis.NostalgicRandom={randomJobs,relatedJob};
})();
