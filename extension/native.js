/* Puente limitado al renderizado de los propios componentes de YouTube. */
(() => {
 let revision=0;
 document.addEventListener('yar-render-native',async()=>{
   const host=document.getElementById('yar-panel');
   const payload=host?.querySelector('#yar-payload');
   if(!host || host.dataset.place==='watch' || !payload || payload.textContent.length>3000000)return;
   let records;try{records=JSON.parse(payload.textContent);}catch{return;}
   if(!Array.isArray(records) || records.length>24)return;
   const contents=[];
   for(const renderer of records){
     const id=renderer?.videoRenderer?.videoId || renderer?.lockupViewModel?.contentId;
     if(!/^[\w-]{11}$/.test(id||''))continue;
     contents.push({richItemRenderer:{content:renderer}});
   }
   const run=++revision;
   try{
     await Promise.race([customElements.whenDefined('ytd-rich-grid-renderer'),new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),12000))]);
     if(run!==revision || !host.isConnected || host.dataset.place==='watch')return;
     let grid=host.querySelector('ytd-rich-grid-renderer[data-yar-native]');
     if(!grid){grid=document.createElement('ytd-rich-grid-renderer');grid.setAttribute('data-yar-native','');host.querySelector('.yar-results').append(grid);}
     const append=host.dataset.renderMode==='append';
     if(append && grid.data?.contents && typeof grid.push==='function')grid.push('data.contents',...contents);
     else grid.data={contents:append?[...(grid.data?.contents||[]),...contents]:contents};
     host.dataset.nativeState='ready';
     host.dispatchEvent(new Event('yar-native-ready'));
   }catch{
     if(run===revision && host.isConnected){host.dataset.nativeState='error';host.dispatchEvent(new Event('yar-native-ready'));}
   }
 });
})();
