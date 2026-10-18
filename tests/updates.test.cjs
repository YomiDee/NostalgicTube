const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'../extension');
async function popup({allowed=true,response=true,releases=[]}={}){
 const elements=new Map(),requests=[];
 const get=id=>{if(!elements.has(id))elements.set(id,{value:'25',type:'text',textContent:'',setAttribute(){},addEventListener(){},checkValidity(){return true;}});return elements.get(id);};
 const c=vm.createContext({console,AbortController,setTimeout,clearTimeout,document:{getElementById:get,documentElement:{},querySelectorAll:()=>[]},chrome:{runtime:{getManifest:()=>({version:'4.8.5'})},storage:{local:{get:async()=>({language:'en'})},onChanged:{addListener(){}}},permissions:{request:async()=>allowed},tabs:{create:({url})=>requests.push({download:url})}},fetch:async(url,options)=>{requests.push({url,options});return {ok:response,json:async()=>releases};}});
 for(const f of ['search.js','i18n.js','updates.js','popup.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);
 await Promise.resolve();return {get,requests};
}
const release=version=>({tag_name:'v'+version,prerelease:true,assets:[{name:'NostalgicTube-'+version+'-Brave.zip',browser_download_url:'https://github.com/yomidee/NostalgicTube/releases/download/v'+version+'/NostalgicTube-'+version+'-Brave.zip'}]});
test('popup checks only on click, reports current and downloads a newer validated release',async()=>{
 const p=await popup({releases:[release('4.8.5')]});assert.equal(p.requests.length,0);await p.get('update').onclick();assert.match(p.get('update').textContent,/Up to date/);assert.equal(p.requests[0].options.credentials,'omit');
 const q=await popup({releases:[release('4.9.0')]});await q.get('update').onclick();assert.equal(q.get('update').textContent,'Download v4.9.0');await q.get('update').onclick();assert.match(q.requests[1].download,/4.9.0/);
});
test('denied permission makes no request; network failure is retryable',async()=>{
 const p=await popup({allowed:false});await p.get('update').onclick();assert.equal(p.requests.length,0);assert.equal(p.get('update').disabled,false);
 const q=await popup({response:false});await q.get('update').onclick();assert.match(q.get('update').textContent,/Retry/);assert.equal(q.get('update').disabled,false);
});
