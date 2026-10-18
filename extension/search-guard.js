/* Keep before: in the actual search URL, but display a clean YouTube search field.
   Feed fetches retain their own narrower date windows. */
(() => {
 let settings={enabled:true,cutoff:'2022-01-01',remember:true,algorithmEpoch:0},ready=false,submitted='',scheduled=false;
 const displayed=new WeakMap();
 const strip=query=>String(query||'').replace(/\bbefore\s*:\s*(?:"[^"]*"|\S+)/gi,' ').replace(/\s+/g,' ').trim();
 const apply=query=>(strip(query)?strip(query)+' ':'')+'before:'+settings.cutoff;
 function conceal(){
  scheduled=false;if(!ready)return;
  const raw=location.pathname==='/results'?new URL(location.href).searchParams.get('search_query'):null;
  for(const input of document.querySelectorAll('input[name="search_query"],ytd-searchbox input#search,yt-searchbox input#search')){
   if(!(input instanceof HTMLInputElement))continue;
   const previous=displayed.get(input);
   if(!settings.enabled){if(previous&&input.value===previous.clean)input.value=previous.raw;displayed.delete(input);continue;}
   // Change only the displayed property. Do not dispatch input/change events here:
   // YouTube keeps the real filtered query in its model and request URL.
   const value=input.value;
   if(value!==raw&&value!==submitted)continue;
   const clean=strip(value);if(clean===value)continue;
   const start=input.selectionStart,end=input.selectionEnd;
   input.value=clean;displayed.set(input,{raw:value,clean});
   if(document.activeElement===input&&typeof start==='number')try{input.setSelectionRange(Math.min(start,clean.length),Math.min(end??start,clean.length));}catch{}
  }
 }
 function schedule(){if(scheduled)return;scheduled=true;setTimeout(conceal,0);}
 function enforce(){
  if(!ready||!settings.enabled||location.pathname!=='/results'){schedule();return;}
  const url=new URL(location.href),query=url.searchParams.get('search_query');if(query===null)return;
  const next=apply(query);if(query!==next){url.searchParams.set('search_query',next);location.replace(url.href);}else schedule();
 }
 function prepare(input){
  if(!ready||!settings.enabled||!(input instanceof HTMLInputElement))return;
  if(input.name!=='search_query'&&!input.closest('ytd-searchbox,yt-searchbox'))return;
  const topic=strip(input.value).slice(0,500);
  if(topic&&settings.remember)chrome.runtime?.sendMessage({type:'nt-add',topic,automatic:true,submitted:true,epoch:settings.algorithmEpoch}).catch(()=>{});
  const next=apply(input.value);submitted=next;
  if(input.value!==next){input.value=next;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));}
  schedule();
 }
 document.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing)prepare(e.target);},true);
 document.addEventListener('submit',e=>prepare(e.target.querySelector?.('input[name="search_query"],input')),true);
 document.addEventListener('yt-navigate-finish',enforce);document.addEventListener('yt-page-data-updated',schedule);window.addEventListener('popstate',enforce);
 new MutationObserver(schedule).observe(document,{childList:true,subtree:true});
 setInterval(()=>{if(!document.hidden)conceal();},500);
 chrome.storage.local.get(settings).then(s=>{settings=s;ready=true;enforce();}).catch(()=>{});
 chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local')return;for(const name of ['enabled','cutoff','remember','algorithmEpoch'])if(changes[name])settings[name]=changes[name].newValue??(name==='cutoff'?'2022-01-01':name==='algorithmEpoch'?0:true);enforce();});
})();
