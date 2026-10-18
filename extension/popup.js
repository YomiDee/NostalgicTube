const {defaults}=YouTubeAntes;
const form=document.getElementById('settings'),status=document.getElementById('status');
function fill(values){for(const key of Object.keys(defaults)){const el=document.getElementById(key);if(el.type==='checkbox') el.checked=values[key];else el.value=values[key];}}
chrome.storage.local.get(defaults).then(fill).catch(()=>{status.textContent='No se pudo cargar la configuración.';});
form.addEventListener('submit',async e=>{e.preventDefault();const values={};for(const key of Object.keys(defaults)){const el=document.getElementById(key);values[key]=el.type==='checkbox'?el.checked:el.value;}try{await chrome.storage.local.set(values);status.textContent='Guardado. Se aplica en YouTube al instante.';}catch{status.textContent='No se pudo guardar. Inténtalo de nuevo.';}});
document.getElementById('reset').addEventListener('click',async()=>{try{await chrome.storage.local.set(defaults);fill(defaults);status.textContent='Restablecido: antes del 1 de enero de 2022.';}catch{status.textContent='No se pudo restablecer.';}});
