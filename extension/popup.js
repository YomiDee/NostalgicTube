document.getElementById('version').textContent='v'+chrome.runtime.getManifest().version;
const fields=['enabled','cutoff','replaceHome','remember','learnVideos','discovery'],status=document.getElementById('status');
let language='en',statusKey='';
const t=(key,values)=>NostalgicI18n.t(language,key,values);
function notify(key){statusKey=key;status.textContent=t(key);}
function showRandomHint(){const value=document.getElementById('discovery').value;document.getElementById('random-hint').hidden=value!=='100';document.getElementById('discovery-value').textContent=value+'%';document.getElementById('discovery').setAttribute('aria-valuetext',value+'%');}
function translate(){document.documentElement.lang=language;document.getElementById('language').setAttribute('aria-checked',String(language==='es'));document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));if(statusKey)notify(statusKey);renderUpdate();}
const popupDefaults=Object.fromEntries([...fields,'language'].map(key=>[key,RelatedBefore.defaults[key]]));
chrome.storage.local.get(popupDefaults).then(s=>{language=s.language==='es'?'es':'en';for(const name of fields){const e=document.getElementById(name);if(e.type==='checkbox')e.checked=s[name];else e.value=s[name];}translate();showRandomHint();});
document.getElementById('discovery').oninput=showRandomHint;
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local' && changes.language){language=changes.language.newValue==='es'?'es':'en';translate();}});
document.getElementById('language').onclick=async()=>{const previous=language;language=language==='en'?'es':'en';translate();try{await chrome.storage.local.set({language});notify('saved');}catch{language=previous;translate();notify('saveError');}};
async function saveField(name){const e=document.getElementById(name);if(!e.checkValidity())return;const value=e.type==='checkbox'?e.checked:name==='discovery'?Number(e.value):e.value;try{await chrome.storage.local.set({[name]:value});notify('saved');}catch{notify('saveError');}}
for(const name of fields)document.getElementById(name).addEventListener('change',()=>saveField(name));
document.getElementById('settings').onsubmit=event=>event.preventDefault();
document.getElementById('clear').onclick=async()=>{try{const result=await chrome.runtime.sendMessage({type:'nt-clear'});notify(result?.ok?'reset':'saveError');}catch{notify('saveError');}};

let updateState='checkUpdate',availableUpdate=null,updateFallback=false;
const updateButton=document.getElementById('update');
function renderUpdate(){updateButton.textContent=t(updateState,{version:availableUpdate?.version||''});updateButton.title=t('updateHelp');updateButton.disabled=updateState==='checkingUpdate';}
async function checkUpdates(requestPermission){
 if(availableUpdate||updateFallback){chrome.tabs.create({url:availableUpdate?.url||'https://github.com/yomidee/NostalgicTube/releases'});return;}
 if(updateState==='checkingUpdate')return;
 updateState='checkingUpdate';renderUpdate();
 const controller=new AbortController();let timer;
 try{
  const permission={origins:['https://api.github.com/*']};
  const allowed=requestPermission?await chrome.permissions.request(permission):await chrome.permissions.contains(permission);
  if(!allowed){updateState='checkUpdate';updateFallback=true;return;}
  timer=setTimeout(()=>controller.abort(),12000);
  const response=await fetch('https://api.github.com/repos/yomidee/NostalgicTube/releases?per_page=100',{signal:controller.signal,credentials:'omit',headers:{Accept:'application/vnd.github+json'}});
  if(!response.ok)throw new Error(response.status===403||response.status===429?'rateLimit':'unavailable');
  const release=NostalgicUpdates.select(await response.json());if(!release)throw new Error('No release');
  if(NostalgicUpdates.compare(release.version,chrome.runtime.getManifest().version)>0){availableUpdate=release;updateState='downloadUpdate';}
  else updateState='upToDate';
 }catch{updateState='checkUpdate';updateFallback=true;}finally{clearTimeout(timer);renderUpdate();}
}
updateButton.onclick=()=>checkUpdates(true);
renderUpdate();
chrome.permissions.contains({origins:['https://api.github.com/*']}).then(allowed=>{if(allowed&&updateState==='checkUpdate')checkUpdates(false);}).catch(()=>{});
