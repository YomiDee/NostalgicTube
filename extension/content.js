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
   if(!host){host=node('section','',{id:'yar-panel'});root=host.attachShadow({mode:'open'});root.innerHTML=`<style>
   :host{font:14px system-ui;color:var(--yt-spec-text-primary,#eee)}*{box-sizing:border-box}section{background:var(--yt-spec-base-background,#171717);border:1px solid #6666;border-radius:14px;padding:18px}h2{font-size:21px;margin:0 0 8px}p{line-height:1.5;opacity:.8}form{display:flex;flex-wrap:wrap;gap:8px}input{flex:1;min-width:140px;background:transparent;color:inherit;border:1px solid #888;border-radius:8px;padding:10px;font:inherit}button,.search{background:#84dabb;color:#10251e;border:0;border-radius:8px;padding:10px;cursor:pointer;font:inherit}a{color:inherit;text-decoration:none}a:hover{text-decoration:underline}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;margin-top:16px}.card{display:block}.card img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:9px}.card strong{display:block;margin:7px 0;line-height:1.4}.card small{display:block;opacity:.7}.search{display:inline-block;margin-top:12px}#status{min-height:22px}button:disabled{opacity:.5;cursor:wait}</style>
   <section><h2>Antiguos relacionados</h2><p id="context"></p><form><input aria-label="Tema relacionado" maxlength="160" placeholder="Abre un vídeo o escribe un tema" required><button>Buscar</button><button type="button" id="shuffle">Mezclar</button></form><p id="status" role="status" aria-live="polite"></p><div class="grid"></div><a class="search" target="_blank" rel="noopener">Ver búsqueda completa en YouTube ↗</a><p>Basado en el título del vídeo y búsquedas anteriores a la fecha elegida. Las fechas relativas son aproximadas.</p></section>`;
     root.querySelector('form').onsubmit=e=>{e.preventDefault();topic=clean(root.querySelector('input').value);if(topic){key='';load(true);}};
     root.querySelector('#shuffle').onclick=()=>{items.sort(()=>Math.random()-.5);render();};
   }
   if(host.parentNode!==anchor)anchor.prepend(host);
   return true;
 }
 function render(){const grid=root.querySelector('.grid');grid.replaceChildren();for(const v of items.slice(0,24)){const a=node('a','',{class:'card',href:'/watch?v='+v.id});const img=node('img','',{src:'https://i.ytimg.com/vi/'+v.id+'/mqdefault.jpg',alt:'',loading:'lazy'});a.append(img,node('strong',v.title),node('small',[v.channel,v.published].filter(Boolean).join(' · ')));grid.append(a);}}
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
