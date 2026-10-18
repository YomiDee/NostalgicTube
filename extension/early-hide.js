/* Hide the native feed before its first paint, including SPA navigation. */
(() => {
 let enabled=true;
 function apply(url=location.href){const path=new URL(url,location.href).pathname;if(document.documentElement)document.documentElement.setAttribute('data-nt-early',!enabled?'off':path==='/'?'home':path==='/watch'?'watch':'off');}
 apply();
 if(!document.documentElement){const observer=new MutationObserver(()=>{if(document.documentElement){apply();observer.disconnect();}});observer.observe(document,{childList:true});}
 chrome.storage.local.get({enabled:true}).then(s=>{enabled=s.enabled!==false;apply();}).catch(()=>{enabled=false;apply();});
 chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.enabled){enabled=changes.enabled.newValue!==false;apply();}});
 document.addEventListener('yt-navigate-start',event=>apply(event.detail?.url||location.href));
 document.addEventListener('yt-navigate-finish',()=>apply());window.addEventListener('popstate',()=>apply());
})();
