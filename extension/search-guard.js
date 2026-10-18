/* Applies the chosen cutoff to document searches, including omnibox/bookmark URLs.
   It does not intercept fetch(), so feed searches retain their narrower date windows. */
(() => {
 let settings={enabled:true,cutoff:'2022-01-01'},ready=false;
 function apply(query){const plain=String(query||'').replace(/\bbefore\s*:\s*(?:"[^"]*"|\S+)/gi,' ').replace(/\s+/g,' ').trim();return (plain?plain+' ':'')+'before:'+settings.cutoff;}
 function enforce(){if(!ready || !settings.enabled || location.pathname!=='/results')return;const url=new URL(location.href),query=url.searchParams.get('search_query');if(query===null)return;const next=apply(query);if(query!==next){url.searchParams.set('search_query',next);location.replace(url.href);}}
 function prepare(input){if(!ready || !settings.enabled || !(input instanceof HTMLInputElement))return;if(input.name!=='search_query' && !input.closest('ytd-searchbox,yt-searchbox'))return;const next=apply(input.value);if(input.value!==next){input.value=next;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));}}
 document.addEventListener('keydown',e=>{if(e.key==='Enter' && !e.isComposing)prepare(e.target);},true);
 document.addEventListener('submit',e=>prepare(e.target.querySelector?.('input[name="search_query"],input')),true);
 document.addEventListener('yt-navigate-finish',enforce);window.addEventListener('popstate',enforce);
 chrome.storage.local.get(settings).then(s=>{settings=s;ready=true;enforce();});
 chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local')return;for(const name of ['enabled','cutoff'])if(changes[name])settings[name]=changes[name].newValue??(name==='enabled'?true:'2022-01-01');enforce();});
})();
