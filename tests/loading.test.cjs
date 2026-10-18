const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../extension/content.js'),'utf8');
function harness(fetcher){
 const nodes=new Map(),timers=[],delays=[],requests=[];let renders=0;
 const node=key=>{if(!nodes.has(key))nodes.set(key,{textContent:'',dataset:{},setAttribute(){},querySelector:()=>node('button')});return nodes.get(key);};
 const host={dataset:{},isConnected:true,querySelector:node};
 const timeout=(fn,ms)=>{delays.push(ms);const handle=setTimeout(fn,ms===8000?30:ms===18000?150:100000);timers.push(handle);return handle;};
 const ctx=vm.createContext({AbortController,URLSearchParams,Event,console,performance,location:{search:'',pathname:'/'},document:{hidden:false,dispatchEvent(){renders++;}},navigator:{onLine:true},setInterval(){},setTimeout:timeout,clearTimeout,RelatedBefore:{defaults:{enabled:true,cutoff:'2022-01-01',discovery:100,interests:[],language:'en'},clean:x=>x,extract:JSON.parse,videos:x=>x,query:x=>x,shuffle:x=>x,mix:(p,e)=>[...p.flat().map(v=>({...v,origin:'interest'})),...e.map(v=>({...v,origin:'discovery'}))].slice(0,24)},YouTubeAntes:{classify:p=>p==='old'?'old':'new'},NostalgicI18n:{t:(language,key)=>key},fetch:(url,options)=>{requests.push(url);return fetcher(url,options);}});
 const marker=source.indexOf(' chrome.storage.local.get(defaults)');
 vm.runInContext(source.slice(0,marker)+`globalThis.api={run:async(jobs)=>{ready=true;host=globalThis.testHost;plan=()=>jobs;await load();},state:()=>({count:items.length,retry:retryAttempts,message:moreMessage}),joke:()=>{lastJokeAt=0;rotateLoadingJoke();return jokeKey;}};})();`,ctx);ctx.testHost=host;
 return {api:ctx.api,node,delays,requests,stop(){timers.forEach(clearTimeout);},renders:()=>renders};
}
const rows=(prefix,n)=>Array.from({length:n},(_,i)=>({id:prefix+i,published:'old',renderer:{id:prefix+i}}));
const ok=data=>({ok:true,text:async()=>JSON.stringify(data)});
const slow=signal=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>{const e=new Error('aborted');e.name='AbortError';reject(e);},{once:true}));
test('enough valid videos stop remaining requests, preserving date filtering',async()=>{
 const h=harness(async()=>ok([...rows('a',24),{id:'new',published:'new'}]));try{await h.api.run([{topic:'one',kind:'random'},{topic:'two',kind:'random'},{topic:'three',kind:'random'}]);assert.equal(h.api.state().count,24);assert.equal(h.requests.length,2);assert(h.delays.includes(8000));assert(h.delays.includes(18000));}finally{h.stop();}
});
test('a stalled source times out and frees the worker for another search',async()=>{
 const h=harness(async(url,{signal})=>url.includes('slow')?slow(signal):ok(rows(url,24)));try{await h.api.run([{topic:'slow-one',kind:'random'},{topic:'slow-two',kind:'random'},{topic:'other',kind:'random'}]);assert.equal(h.api.state().count,24);assert(h.requests.some(u=>u.includes('other')));}finally{h.stop();}
});
test('empty results retry promptly; rate limiting keeps a long backoff',async()=>{
 const h=harness(async()=>ok([]));try{await h.api.run([{topic:'empty',kind:'random'}]);assert.equal(h.api.state().message,'autoRetryWait');assert(h.delays.includes(1500));}finally{h.stop();}
 const q=harness(async()=>({ok:false,status:429}));try{await q.api.run([{topic:'limited',kind:'random'},{topic:'unused',kind:'random'}]);assert.equal(q.api.state().message,'sourceRetryWait');assert(q.delays.includes(60000));assert.equal(q.requests.length,2);}finally{q.stop();}
});

test('loading has one heading, rotates distinct jokes, and hides duplicate top status',async()=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 const h=harness(async()=>{await gate;return ok(rows('loaded',24));});
 try{
   const pending=h.api.run([{topic:'load',kind:'random'}]);
   assert.equal(h.node('.yar-more-label').textContent,'loadingVideos');assert.equal(h.node('#status').hidden,true);
   const first=h.api.joke(),second=h.api.joke();assert.notEqual(first,second);assert.match(second,/^loadingJoke/);
   release();await pending;
   assert.equal(h.node('#status').hidden,true);assert.equal(h.node('.yar-more-message').textContent,'');assert.equal(h.node('.yar-more-label').textContent,'more');
 }finally{release();await new Promise(resolve=>setImmediate(resolve));h.stop();}
});
