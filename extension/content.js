(() => {
 const {defaults,clean,extract,videos,query,shuffle,mix,viewCount}=RelatedBefore;
 let settings={...defaults},host,key='',sequence=0,controller,scheduled=false,ready=false,lastRecorded='',items=[],generation=0;
 const cache=new Map();
 let statusKey='',statusValues={};
 const t=(name,values)=>NostalgicI18n.t(settings.language,name,values);
 function status(name,values={}){statusKey=name;statusValues=values;setText('#status',t(name,values));}
 function translate(){
   host.lang=settings.language==='es'?'es':'en';
   setText('#shuffle',t('mix'));setText('summary',t('addInterest'));setText('form button',t('add'));setText('.search',t('explore'));
   const input=host.querySelector('input');input.setAttribute('aria-label',t('addInterest'));input.placeholder=t('addPlaceholder');
   setText('#cutoff-label',t('before',{date:settings.cutoff}));
   setText('#context',(settings.interests.length?t('context',{n:settings.interests.length}):t('emptyContext'))+' · '+t('discoveryContext',{n:settings.discovery}));
   if(statusKey)setText('#status',t(statusKey,statusValues));
 }
 function node(tag,text,attrs={}){const e=document.createElement(tag);if(text)e.textContent=text;for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;}
 function setText(selector,value){const e=host.querySelector(selector);if(e.textContent!==value)e.textContent=value;}
 function recordSearch(){if(!ready || !settings.enabled || !settings.remember || location.pathname!=='/results' || lastRecorded===location.href)return;lastRecorded=location.href;const topic=clean(new URLSearchParams(location.search).get('search_query')).slice(0,80);if(topic)chrome.runtime.sendMessage({type:'nt-add',topic,automatic:true}).catch(()=>{});}
 function mount(){
   const home=location.pathname==='/',watch=location.pathname==='/watch';
   const anchor=home?document.querySelector('ytd-browse[page-subtype="home"]'):watch?document.querySelector('#secondary-inner'):null;
   document.documentElement.dataset.yarHome=String(Boolean(home && settings.enabled && settings.replaceHome && anchor));
   if(!settings.enabled || !anchor){host?.remove();return false;}
   if(!host){host=node('section','',{id:'yar-panel','aria-label':'NostalgicTube'});const bar=node('div','',{class:'yar-toolbar'}),details=node('details'),form=node('form');
     form.append(node('input','',{'aria-label':'Añadir interés',maxlength:'80',placeholder:'Añade un tema a tu mezcla',required:''}),node('button','Añadir',{type:'submit'}));details.append(node('summary','Añadir interés'),form);
     bar.append(node('span','NostalgicTube',{class:'yar-chip'}),node('span','',{id:'cutoff-label',class:'yar-chip'}),node('button','Otra mezcla',{id:'shuffle',type:'button'}),details,node('a','Explorar época ↗',{class:'search',target:'_blank',rel:'noopener'}),node('span','',{id:'context'}));
     host.append(bar,node('p','',{id:'status',role:'status','aria-live':'polite'}),node('div','',{class:'yar-results'}),node('div','',{id:'yar-payload',hidden:''}));
     form.onsubmit=async e=>{e.preventDefault();const input=host.querySelector('input');try{const result=await chrome.runtime.sendMessage({type:'nt-add',topic:input.value});if(result?.ok)input.value='';else status('interestError');}catch{status('interestError');}};
     host.querySelector('#shuffle').onclick=()=>{generation++;key='';load();};
     host.addEventListener('yar-native-ready',()=>{if(host.dataset.nativeState==='error')status('nativeError');});
   }
   if(host.parentNode!==anchor)anchor.prepend(host);host.dataset.place=home?'home':'watch';
   translate();return true;
 }
 function render(){host.querySelector('#yar-payload').textContent=JSON.stringify(items.map(v=>v.renderer));document.dispatchEvent(new Event('yar-render-native'));}
 function plan(){
   const topics=shuffle(settings.interests||[]).slice(0,4),cutoffYear=Number(settings.cutoff.slice(0,4));
   const lastYear=cutoffYear-(settings.cutoff.endsWith('01-01')?1:0),start=Math.max(2005,cutoffYear-5),year=start+Math.floor(Math.random()*Math.max(1,lastYear-start+1));
   const categories=shuffle(['musica hits','humor viral','videoclips','gaming momentos','videos virales','baile','animales divertidos']);
   const exploration=settings.discovery>0?categories.slice(0,topics.length?2:4).map(t=>({topic:t+' '+year,kind:'discovery',after:start+'-01-01'})):[];
   return [...topics.map(topic=>({topic,kind:'interest'})),...exploration];
 }
 async function fetchPool(job,signal){
   const q=query(job.topic,settings.cutoff,true)+(job.after?' after:'+job.after:'');const cached=cache.get(q);if(cached && Date.now()-cached.time<600000)return cached.items;
   const response=await fetch('/results?search_query='+encodeURIComponent(q),{signal,credentials:'same-origin'});if(!response.ok)throw Error('YouTube respondió con '+response.status);
   const list=videos(extract(await response.text())).filter(v=>YouTubeAntes.classify(v.published,settings.cutoff)==='old');
   for(const v of list){if(!Number.isFinite(v.views))v.views=0;}
   const sorted=job.kind==='discovery'?list.filter(v=>v.views>=100000).sort((a,b)=>b.views-a.views).slice(0,12):list;
   cache.set(q,{time:Date.now(),items:sorted});if(cache.size>40)cache.delete(cache.keys().next().value);return sorted;
 }
 async function load(){
   if(!ready || !host)return;
   const next=JSON.stringify([settings.cutoff,settings.interests,settings.discovery,generation]);if(next===key)return;key=next;
   controller?.abort();controller=new AbortController();const signal=controller.signal,run=++sequence;
   const jobs=plan(),pools=[],explore=[];let failed=0,completed=0;
   host.querySelector('.search').href='https://www.youtube.com/results?search_query='+encodeURIComponent(query('videos populares '+(Number(settings.cutoff.slice(0,4))-1),settings.cutoff));
   translate();items=[];render();status('loading');
   const timeout=setTimeout(()=>{if(run===sequence)controller.abort();},45000);
   try{
     let cursor=0;
     async function worker(){while(cursor<jobs.length && !signal.aborted){const job=jobs[cursor++];try{const list=await fetchPool(job,signal);if(run!==sequence)return;if(job.kind==='interest')pools.push(list);else explore.push(...list);}catch(e){failed++;if(e.name!=='AbortError')console.warn('NostalgicTube: source unavailable:',e.message);}completed++;if(run===sequence){items=mix(pools,explore,settings.interests.length?settings.discovery:100).filter(v=>v.id!==new URLSearchParams(location.search).get('v'));render();status('progress',{done:completed,total:jobs.length});}}}
     await Promise.all([worker(),worker()]);if(run!==sequence)return;
     const discoveries=items.filter(v=>v.origin==='discovery').length;
     if(items.length)status('results',{n:items.length,d:discoveries,partial:failed?t('partial'):''});else status('noResults');
   }finally{clearTimeout(timeout);}
 }
 function sync(){if(!ready)return;recordSearch();if(!mount()){controller?.abort();sequence++;key='';return;}load();}
 function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;sync();},700);}
 chrome.storage.local.get(defaults).then(s=>{settings=s;if(!Array.isArray(settings.interests))settings.interests=[];ready=true;sync();});
 chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local')return;let changed=false;for(const name of Object.keys(defaults))if(changes[name]){settings[name]=changes[name].newValue??defaults[name];if(name!=='language')changed=true;}if(changes.interests)cache.clear();if(changes.language && host){if(statusKey==='results')statusValues.partial=statusValues.partial?t('partial'):'';translate();}if(changed){key='';schedule();}});
 new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
 document.addEventListener('yt-navigate-finish',()=>{controller?.abort();sequence++;key='';schedule();});window.addEventListener('popstate',()=>{controller?.abort();sequence++;key='';schedule();});
})();
