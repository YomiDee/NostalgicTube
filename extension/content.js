(() => {
  const {defaults,classify}=YouTubeAntes;
  let settings={...defaults}, timer;
  const selector='ytd-rich-item-renderer,ytd-video-renderer,ytd-grid-video-renderer,ytd-compact-video-renderer,yt-lockup-view-model,ytd-reel-item-renderer,ytm-shorts-lockup-view-model';
  function scan() {
    const active=settings.enabled && (!settings.homeOnly || location.pathname==='/');
    document.querySelectorAll(selector).forEach(card=>{
      // Filtrar el contenedor exterior evita huecos en la cuadrícula.
      if(card.parentElement?.closest(selector)) return;
      let result='unknown';
      const candidates=card.querySelectorAll('#metadata-line span,.yt-content-metadata-view-model__metadata-text,time,[itemprop="datePublished"]');
      for(const el of candidates) {
        const value=el.getAttribute('datetime') || el.getAttribute('content') || el.textContent;
        const state=classify(value,settings.cutoff);
        if(state!=='unknown') {result=state; break;}
      }
      const effect=active && (result==='new' || (result==='unknown' && settings.unknown==='hide')) ? settings.mode : '';
      if(card.getAttribute('data-yta-effect')!==effect) card.setAttribute('data-yta-effect',effect);
      if(card.getAttribute('data-yta-date')!==result) card.setAttribute('data-yta-date',result);
    });
  }
  function schedule() {if(timer) return; timer=setTimeout(()=>{timer=null;scan();},120);}
  chrome.storage.local.get(defaults).then(value=>{settings=value;scan();});
  chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local') return; for(const key of Object.keys(defaults)) if(changes[key]) settings[key]=changes[key].newValue ?? defaults[key]; schedule();});
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['datetime','content','href','aria-label']});
  document.addEventListener('yt-navigate-finish',schedule);
  window.addEventListener('popstate',schedule);
  window.addEventListener('scroll',schedule,{passive:true});
  setInterval(schedule,60000);
})();
