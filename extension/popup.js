const fields=['enabled','cutoff','replaceHome','remember','learnVideos','discovery'],status=document.getElementById('status');
let language='en',statusKey='';
const t=(key,values)=>NostalgicI18n.t(language,key,values);
function notify(key){statusKey=key;status.textContent=t(key);}
function showRandomHint(){document.getElementById('random-hint').hidden=document.getElementById('discovery').value!=='100';}
function translate(){document.documentElement.lang=language;document.getElementById('language').setAttribute('aria-checked',String(language==='es'));document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));if(statusKey)notify(statusKey);}
const popupDefaults=Object.fromEntries([...fields,'language'].map(key=>[key,RelatedBefore.defaults[key]]));
chrome.storage.local.get(popupDefaults).then(s=>{language=s.language==='es'?'es':'en';for(const name of fields){const e=document.getElementById(name);if(e.type==='checkbox')e.checked=s[name];else e.value=s[name];}translate();showRandomHint();});
document.getElementById('discovery').onchange=showRandomHint;
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local' && changes.language){language=changes.language.newValue==='es'?'es':'en';translate();}});
document.getElementById('language').onclick=async()=>{const previous=language;language=language==='en'?'es':'en';translate();try{await chrome.storage.local.set({language});notify('saved');}catch{language=previous;translate();notify('saveError');}};
document.getElementById('settings').onsubmit=async event=>{event.preventDefault();const value={};for(const name of fields){const e=document.getElementById(name);value[name]=e.type==='checkbox'?e.checked:name==='discovery'?Number(e.value):e.value;}try{await chrome.storage.local.set(value);notify('saved');}catch{notify('saveError');}};
document.getElementById('clear').onclick=async()=>{try{const result=await chrome.runtime.sendMessage({type:'nt-clear'});notify(result?.ok?'reset':'saveError');}catch{notify('saveError');}};
