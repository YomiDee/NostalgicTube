(() => {
 const defaults={enabled:true,cutoff:'2022-01-01',replaceHome:true,remember:true,learnVideos:true,discovery:25,discoveryLanguages:["en","es","pt","fr","de","it","ja","ru"],interests:[],language:'en',algorithmEpoch:0};
 const clean=s=>(s||'').replace(/(?:before|after):\S+/gi,'').replace(/["<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
 const text=x=>typeof x==='string'?x:x?.simpleText || x?.content || x?.runs?.map(r=>r.text).join('') || '';
 function extract(html) {
   const marker=/(?:var\s+ytInitialData\s*=|window\["ytInitialData"\]\s*=|\bytInitialData\s*=)\s*/g;
   let m;
   while((m=marker.exec(html))) {
     const start=html.indexOf('{',marker.lastIndex); if(start<0) continue;
     let depth=0,quoted=false,escape=false;
     for(let i=start;i<html.length;i++) {const c=html[i]; if(quoted){if(escape) escape=false;else if(c==='\\') escape=true;else if(c==='"') quoted=false;}else if(c==='"')quoted=true;else if(c==='{')depth++;else if(c==='}' && --depth===0){try{return JSON.parse(html.slice(start,i+1));}catch{break;}}}
   }
   throw Error('YouTube no ha devuelto resultados legibles. Puede requerir consentimiento o haber cambiado su formato.');
 }
 function videos(data) {
   const found=new Map();
   function walk(node) {
     if(!node || typeof node!=='object')return;
     const v=node.videoRenderer;
     if(v && /^[\w-]{11}$/.test(v.videoId||'')) found.set(v.videoId,{id:v.videoId,title:text(v.title),channel:text(v.ownerText||v.longBylineText),published:text(v.publishedTimeText),views:viewCount(text(v.viewCountText||v.shortViewCountText)),renderer:{videoRenderer:v}});
     const l=node.lockupViewModel;
     if(l && /^[\w-]{11}$/.test(l.contentId||'') && (!l.contentType || l.contentType==='LOCKUP_CONTENT_TYPE_VIDEO')) {
       const meta=l.metadata?.lockupMetadataViewModel;
       const parts=(meta?.metadata?.contentMetadataViewModel?.metadataRows||[]).flatMap(r=>(r.metadataParts||[]).map(p=>text(p.text)));
       found.set(l.contentId,{id:l.contentId,title:text(meta?.title),channel:parts[0]||'',published:parts.find(p=>YouTubeAntes.parse(p))||'',views:Math.max(0,...parts.map(viewCount)),renderer:{lockupViewModel:l}});
     }
     // No incorporar publicidad ni carruseles de Shorts ni recomendaciones ajenas a la búsqueda.
     for(const [key,value] of Object.entries(node)) if(!/adSlot|promoted|reelShelf|shorts/i.test(key)) {if(Array.isArray(value))value.forEach(walk);else walk(value);}
   }
   walk(data);return [...found.values()].filter(v=>v.title);
 }
 function query(topic,cutoff,broad=false) {
   let words=clean(topic).replace(/[|•]/g,' ').split(/\s+/).filter(Boolean);
   if(broad) words=words.filter(w=>! /^(el|la|los|las|un|una|de|del|en|y|a|con|the|a|an|of|and|in|to)$/i.test(w)).slice(0,5);
   return words.slice(0,14).join(' ')+' before:'+cutoff;
 }
 function viewCount(s){s=(s||'').toLowerCase().replace(/\u00a0/g,' ');if(/hace|ago/.test(s))return 0;const m=s.match(/([\d.,]+)\s*(mil millones|millones|million|billion|mil|m|k|b)\b/);if(m)return Number(m[1].replace(',','.'))*(/billion|mil millones|^b$/.test(m[2])?1e9:/million|^m$/.test(m[2])?1e6:1e3);return /visualiz|views|vistas/.test(s)?Number(s.replace(/[^\d]/g,''))||0:0;}
 function shuffle(list,random=Math.random){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function mix(pools,discovery,percent=25,limit=24,random=Math.random){
   const lanes=shuffle(pools.map(p=>shuffle(p,random)),random),groups=new Map(),seen=new Set(),out=[];let cursor=0,exploreCursor=0,discoveries=0;
   for(const video of discovery){const key=video.discoverySource||video.id;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(video);}
   const explore=shuffle([...groups.values()].map(group=>shuffle(group,random)),random);
   function take(lane,kind){while(lane.length){const video=lane.shift();if(!seen.has(video.id)){seen.add(video.id);out.push({...video,origin:kind});return true;}}return false;}
   function takeDiscovery(){for(let i=0;i<explore.length;i++){if(take(explore[exploreCursor++%explore.length],'discovery'))return true;}return false;}
   while(out.length<limit){
     const target=Math.round((out.length+1)*percent/100);
     if(discoveries<target&&takeDiscovery()){discoveries++;continue;}
     let picked=false;for(let i=0;i<lanes.length;i++){if(take(lanes[cursor++%lanes.length],'interest')){picked=true;break;}}
     if(!picked){if(!takeDiscovery())break;discoveries++;}
   }
   return out;
 }

 globalThis.RelatedBefore={defaults,clean,extract,videos,query,viewCount,shuffle,mix};
})();
