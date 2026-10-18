(() => {
 const {defaults,clean,extract,videos,query}=RelatedBefore;
 let settings={...defaults},host,root,topic='',key='',sequence=0,controller,scheduled=false,lastWatch='',items=[];
 const cache=new Map();
 function node(tag,content,attrs={}){const e=document.createElement(tag);if(content)e.textContent=content;for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;}
 function mount() {
   const home=location.pathname==='/',watch=location.pathname==='/watch';
   const anchor=home?document.querySelector('ytd-browse[page-subtype="home"]'):watch?document.querySelector('#secondary-inner'):null;
   document.documentElement.dataset.yarHome=String(Boolean(home && settings.enabled && settings.replaceHome && anchor));
   if(!settings.enabled || !anchor){host?.remove();return false;}
   if(!host){host=node('section','',{id:'yar-panel','aria-label':'Vídeos antiguos relacionados'});root=host;
     const toolbar=node('div','',{class:'yar-toolbar'}),details=node('details'),form=node('form');
     form.append(node('input','',{'aria-label':'Tema relacionado',maxlength:'160',placeholder:'Abre un vídeo o escribe un tema',required:''}),node('button','Buscar',{type:'submit'}));
     details.append(node('summary','Cambiar tema'),form);
     toolbar.append(node('span','Relacionados',{class:'yar-chip'}),node('span','',{class:'yar-chip',id:'cutoff-label'}),node('button','Mezclar',{type:'button',id:'shuffle'}),details,node('a','Ver más ↗',{class:'search',target:'_blank',rel:'noopener','aria-label':'Abrir búsqueda completa en YouTube'}),node('span','',{id:'context'}));
     root.append(toolbar,node('p','',{id:'status',role:'status','aria-live':'polite'}),node('div','',{class:'yar-results'}),node('div','',{id:'yar-payload',hidden:''}));
     root.querySelector('form').onsubmit=e=>{e.preventDefault();topic=clean(root.querySelector('input').value);if(topic){key='';load(true);}};
     root.querySelector('#shuffle').onclick=()=>{items.sort(()=>Math.random()-.5);render();};
     host.addEventListener('yar-native-ready',()=>{if(host.dataset.nativeState==='error')root.querySelector('#status').textContent='No se han podido cargar las tarjetas de YouTube. Usa «Ver más» para abrir los resultados.';});
   }
   if(host.parentNode!==anchor)anchor.prepend(host);
   host.dataset.place=home?'home':'watch';
   const label='Antes de '+settings.cutoff;if(root.querySelector('#cutoff-label').textContent!==label)root.querySelector('#cutoff-label').textContent=label;
   return true;
 }
 function render(){root.querySelector('#yar-payload').textContent=JSON.stringify(items.slice(0,24).map(v=>v.renderer));document.dispatchEvent(new Event('yar-render-native'));}
 async function load(force=false) {
   if(!topic || !root)return;
   const next=topic+'|'+settings.cutoff+'|'+(new URLSearchParams(location.search).get('v')||'');if(!force && next===key)return;key=next;
   controller?.abort();controller=new AbortController();const signal=controller.signal,run=++sequence;
   root.querySelector('input').value=topic;
   root.querySelector('#context').textContent='Sobre «'+topic+'» · antes del '+settings.cutoff;
   const link=root.querySelector('.search');link.href='https://www.youtube.com/results?search_query='+encodeURIComponent(query(topic,settings.cutoff));
   items=[];render();root.querySelector('#status').textContent='Buscando vídeos antiguos relacionados…';
   let timedOut=false;const timeout=setTimeout(()=>{timedOut=true;if(run===sequence)controller.abort();},25000);
   try {
     let results=cache.get(next);
     if(!results || force) {
       const all=new Map();
       for(const broad of [false,true]) {
         const url='/results?search_query='+encodeURIComponent(query(topic,settings.cutoff,broad));
         const response=await fetch(url,{signal,credentials:'same-origin'});
         if(!response.ok)throw Error('YouTube respondió con un error ('+response.status+').');
         const data=extract(await response.text());
         for(const v of videos(data)) if(v.id!==new URLSearchParams(location.search).get('v') && YouTubeAntes.classify(v.published,settings.cutoff)==='old')all.set(v.id,v);
         if(all.size>=24)break;
       }
       results=[...all.values()];cache.set(next,results);if(cache.size>12)cache.delete(cache.keys().next().value);
     }
     if(run!==sequence)return;
     items=[...results];render();root.querySelector('#status').textContent=items.length?items.length+' vídeos encontrados. Pulsa Mezclar para cambiar el orden.':'No hay vídeos con fecha suficientemente antigua verificable. Prueba con menos palabras o abre la búsqueda completa.';
   } catch(e){if(run===sequence && (e.name!=='AbortError' || timedOut))root.querySelector('#status').textContent=(timedOut?'YouTube ha tardado demasiado en responder.':e.message)+' Puedes abrir la búsqueda completa con el botón inferior.';}finally{clearTimeout(timeout);}
 }
 function sync(){
   if(!mount()){controller?.abort();sequence++;key='';return;}
   const video=new URLSearchParams(location.search).get('v');
   if(location.pathname==='/watch' && video) {
     const title=clean(document.querySelector('ytd-watch-metadata h1 yt-formatted-string,ytd-watch-metadata h1')?.textContent);
     // Esperar a que el título del documento coincida evita reutilizar el título anterior en navegación SPA.
     const doc=clean(document.title.replace(/^\(\d+\)\s*/, '').replace(/ - YouTube$/,''));
     if(title && title===doc && (lastWatch!==video+'|'+title)) {lastWatch=video+'|'+title;topic=title;chrome.storage.local.set({lastTopic:topic});}
   }
   if(!topic)topic=clean(settings.lastTopic);
   if(!topic && location.pathname==='/')topic=clean(document.querySelector('ytd-rich-grid-renderer a#video-title-link,ytd-rich-grid-renderer #video-title')?.textContent);
   if(topic)load();else root.querySelector('#status').textContent='Abre un vídeo para encontrar otros relacionados, o escribe aquí un tema.';
 }
 function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;sync();},700);}
 chrome.storage.local.get(defaults).then(s=>{settings=s;sync();});
 chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local')return;let changed=false;for(const name of Object.keys(defaults))if(changes[name]){settings[name]=changes[name].newValue??defaults[name];if(name!=='lastTopic')changed=true;}if(changed){key='';schedule();}});
 new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
 document.addEventListener('yt-navigate-finish',()=>{controller?.abort();sequence++;key='';schedule();});window.addEventListener('popstate',schedule);
})();
