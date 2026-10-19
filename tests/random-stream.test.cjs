const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync(__dirname+'/../extension/random-stream.js','utf8'),ctx);
const rows=(prefix,n=10)=>Array.from({length:n},(_,i)=>({id:prefix+i}));
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('first results are emitted while a different search is still pending',async()=>{
 let release;const gate=new Promise(r=>release=r),chunks=[];let done=false;
 const pending=ctx.NostalgicRandomStream.collect({jobs:[{topic:'fast'},{topic:'slow'}],fetchPool:async j=>{if(j.topic==='slow')await gate;return rows(j.topic);},signal:new AbortController().signal,isCurrent:()=>true,seen:new Set(),currentId:'',onChunk:c=>chunks.push(...c)}).then(r=>{done=true;return r;});
 await tick();assert.equal(done,false);assert.equal(chunks.length,2);release();const result=await pending;assert.equal(result.count,8);assert.equal(new Set(chunks.map(v=>v.id)).size,8);
});
test('late results are discarded after changing context',async()=>{
 let current=true,release;const gate=new Promise(r=>release=r),chunks=[];
 const pending=ctx.NostalgicRandomStream.collect({jobs:[{topic:'late'}],fetchPool:async()=>{await gate;return rows('old');},signal:new AbortController().signal,isCurrent:()=>current,seen:new Set(),onChunk:c=>chunks.push(...c)});
 current=false;release();await pending;assert.equal(chunks.length,0);
});
test('source caps, exclusions and bounded concurrency survive duplicate responses',async()=>{
 let active=0,max=0;const chunks=[];
 await ctx.NostalgicRandomStream.collect({jobs:Array.from({length:6},(_,i)=>({topic:'q'+i})),fetchPool:async j=>{max=Math.max(max,++active);await tick();active--;return [{id:'seen'},{id:'playing'},{id:'duplicate'},...rows(j.topic)];},signal:new AbortController().signal,isCurrent:()=>true,seen:new Set(['seen']),currentId:'playing',concurrency:2,onChunk:c=>chunks.push(...c)});
 assert.equal(max,2);assert.equal(chunks.length,24);assert.equal(new Set(chunks.map(v=>v.id)).size,24);assert(!chunks.some(v=>['seen','playing'].includes(v.id)));
 for(const topic of new Set(chunks.map(v=>v.discoverySource)))assert(chunks.filter(v=>v.discoverySource===topic).length<=4);
});
test('rate limiting stops unstarted searches',async()=>{
 let calls=0;const result=await ctx.NostalgicRandomStream.collect({jobs:Array.from({length:6},(_,i)=>({topic:'q'+i})),fetchPool:async()=>{calls++;throw Object.assign(new Error('limited'),{status:429});},signal:new AbortController().signal,isCurrent:()=>true,seen:new Set(),concurrency:2,onChunk(){}});
 assert.equal(result.throttled,true);assert.equal(calls,2);
});
