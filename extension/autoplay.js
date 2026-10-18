/* Optional player-overlay autoplay. No player internals, network requests or autoplay API bypass. */
(() => {
 function create({getState,getItems,classify,translate,navigate=url=>location.assign(url)}){
  let video=null,pending=null,timer=0,handled='',banner=null,savedNative=null,lastClick=-Infinity,suspended=false;
  const key='nostalgictube.nativeAutoplayRestore';
  try{if(sessionStorage.getItem(key)==='true')savedNative=true;}catch{}
  const currentId=()=>new URLSearchParams(location.search).get('v');
  const toggle=()=>document.querySelector('#movie_player .ytp-autonav-toggle-button, #movie_player .ytp-autonav-toggle[aria-checked]');
  function nativeValue(control){const value=control?.getAttribute('aria-checked');return value==='true'?true:value==='false'?false:null;}
  function restoreNative(){
   if(savedNative!==true)return;
   const control=toggle(),value=nativeValue(control);if(value===null)return;
   if(!value)(control.closest('button')||control).click();
   if(nativeValue(toggle())===true){savedNative=null;try{sessionStorage.removeItem(key);}catch{}}
  }
  function disableNative(){
   const control=toggle(),value=nativeValue(control);if(value===null)return false;
   if(value&&Date.now()-lastClick>=1000){savedNative=true;try{sessionStorage.setItem(key,'true');}catch{}lastClick=Date.now();(control.closest('button')||control).click();}
   return nativeValue(toggle())===false;
  }
  function scope(){return location.pathname==='/watch'&&!new URLSearchParams(location.search).has('list')&&!document.querySelector('#movie_player.ytp-live')&&document.querySelector('#movie_player video.html5-main-video')?.duration!==Infinity&&!document.querySelector('#movie_player.ad-showing');}
  const active=()=>Boolean(!suspended&&getState().enabled&&getState().autoplayEnabled&&scope());
  function candidate(){const state=getState();return getItems().find(item=>/^[\w-]{11}$/.test(item.id||'')&&item.id!==currentId()&&classify(item.published,state.cutoff)==='old');}
  function cancel(){clearInterval(timer);timer=0;pending=null;if(banner)banner.hidden=true;}
  function attachBanner(){
   const host=document.getElementById('yar-panel'),player=document.getElementById('movie_player');if(!player||!host||host.dataset.place!=='watch')return false;
   if(!banner||!banner.isConnected){
    banner=document.createElement('section');banner.className='nt-autoplay';banner.hidden=true;banner.setAttribute('aria-label','NostalgicTube autoplay');banner.addEventListener('click',event=>event.stopPropagation());banner.addEventListener('keydown',event=>event.stopPropagation());
    const image=document.createElement('img');image.className='nt-autoplay-image';image.alt='';
    const details=document.createElement('div');details.className='nt-autoplay-details';
    const message=document.createElement('p');message.className='nt-autoplay-message';message.setAttribute('role','status');message.setAttribute('aria-live','polite');
    const title=document.createElement('p');title.className='nt-autoplay-title';
    const actions=document.createElement('div');actions.className='nt-autoplay-actions';
    const play=document.createElement('button');play.type='button';play.className='nt-autoplay-play';play.onclick=playNext;
    const stop=document.createElement('button');stop.type='button';stop.className='nt-autoplay-cancel';stop.onclick=cancel;
    actions.append(play,stop);details.append(message,title,actions);banner.append(image,details);
   }
   if(banner.parentNode!==player)player.append(banner);
   return true;
  }
  function validPending(){return pending&&active()&&!document.hidden&&!document.fullscreenElement&&!document.pictureInPictureElement&&currentId()===pending.from&&video?.ended&&!video.loop&&candidate()?.id===pending.id&&nativeValue(toggle())===false;}
  function playNext(){if(!validPending()){cancel();return;}const id=pending.id;cancel();navigate('/watch?v='+id);}
  function updateCountdown(){
   if(!validPending()){cancel();return;}
   const seconds=Math.max(0,Math.ceil((pending.deadline-Date.now())/1000));
   banner.hidden=false;banner.querySelector('.nt-autoplay-message').textContent=translate('autoplayCountdown',{seconds});
   banner.querySelector('.nt-autoplay-title').textContent=pending.title;
   banner.querySelector('.nt-autoplay-play').textContent=translate('autoplayPlay');banner.querySelector('.nt-autoplay-cancel').textContent=translate('autoplayCancel');
   if(seconds===0)playNext();
  }
  function ended(event){
   const id=currentId();if(event.target!==video||!video?.ended||!active()||document.hidden||document.fullscreenElement||document.pictureInPictureElement||video.loop||handled===id)return;
   handled=id;const next=candidate();if(!next||nativeValue(toggle())!==false||!attachBanner())return;
   cancel();pending={id:next.id,title:String(next.title||''),from:id,deadline:Date.now()+10000};banner.querySelector('.nt-autoplay-image').src='https://i.ytimg.com/vi/'+next.id+'/hqdefault.jpg';updateCountdown();if(pending)timer=setInterval(updateCountdown,250);
  }
  function onPlay(){cancel();handled='';}
  function detach(){if(video){video.removeEventListener('ended',ended);video.removeEventListener('play',onPlay);}video=null;}
  function refresh(){
   if(suspended){cancel();return;}
   if(!active()){cancel();detach();restoreNative();return;}
   disableNative();
   const current=document.querySelector('#movie_player video.html5-main-video');
   if(current!==video){cancel();detach();video=current;if(video){video.addEventListener('ended',ended);video.addEventListener('play',onPlay);}}
   if(handled&&handled!==currentId())handled='';if(pending)updateCountdown();
  }
  function destroy(){cancel();detach();restoreNative();banner?.remove();}
  return {refresh,cancel,destroy,navigationStart(){suspended=true;cancel();detach();},navigationFinish(){suspended=false;refresh();}};
 }
 globalThis.NostalgicAutoplay={create};
})();


