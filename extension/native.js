/* Queue incremental batches while YouTube's native card component loads. */
(() => {
 let target=null,pending=[],waiting=false;
 document.addEventListener('yar-render-native',()=>{
  const host=document.getElementById('yar-panel'),payload=host?.querySelector('#yar-payload');
  if(!host||host.dataset.place==='watch'||!payload||payload.textContent.length>3000000)return;
  let records;try{records=JSON.parse(payload.textContent);}catch{return;}
  if(!Array.isArray(records)||records.length>24)return;
  const contents=[];
  for(const renderer of records){const id=renderer?.videoRenderer?.videoId||renderer?.lockupViewModel?.contentId;if(/^[\w-]{11}$/.test(id||''))contents.push({richItemRenderer:{content:renderer}});}
  const append=host.dataset.renderMode==='append';
  if(host!==target||!append){target=host;pending=[];}
  pending.push({append,contents});flush();
 });
 async function flush(){
  if(waiting)return;waiting=true;let deadline;
  try{
   await Promise.race([customElements.whenDefined('ytd-rich-grid-renderer'),new Promise((_,reject)=>{deadline=setTimeout(()=>reject(Error('timeout')),12000);})]);
   const host=target,queue=pending;pending=[];
   if(!host?.isConnected||host.dataset.place==='watch')return;
   let grid=host.querySelector('ytd-rich-grid-renderer[data-yar-native]');
   if(!grid){grid=document.createElement('ytd-rich-grid-renderer');grid.setAttribute('data-yar-native','');host.querySelector('.yar-results').append(grid);}
   for(const batch of queue){
    if(batch.append&&grid.data?.contents&&typeof grid.push==='function')grid.push('data.contents',...batch.contents);
    else grid.data={contents:batch.append?[...(grid.data?.contents||[]),...batch.contents]:batch.contents};
   }
   host.dataset.nativeState='ready';host.dispatchEvent(new Event('yar-native-ready'));
  }catch{pending=[];if(target?.isConnected){target.dataset.nativeState='error';target.dispatchEvent(new Event('yar-native-ready'));}}
  finally{clearTimeout(deadline);waiting=false;}
 }
})();
