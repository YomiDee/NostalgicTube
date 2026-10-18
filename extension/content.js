(() => {
 const {defaults,clean,extract,videos,query,shuffle,mix,viewCount}=RelatedBefore;
 let settings={...defaults},host,key='',sequence=0,controller,scheduled=false,ready=false,lastRecorded='',items=[],generation=0;
 const cache=new Map();
 let busy=false,page=0,canLoadMore=false,autoPaused=false,moreMessage='',bottomObserver;
 const seen=new Set();
 const learnedVideos=new Set();
 let watchId='',watchTitle='',watchedSeconds=0,lastVideoTime=0,lastWatchTick=0,learningPending=false;
 function learnFromPlayback(){
   const now=performance.now(),id=location.pathname==='/watch'?new URLSearchParams(location.search).get('v'):null;
   const video=document.querySelector('#movie_player video.html5-main-video,video.html5-main-video');
   const title=(document.querySelector('ytd-watch-metadata h1 yt-formatted-string,ytd-watch-metadata h1')?.textContent||'').trim();
   const docTitle=document.title.replace(/^\(\d+\)\s*/,'').replace(/ - YouTube$/,'').trim();
   const owner=document.querySelector('ytd-watch-flexy')?.getAttribute('video-id');
   if(id!==watchId || title!==watchTitle){watchId=id;watchTitle=title;watchedSeconds=0;lastVideoTime=video?.currentTime||0;lastWatchTick=now;return;}
   const elapsed=Math.min(1.5,(now-lastWatchTick)/1000),delta=(video?.currentTime||0)-lastVideoTime;
   lastWatchTick=now;lastVideoTime=video?.currentTime||0;
   if(!ready || !settings.enabled || !settings.learnVideos || !id || learnedVideos.has(id) || !video || video.paused || video.ended || document.hidden || document.querySelector('#movie_player.ad-showing') || (owner && owner!==id) || !title || title!==docTitle)return;
   // Only actual, visible playback counts. Seeks and large jumps do not count.
   if(delta>0 && delta<=elapsed+0.6)watchedSeconds+=Math.min(delta,elapsed);
   if(watchedSeconds<12 || learningPending)return;
   learningPending=true;
   const epoch=settings.algorithmEpoch;
   chrome.runtime.sendMessage({type:'nt-learn',title:title.slice(0,500),epoch}).then(result=>{if(result?.ok && settings.algorithmEpoch===epoch){learnedVideos.add(id);if(learnedVideos.size>200)learnedVideos.delete(learnedVideos.values().next().value);}}).catch(()=>{}).finally(()=>{learningPending=false;});
 }
 setInterval(learnFromPlayback,1000);
 let statusKey='',statusValues={};
 const t=(name,values)=>NostalgicI18n.t(settings.language,name,values);
 function status(name,values={}){statusKey=name;statusValues=values;setText('#status',t(name,values));}
 function translate(){
   host.lang=settings.language==='es'?'es':'en';
   setText('#shuffle',t('mix'));setText('.search',t('explore'));
   setText('#cutoff-label',t('before',{date:settings.cutoff}));
   setText('#context',t('automaticMix')+' · '+t('discoveryContext',{n:settings.discovery}));
   if(statusKey)setText('#status',t(statusKey,statusValues));
   if(host.querySelector('.yar-more')){setText('.yar-more-label',t('more'));setText('.yar-more button',t(busy?'loadingMore':autoPaused?'retryMore':'more'));setText('.yar-more-message',moreMessage?t(moreMessage):'');}
 }
 function node(tag,text,attrs={}){const e=document.createElement(tag);if(text)e.textContent=text;for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;}
 function setText(selector,value){const e=host.querySelector(selector);if(e.textContent!==value)e.textContent=value;}
 function recordSearch(){if(!ready || !settings.enabled || !settings.remember || location.pathname!=='/results' || lastRecorded===location.href)return;lastRecorded=location.href;const topic=clean(new URLSearchParams(location.search).get('search_query')).slice(0,80);if(topic)chrome.runtime.sendMessage({type:'nt-add',topic,automatic:true,epoch:settings.algorithmEpoch}).catch(()=>{});}
 function mount(){
   const home=location.pathname==='/',watch=location.pathname==='/watch';
   const anchor=home?document.querySelector('ytd-browse[page-subtype="home"]'):watch?document.querySelector('#secondary-inner'):null;
   document.documentElement.dataset.yarHome=String(Boolean(home && settings.enabled && settings.replaceHome && anchor));
   if(!settings.enabled || !anchor){host?.remove();return false;}
   if(!host){host=node('section','',{id:'yar-panel','aria-label':'NostalgicTube'});const bar=node('div','',{class:'yar-toolbar'});
     bar.append(node('span','NostalgicTube',{class:'yar-chip'}),node('span','',{id:'cutoff-label',class:'yar-chip'}),node('button','Otra mezcla',{id:'shuffle',type:'button'}),node('a','Explorar época ↗',{class:'search',target:'_blank',rel:'noopener'}),node('span','',{id:'context'}));
     const more=node('div','',{class:'yar-more','data-loading':'false'});more.append(node('span','',{class:'yar-spinner','aria-hidden':'true'}),node('p','',{class:'yar-more-label'}),node('p','',{class:'yar-more-message',role:'status','aria-live':'polite'}),node('button','',{type:'button'}));
     host.append(bar,node('p','',{id:'status',role:'status','aria-live':'polite'}),node('div','',{class:'yar-results'}),more,node('div','',{id:'yar-payload',hidden:''}));
     more.querySelector('button').onclick=()=>{autoPaused=false;load(true);};
     bottomObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))maybeMore();},{rootMargin:'600px 0px'});bottomObserver.observe(more);
     host.querySelector('#shuffle').onclick=()=>{generation++;key='';load();};
     host.addEventListener('yar-native-ready',()=>{if(host.dataset.nativeState==='error')status('nativeError');});
   }
   if(host.parentNode!==anchor)anchor.prepend(host);host.dataset.place=home?'home':'watch';
   translate();return true;
 }
 function render(batch=[],append=false){host.dataset.renderMode=append?'append':'replace';host.querySelector('#yar-payload').textContent=JSON.stringify(batch.map(v=>v.renderer));document.dispatchEvent(new Event('yar-render-native'));}
 function maybeMore(){if(!busy && canLoadMore && !autoPaused && host?.isConnected && settings.enabled){const r=host.querySelector('.yar-more').getBoundingClientRect();if(r.top<innerHeight+600 && r.bottom>0)load(true);}}
 function loading(value){busy=value;const more=host.querySelector('.yar-more');more.dataset.loading=String(value);more.setAttribute('aria-busy',String(value));more.querySelector('button').disabled=value;translate();}
 function plan(batchPage=0){
   const topics=shuffle(settings.interests||[]).slice(0,4),cutoffYear=Number(settings.cutoff.slice(0,4));
   const lastYear=cutoffYear-(settings.cutoff.endsWith('01-01')?1:0),start=Math.max(2005,cutoffYear-5),year=start+Math.floor(Math.random()*Math.max(1,lastYear-start+1));
   const categories=shuffle(['musica hits','humor viral','videoclips','gaming momentos','videos virales','baile','animales divertidos']);
   const exploration=settings.discovery>0?categories.slice(0,topics.length?2:4).map(t=>({topic:t+' '+year,kind:'discovery',after:start+'-01-01'})):[];
   return [...topics.map((topic,index)=>{if(!batchPage)return {topic,kind:'interest'};const year=lastYear-((batchPage-1+index)%Math.max(1,lastYear-2005+1));return {topic,kind:'interest',after:year+'-01-01',cutoff:year===cutoffYear?settings.cutoff:(year+1)+'-01-01'};}),...exploration];
 }
 async function fetchPool(job,signal){
   const q=query(job.topic,job.cutoff||settings.cutoff,true)+(job.after?' after:'+job.after:'');const cached=cache.get(q);if(cached && Date.now()-cached.time<600000)return cached.items;
   const response=await fetch('/results?search_query='+encodeURIComponent(q),{signal,credentials:'same-origin'});if(!response.ok)throw Error('YouTube respondió con '+response.status);
   const list=videos(extract(await response.text())).filter(v=>YouTubeAntes.classify(v.published,settings.cutoff)==='old');
   for(const v of list){if(!Number.isFinite(v.views))v.views=0;}
   const sorted=job.kind==='discovery'?list.filter(v=>v.views>=100000).sort((a,b)=>b.views-a.views).slice(0,12):list;
   cache.set(q,{time:Date.now(),items:sorted});if(cache.size>40)cache.delete(cache.keys().next().value);return sorted;
 }
 async function load(append=false){
   if(!ready || !host || (append && busy))return;
   const next=JSON.stringify([settings.cutoff,settings.interests,settings.discovery,generation]);if(!append && next===key)return;key=next;
   controller?.abort();controller=new AbortController();const signal=controller.signal,run=++sequence;
   if(!append){page=0;items=[];seen.clear();canLoadMore=false;autoPaused=false;render();}else page++;
   const jobs=plan(page),pools=[],explore=[];let failed=0,completed=0;
   host.querySelector('.search').href='https://www.youtube.com/results?search_query='+encodeURIComponent(query('videos populares '+(Number(settings.cutoff.slice(0,4))-1),settings.cutoff));
   moreMessage='';loading(true);if(!append)status('loading');
   const timeout=setTimeout(()=>{if(run===sequence)controller.abort();},45000);
   try{
     let cursor=0;
     async function worker(){while(cursor<jobs.length && !signal.aborted){const job=jobs[cursor++];try{const list=await fetchPool(job,signal);if(run!==sequence)return;const fresh=list.filter(v=>!seen.has(v.id) && v.id!==new URLSearchParams(location.search).get('v'));if(job.kind==='interest')pools.push(fresh);else explore.push(...fresh);}catch(e){failed++;if(e.name!=='AbortError')console.warn('NostalgicTube: source unavailable:',e.message);}completed++;if(run===sequence && !append)status('progress',{done:completed,total:jobs.length});}}
     await Promise.all([worker(),worker()]);if(run!==sequence)return;
     const batch=mix(pools,explore,settings.interests.length?settings.discovery:100);batch.forEach(v=>seen.add(v.id));items.push(...batch);render(batch,append);canLoadMore=true;
     autoPaused=batch.length===0 || failed===jobs.length;moreMessage=autoPaused?(failed?'moreFailed':'emptyMore'):'';
     const discoveries=items.filter(v=>v.origin==='discovery').length;
     if(items.length)status('added',{n:items.length,d:discoveries});else status('noResults');
   }finally{clearTimeout(timeout);if(run===sequence){loading(false);setTimeout(maybeMore,400);}}
 }
 function sync(){if(!ready)return;recordSearch();if(!mount()){controller?.abort();sequence++;key='';canLoadMore=false;busy=false;return;}load();}
 function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;sync();},700);}
 chrome.storage.local.get(defaults).then(s=>{settings=s;if(!Array.isArray(settings.interests))settings.interests=[];ready=true;sync();});
 chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local')return;let changed=false;for(const name of Object.keys(defaults))if(changes[name]){settings[name]=changes[name].newValue??defaults[name];if(name!=='language')changed=true;}if(changes.interests)cache.clear();if(changes.algorithmEpoch){learnedVideos.clear();watchedSeconds=0;lastRecorded=location.href;}if(changes.language && host){if(statusKey==='results')statusValues.partial=statusValues.partial?t('partial'):'';translate();}if(changed){key='';schedule();}});
 new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
 window.addEventListener('scroll',()=>{if(!busy)maybeMore();},{passive:true});
 document.addEventListener('yt-navigate-finish',()=>{controller?.abort();sequence++;key='';schedule();});window.addEventListener('popstate',()=>{controller?.abort();sequence++;key='';schedule();});
})();
