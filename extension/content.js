(() => {
 const {defaults,clean,extract,videos,query,shuffle,mix}=RelatedBefore;
 let settings={...defaults},host,key='',sequence=0,controller,scheduled=false,ready=false,lastRecorded='',items=[],generation=0;
 const cache=new Map();
 let busy=false,page=0,canLoadMore=false,autoPaused=false,moreMessage='',bottomObserver;
 let retryTimer=0,retryAttempts=0,jokeKey='',lastJokeAt=0;
 const loadingJokes=['loadingJokeSlop','loadingJokeSkynet','loadingJokeModem','loadingJokeCats','loadingJokeTimeMachine','loadingJokeRick','loadingJokeHumanity','loadingJokeVhs','loadingJokeBuffer','loadingJokeRobot','loadingJokePixels','loadingJokeTrends','loadingJokeInternet','loadingJokeNostalgia','loadingJokeFlash','loadingJokeDinosaur','loadingJokeUsb','loadingJokeComments','loadingJokePixelsMore','loadingJokeKeyboard','loadingJokeAlgorithm','loadingJokeDeLorean','loadingJokeBookmarks','loadingJokeDisk','loadingJokeClickbait','loadingJokeDoubleRainbow','loadingJokeScreensaver','loadingJokeInternetExplorer'];
 function rotateLoadingJoke(){
   if(!host?.isConnected||!settings.enabled||document.hidden||(!busy&&!retryTimer))return;
   if(jokeKey&&Date.now()-lastJokeAt<5000)return;
   const choices=loadingJokes.filter(key=>key!==jokeKey);jokeKey=choices[Math.floor(Math.random()*choices.length)];lastJokeAt=Date.now();
   setText('.yar-more-message',t(jokeKey));
 }

 function cancelRetry(){clearTimeout(retryTimer);retryTimer=0;}
 function queueRetry(run,networkFailure=false){
   cancelRetry();const delay=networkFailure?Math.min(60000,5000*2**Math.min(retryAttempts-1,4)):[1500,3000,6000,12000,20000][Math.min(retryAttempts-1,4)];
   const retry=()=>{if(run!==sequence || !settings.enabled || !host?.isConnected){cancelRetry();return;}if(document.hidden || !navigator.onLine){retryTimer=setTimeout(retry,5000);return;}retryTimer=0;load(true);};
   retryTimer=setTimeout(retry,delay);moreMessage=networkFailure?'sourceRetryWait':'autoRetryWait';autoPaused=true;if(!items.length)status('autoRetry');
 }
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
 setInterval(()=>{learnFromPlayback();rotateLoadingJoke();},1000);
 let statusKey='',statusValues={};
 const t=(name,values)=>NostalgicI18n.t(settings.language,name,values);
 function status(name,values={}){statusKey=['added','results','loading','progress','autoRetry'].includes(name)?'':name;statusValues=values;const element=host.querySelector('#status');element.hidden=!statusKey;setText('#status',statusKey?t(statusKey,values):'');}
 function translate(){
   host.lang=settings.language==='es'?'es':'en';
   setText('#shuffle',t('mix'));setText('.search',t('explore'));
   setText('#cutoff-label',t('before',{date:settings.cutoff}));
   setText('#context',settings.discovery===100?t('randomMix'):t('automaticMix')+' · '+t('discoveryContext',{n:settings.discovery}));
   if(statusKey)setText('#status',t(statusKey,statusValues));
   if(host.querySelector('.yar-more')){const active=busy||Boolean(retryTimer);setText('.yar-more-label',t(active?'loadingVideos':'more'));setText('.yar-more button',t('more'));setText('.yar-more-message',active&&jokeKey?t(jokeKey):'');host.querySelector('.yar-more button').hidden=active;if(active)rotateLoadingJoke();}
 }
 function node(tag,text,attrs={}){const e=document.createElement(tag);if(text)e.textContent=text;for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;}
 function setText(selector,value){const e=host.querySelector(selector);if(e.textContent!==value)e.textContent=value;}
 function recordSearch(){if(!ready || !settings.enabled || !settings.remember || location.pathname!=='/results' || lastRecorded===location.href)return;lastRecorded=location.href;const topic=clean(new URLSearchParams(location.search).get('search_query')).slice(0,80);if(topic)chrome.runtime.sendMessage({type:'nt-add',topic,automatic:true,epoch:settings.algorithmEpoch}).catch(()=>{});}
 function mount(){
   const home=location.pathname==='/',watch=location.pathname==='/watch';
   document.documentElement.dataset.yarWatch=String(Boolean(watch&&settings.enabled));
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
   if(host.parentNode!==anchor)anchor.prepend(host);
   const context=host.querySelector('#context'),toolbar=host.querySelector('.yar-toolbar');
   if(home){if(context.parentNode!==host)host.insertBefore(context,host.querySelector('#status'));}
   else if(context.parentNode!==toolbar)toolbar.append(context);
   const place=home?'home':'watch';if(host.dataset.place&&host.dataset.place!==place)host.querySelector('.yar-results').replaceChildren();host.dataset.place=place;
   translate();return true;
 }
 function render(batch=[],append=false){if(host.dataset.place==='watch'){NostalgicWatchCards.render(host.querySelector('.yar-results'),batch,append);return;}host.dataset.renderMode=append?'append':'replace';host.querySelector('#yar-payload').textContent=JSON.stringify(batch.map(v=>v.renderer));document.dispatchEvent(new Event('yar-render-native'));}
 function maybeMore(){if(!busy && canLoadMore && !autoPaused && host?.isConnected && settings.enabled){const r=host.querySelector('.yar-more').getBoundingClientRect();if(r.top<innerHeight+600 && r.bottom>0)load(true);}}
 function loading(value){busy=value;const more=host.querySelector('.yar-more');more.dataset.loading=String(value);more.setAttribute('aria-busy',String(value));more.querySelector('button').disabled=value;translate();}
 function plan(batchPage=0){
   if(settings.discovery===100)return NostalgicRandom.randomJobs(settings.cutoff);
   const topics=shuffle(settings.interests||[]).slice(0,4);
   const exploration=settings.discovery>0?NostalgicRandom.randomJobs(settings.cutoff,Math.random,topics.length?2:4).map(job=>({...job,kind:'discovery'})):[];
   return [...topics.map(topic=>NostalgicRandom.relatedJob(topic,settings.cutoff)),...exploration];
 }
 async function fetchPool(job,signal){
   const q=query(job.topic,job.cutoff||settings.cutoff,true)+(job.after?' after:'+job.after:''),cacheKey=job.kind+'|'+q;const cached=cache.get(cacheKey);if(cached && Date.now()-cached.time<600000)return cached.items;
   const request=new AbortController(),abort=()=>request.abort();
   signal.addEventListener('abort',abort,{once:true});if(signal.aborted)abort();
   const deadline=setTimeout(abort,8000);
   let list;
   try{
     const response=await fetch('/results?search_query='+encodeURIComponent(q),{signal:request.signal,credentials:'omit'});
     if(!response.ok){const error=Error('YouTube respondió con '+response.status);error.status=response.status;throw error;}
     list=videos(extract(await response.text())).filter(v=>YouTubeAntes.classify(v.published,settings.cutoff)==='old');
   }finally{clearTimeout(deadline);signal.removeEventListener('abort',abort);}

   const sampled=shuffle(list);
   if(sampled.length)cache.set(cacheKey,{time:Date.now(),items:sampled});if(cache.size>40)cache.delete(cache.keys().next().value);return sampled;
 }
 async function load(append=false){
   if(!ready || !host || (append && busy))return;
   const next=JSON.stringify([settings.cutoff,settings.discovery===100?null:settings.interests,settings.discovery,generation]);if(!append && next===key)return;key=next;
   cancelRetry();
   controller?.abort();controller=new AbortController();const signal=controller.signal,run=++sequence;
   if(!append){page=0;items=[];seen.clear();canLoadMore=false;autoPaused=false;retryAttempts=0;render();}else page++;
   let jobs=plan(page);if(retryAttempts){jobs=jobs.map(job=>({...job,after:undefined,cutoff:settings.cutoff}));if(retryAttempts>=3)jobs=jobs.slice(0,2);}
   const pools=[],explore=[];let failed=0,completed=0;
   host.querySelector('.search').href='https://www.youtube.com/results?search_query='+encodeURIComponent(query('videos populares '+(Number(settings.cutoff.slice(0,4))-1),settings.cutoff));
   moreMessage='';loading(true);if(!append)status('loading');
   const timeout=setTimeout(()=>{if(run===sequence)controller.abort();},18000);
   try{
     let cursor=0;
     const needsRelated=jobs.some(job=>job.kind==='interest'),needsExplore=jobs.some(job=>job.kind!=='interest');
     function enough(){const related=pools.flat().length,proportion=settings.interests.length?settings.discovery:100,prior=items.filter(v=>v.origin==='discovery').length,wanted=Math.max(0,Math.min(24,Math.round((items.length+24)*proportion/100)-prior));return related+explore.length>=24&&(!needsRelated||related>=24-wanted)&&(!needsExplore||explore.length>=wanted);}
     async function worker(){
       while(cursor<jobs.length && !signal.aborted){
         const job=jobs[cursor++];
         try{
           const list=await fetchPool(job,signal);if(run!==sequence)return;
           const collected=new Set([...pools.flat(),...explore].map(v=>v.id));
           const fresh=list.filter(v=>!seen.has(v.id)&&!collected.has(v.id)&&v.id!==new URLSearchParams(location.search).get('v'));
           if(job.kind==='interest')pools.push(fresh);else{const cap=settings.discovery===100||!settings.interests.length?2:Math.max(2,Math.ceil(24*settings.discovery/100/Math.max(1,jobs.filter(j=>j.kind!=='interest').length)));explore.push(...fresh.slice(0,cap).map(v=>({...v,discoverySource:job.topic})));}
           if(enough()){cursor=jobs.length;controller.abort();}
         }catch(e){
           if(!signal.aborted){failed++;if(e.status===429||e.status===403){cursor=jobs.length;retryAttempts=Math.max(retryAttempts,4);}}
         }
         completed++;if(run===sequence&&!append)status('progress',{done:completed,total:jobs.length});
       }
     }

     await Promise.all([worker(),worker()]);if(run!==sequence)return;
     const proportion=settings.interests.length?settings.discovery:100,priorDiscoveries=items.filter(v=>v.origin==='discovery').length;
     const target=Math.max(0,Math.min(24,Math.round((items.length+24)*proportion/100)-priorDiscoveries));
     const batch=mix(pools,explore,target/24*100);batch.forEach(v=>seen.add(v.id));items.push(...batch);render(batch,append);canLoadMore=true;
     autoPaused=batch.length===0;moreMessage='';
     const discoveries=items.filter(v=>v.origin==='discovery').length;
     if(batch.length){retryAttempts=0;status('added',{n:items.length,d:discoveries});}
     else if(jobs.length){retryAttempts++;queueRetry(run,failed>0&&pools.flat().length+explore.length===0);}
     else if(!items.length)status('learnFirst');
   }finally{clearTimeout(timeout);if(run===sequence){loading(false);host.querySelector('.yar-more').dataset.loading=String(Boolean(retryTimer));if(!retryTimer)setTimeout(maybeMore,400);}}
 }
 function sync(){if(!ready)return;recordSearch();if(!mount()){cancelRetry();controller?.abort();sequence++;key='';canLoadMore=false;busy=false;return;}load();}
 function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;sync();},700);}
 chrome.storage.local.get(defaults).then(s=>{settings=s;if(!Array.isArray(settings.interests))settings.interests=[];ready=true;sync();});
 chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local')return;let changed=false;for(const name of Object.keys(defaults))if(changes[name]){settings[name]=changes[name].newValue??defaults[name];if(name!=='language' && !(name==='interests' && settings.discovery===100))changed=true;}if(changes.interests && settings.discovery!==100)cache.clear();if(changes.algorithmEpoch){learnedVideos.clear();watchedSeconds=0;lastRecorded=location.href;}if(changes.language && host){if(statusKey==='results')statusValues.partial=statusValues.partial?t('partial'):'';translate();}if(changed){key='';schedule();}});
 new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
 window.addEventListener('scroll',()=>{if(!busy)maybeMore();},{passive:true});
 document.addEventListener('yt-navigate-finish',()=>{cancelRetry();controller?.abort();sequence++;key='';schedule();});window.addEventListener('popstate',()=>{cancelRetry();controller?.abort();sequence++;key='';schedule();});
})();
