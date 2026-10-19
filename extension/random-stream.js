/* Bounded, progressive discovery batches. Metadata is filtered by fetchPool. */
(() => {
 async function collect({jobs,fetchPool,signal,isCurrent,seen,currentId,onChunk,concurrency=3,limit=24}){
  const lanes=[],reserved=new Set(seen),emitted=[],sourceCounts=new Map();let cursor=0,failed=0,throttled=false,lastSource='';
  function drain(final=false){
   if(!isCurrent())return;
   const chunk=[];
   // Show two immediately; retain the other two briefly for interleaving.
   const room=!final&&lanes.length===1?Math.max(0,2-emitted.length):limit-emitted.length;
   while(chunk.length<room&&emitted.length<limit){
    const available=lanes.filter(lane=>lane.items.length);if(!available.length)break;
    const lane=available.find(lane=>lane.source!==lastSource)||available[0];
    const video=lane.items.shift();lastSource=lane.source;emitted.push(video);chunk.push(video);
   }
   if(chunk.length)onChunk(chunk);
  }
  async function worker(){
   while(cursor<jobs.length&&!signal.aborted&&!throttled&&isCurrent()&&emitted.length<limit){
    const job=jobs[cursor++];
    try{
     const list=await fetchPool(job,signal);if(!isCurrent()||signal.aborted)return;
     const source=job.topic,selected=[];
     for(const video of list){
      if((sourceCounts.get(source)||0)>=4)break;
      if(!video.id||video.id===currentId||reserved.has(video.id))continue;
      reserved.add(video.id);sourceCounts.set(source,(sourceCounts.get(source)||0)+1);
      selected.push({...video,origin:'discovery',discoverySource:source});
     }
     if(selected.length)lanes.push({source,items:selected});drain();
    }catch(error){if(!signal.aborted){failed++;if(error.status===429||error.status===403)throttled=true;}}
   }
  }
  await Promise.all(Array.from({length:Math.min(concurrency,jobs.length)},()=>worker()));
  drain(true);
  return {count:emitted.length,failed,throttled};
 }
 globalThis.NostalgicRandomStream={collect};
})();
