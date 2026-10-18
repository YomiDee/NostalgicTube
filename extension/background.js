importScripts('search.js');
let queue=Promise.resolve();
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
 if(!['nt-add','nt-remove','nt-clear'].includes(message?.type) || sender.id!==chrome.runtime.id)return;
 queue=queue.catch(()=>{}).then(async()=>{
   const state=await chrome.storage.local.get(RelatedBefore.defaults);
   let interests=Array.isArray(state.interests)?state.interests:[];
   if(message.type==='nt-add'){
     if(message.automatic && (!state.remember || !state.enabled))return {ok:true};
     const topic=RelatedBefore.clean(message.topic).slice(0,80);if(!topic)return {ok:false};
     const norm=t=>t.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
     if(!interests.some(t=>norm(t)===norm(topic)))interests=[...interests,topic].slice(-40);
   }else if(message.type==='nt-remove')interests=interests.filter(t=>t!==message.topic);
   else interests=[];
   await chrome.storage.local.set({interests});return {ok:true};
 });
 queue.then(reply).catch(()=>reply({ok:false}));return true;
});
