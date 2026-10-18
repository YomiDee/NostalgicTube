const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),context=vm.createContext({Date,Math,console});
for(const file of ['dates.js','search.js','topics.js','random.js','i18n.js'])vm.runInContext(fs.readFileSync(path.join(root,'extension',file),'utf8'),context);
test('exclusive cutoff and ambiguous relative ages',()=>{
 const c=context.YouTubeAntes.classify,now=new Date(2026,9,18);
 assert.equal(c('2021-12-31','2022-01-01',now),'old');
 assert.equal(c('2022-01-01','2022-01-01',now),'new');
 assert.equal(c('hace 4 años','2022-01-01',now),'unknown');
 assert.equal(c('hace 5 a','2022-01-01',now),'old');
 assert.equal(c('8 years ago','2022-01-01',now),'old');
 assert.equal(c('2021-02-31','2022-01-01',now),'unknown');
});
test('local title learning rejects generic text and recognizes bilingual topics',()=>{
 const e=context.NostalgicTopics.extractTopic;
 assert.equal(e('Sobreviví 100 días en Minecraft'),'Minecraft');
 assert.equal(e('Building my first house in Minecraft'),'Minecraft');
 assert.equal(e('Documental sobre galaxias'),'Astronomía');
 assert.equal(e('No vas a creer lo que pasó'),null);
});
test('feed proportions and duplicate prevention do not use views',()=>{
 const pools=Array.from({length:4},(_,t)=>Array.from({length:30},(_,i)=>({id:`t${t}-${i}`,views:i%2?0:100000000})));
 const discoveries=Array.from({length:30},(_,i)=>({id:`d${i}`,views:i%2?1:999999999}));
 for(const percent of [0,25,37,50,100]){
   const rows=context.RelatedBefore.mix(pools,discoveries,percent);
   assert.equal(rows.length,24);
   assert.equal(rows.filter(v=>v.origin==='discovery').length,Math.round(24*percent/100));
   assert.equal(new Set(rows.map(v=>v.id)).size,24);
 }
 const duplicate=context.RelatedBefore.mix([[{id:'same'}]],[{id:'same'}],50);
 assert.equal(duplicate.length,1);
});
test('independent random plans keep date limits and related plans retain topics',()=>{
 for(const cutoff of ['2006-01-01','2022-01-01','2022-07-15']){
   const jobs=context.NostalgicRandom.randomJobs(cutoff,()=>.4);
   assert.equal(jobs.length,6);
   assert(jobs.every(j=>j.kind==='random'&&j.after<j.cutoff&&j.cutoff<=cutoff));
   const related=context.NostalgicRandom.relatedJob('Minecraft',cutoff,()=>.6);
   assert.equal(related.topic,'Minecraft');
   assert.equal(related.kind,'interest');
   assert(related.cutoff<=cutoff);
 }
});
test('current popup text resolves in English and Spanish',()=>{
 const html=fs.readFileSync(path.join(root,'extension','popup.html'),'utf8');
 for(const match of html.matchAll(/data-i18n="([^"]+)"/g))for(const language of ['en','es']){
   assert.notEqual(context.NostalgicI18n.t(language,match[1]),match[1]);
 }
 assert.equal(context.RelatedBefore.defaults.language,'en');
 assert.equal(context.NostalgicI18n.t('en','tagline'),'Enjoy what it used to be.');
});
test('all manifest script and asset references exist',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'extension','manifest.json'),'utf8'));
 assert.equal(manifest.manifest_version,3);
 const files=[manifest.background.service_worker,manifest.action.default_popup,...Object.values(manifest.icons),...Object.values(manifest.action.default_icon)];
 for(const script of manifest.content_scripts)files.push(...(script.js||[]),...(script.css||[]));
 for(const file of files)assert(fs.statSync(path.join(root,'extension',file)).isFile(),file);
});

const updates=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(root,'extension','updates.js'),'utf8'),updates);
test('update check compares numeric versions and validates release assets',()=>{
 const u=updates.NostalgicUpdates;assert.equal(u.compare('4.10.0','4.9.9'),1);assert.equal(u.compare('v4.8.5','4.8.5.0'),0);
 const release=(version,url)=>({tag_name:'v'+version,prerelease:true,assets:[{name:'NostalgicTube-'+version+'-Brave.zip',browser_download_url:url||'https://github.com/yomidee/NostalgicTube/releases/download/v'+version+'/NostalgicTube-'+version+'-Brave.zip'}]});
 assert.equal(u.select([release('4.8.3'),release('4.8.5')]).version,'4.8.5');
 assert.equal(u.select([release('4.8.5','https://example.com/malicious.zip')]),null);
 assert.equal(u.select([{...release('9.0.0'),draft:true}]),null);
 assert.equal(u.select([{tag_name:'not-a-version',assets:[]}]),null);
 assert.throws(()=>u.select({}));
});
