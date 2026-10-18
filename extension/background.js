importScripts('search.js','topics.js');
let queue=Promise.resolve();
const recentSearches=new Map();
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
 if(!['nt-add','nt-learn','nt-clear'].includes(message?.type) || sender.id!==chrome.runtime.id)return;
 queue=queue.catch(()=>{}).then(async()=>{
   const state=await chrome.storage.local.get(RelatedBefore.defaults);
   let interests=Array.isArray(state.interests)?state.interests:[];
   if(message.type==='nt-add' || message.type==='nt-learn'){
     if(message.epoch!==state.algorithmEpoch)return {ok:true};
     if(message.type==='nt-add'){
       let source;try{source=new URL(sender.url);}catch{return {ok:false};}
       if(!message.automatic||source.origin!=='https://www.youtube.com'||(source.pathname!=='/results'&&message.submitted!==true))return {ok:false};
     }
     if(message.type==='nt-learn' && !sender.url?.startsWith('https://www.youtube.com/watch?'))return {ok:false};
     if(message.type==='nt-learn' && (!state.enabled || !state.learnVideos))return {ok:true};
     if(message.automatic && (!state.remember || !state.enabled))return {ok:true};
     const topic=message.type==='nt-learn'?NostalgicTopics.extractTopic(message.title,interests):RelatedBefore.clean(message.topic).slice(0,80);if(!topic)return {ok:true};
     const norm=t=>t.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
     if(message.type==='nt-add'){
       const searchKey=String(sender.tab?.id)+':'+norm(topic),now=Date.now();
       if(now-(recentSearches.get(searchKey)||0)<5000)return {ok:true};
       recentSearches.set(searchKey,now);
       if(recentSearches.size>100)recentSearches.delete(recentSearches.keys().next().value);
     }
     if(!interests.some(t=>norm(t)===norm(topic)))interests=[...interests,topic].slice(-10000);
   }else {interests=[];await chrome.storage.local.set({interests,algorithmEpoch:state.algorithmEpoch+1});return {ok:true};}
   await chrome.storage.local.set({interests,interestRevision:(state.interestRevision||0)+1});return {ok:true};
 });
 queue.then(reply).catch(()=>reply({ok:false}));return true;
});
