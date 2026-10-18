const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function engine(){const c=vm.createContext({});for(const file of ['discovery-terms.js','random.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../extension',file),'utf8'),c);return c.NostalgicRandom;}
function seeded(seed=17){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
test('discovery library contains eight languages, 480 terms and compatible topic groups',()=>{
 const e=engine();assert.equal(e.stats.languages.length,8);assert.equal(e.stats.baseTerms,480);assert.equal(e.stats.phraseCombinations,1920);
});
test('random plans never reuse the preceding 256 terms and respect requested date/count limits',()=>{
 const e=engine(),random=seeded(),recent=[],languages=new Set(),sources=new Set();
 for(let i=0;i<200;i++){
  const jobs=e.randomJobs('2022-01-01',random);assert.equal(jobs.length,6);
  for(const job of jobs){const key=job.topic.normalize('NFKC').toLowerCase();assert(!recent.includes(key),job.topic);recent.push(key);if(recent.length>256)recent.shift();assert(job.after<job.cutoff&&job.cutoff<='2022-01-01');assert.equal(job.kind,'random');if(job.language)languages.add(job.language);sources.add(job.source);}
 }
 assert.equal(languages.size,8);assert.deepEqual([...sources].sort(),['camera','phrase','simple']);
 assert.equal(e.randomJobs('2006-01-01',random,2).length,2);
});
test('constant RNG terminates without repeating recent topics; topics do not need user interests',()=>{
 const e=engine(),topics=[];for(let i=0;i<20;i++)topics.push(...e.randomJobs('2022-01-01',()=>.4).map(j=>j.topic));assert.equal(new Set(topics).size,topics.length);
 assert.throws(()=>e.randomJobs('not-a-date'));
});
test('related searches retain their topic; discovery source choice changes with random seed',()=>{
 const a=engine(),b=engine();assert.equal(a.relatedJob('Minecraft','2022-01-01',()=>.6).topic,'Minecraft');
 const x=a.randomJobs('2022-01-01',seeded(11)).map(j=>j.topic).join('|'),y=b.randomJobs('2022-01-01',seeded(41)).map(j=>j.topic).join('|');assert.notEqual(x,y);
});

test('each random batch uses distinct categories and several languages',()=>{
 const e=engine(),random=seeded(96);for(let i=0;i<100;i++){const jobs=e.randomJobs('2022-01-01',random);assert.equal(new Set(jobs.map(j=>j.category)).size,6);assert(new Set(jobs.filter(j=>j.language).map(j=>j.language)).size>=4);}
});
test('discovery mixing interleaves queries rather than displaying topic blocks',()=>{
 const c=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(__dirname,'../extension/search.js'),'utf8'),c);
 const videos=['flute','dog','wood','train','party','rain'].flatMap(source=>Array.from({length:2},(_,i)=>({id:source+i,discoverySource:source,views:i?99999999:0})));
 const result=c.RelatedBefore.mix([],videos,100,24,seeded(32));assert.equal(result.length,12);
 for(let i=1;i<result.length;i++)assert.notEqual(result[i].discoverySource,result[i-1].discoverySource);
 assert.equal(new Set(result.map(v=>v.id)).size,12);
});

test('discovery respects selected languages and retains neutral camera searches',()=>{
 const e=engine(),random=seeded(51);
 for(const selected of [['es'],['ja','ru'],['en','fr','de']])for(let i=0;i<60;i++){
  const jobs=e.randomJobs('2022-01-01',random,6,selected);
  assert.equal(jobs.length,6);
  for(const job of jobs)assert(job.language===null||selected.includes(job.language));
 }
 assert.equal(e.randomJobs('2022-01-01',random,6,[]).length,6);
 assert.equal(e.randomJobs('2022-01-01',random,6,['invalid']).length,6);
});
