const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function node(tag='div'){
 return {tag,children:[],attrs:{},textContent:'',dataset:{},hidden:false,isConnected:true,
 append(...nodes){this.children.push(...nodes);},insertBefore(child,before){const i=this.children.indexOf(before);this.children.splice(i<0?this.children.length:i,0,child);},
 addEventListener(){},setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k]??null;},remove(){this.isConnected=false;},
 querySelector(selector){if(selector==='.yar-results')return this.children.find(n=>n.className==='yar-results');const name=selector.slice(1);for(const child of this.children){if(child.className===name)return child;const match=child.querySelector(selector);if(match)return match;}return null;}};
}
function harness({native=true,unknown=false,playlist=false,live=false}={}){
 let now=0;const intervals=new Map(),navigations=[],playlistExits=[],events={},session=new Map();let id=0,nativeOn=native;
 const state={enabled:true,autoplayEnabled:true,cutoff:'2022-01-01'},items=[{id:'bbbbbbbbbbb',title:'First old video',published:'old'},{id:'ccccccccccc',title:'Second',published:'old'}];
 const location={pathname:'/watch',search:'?v=aaaaaaaaaaa'+(playlist?'&list=PL1':'')};
 const control={getAttribute:()=>unknown?null:String(nativeOn),closest:()=>({click(){nativeOn=!nativeOn;}})};
 const video={duration:live?Infinity:100,ended:false,addEventListener:(name,fn)=>events[name]=fn,removeEventListener:name=>delete events[name]};
 const player=node();const host=node();host.dataset.place='watch';const results=node();results.className='yar-results';host.append(results);
 const document={documentElement:{dataset:{}},hidden:false,getElementById:id=>id==='movie_player'?player:host,createElement:node,querySelector:selector=>selector.startsWith('#movie_player .ytp-autonav-toggle-button')?control:selector==='#movie_player video.html5-main-video'?video:null};
 const ctx=vm.createContext({document,location,URLSearchParams,Date:{now:()=>now},sessionStorage:{getItem:k=>session.get(k)||null,setItem:(k,v)=>session.set(k,v),removeItem:k=>session.delete(k)},setInterval:fn=>{intervals.set(++id,fn);return id;},clearInterval:id=>intervals.delete(id)});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../extension/autoplay.js'),'utf8'),ctx);
 const app=ctx.NostalgicAutoplay.create({getState:()=>state,getItems:()=>items,classify:date=>date==='old'?'old':'new',translate:(key,values)=>key+JSON.stringify(values||{}),setEnabled:enabled=>state.autoplayEnabled=enabled,navigate:url=>navigations.push(url),leavePlaylist:url=>playlistExits.push(url)});
 return {app,state,items,document,video,host,player,location,navigations,playlistExits,native:()=>nativeOn,finish(){video.ended=true;events.ended?.({target:video});},advance(ms){now+=ms;[...intervals.values()].forEach(fn=>fn());}};
}
test('turn off native autoplay, count down ten seconds, then select first eligible recommendation',()=>{
 const h=harness();h.app.refresh();assert.equal(h.native(),false);h.finish();assert.equal(h.navigations.length,0);h.advance(9999);assert.equal(h.navigations.length,0);h.advance(1);assert.equal(h.navigations[0],'/watch?v=bbbbbbbbbbb');h.app.destroy();assert.equal(h.native(),true);
});
test('Cancel, changing video, hiding tab or disabling feature prevents autoplay',()=>{
 for(const action of ['cancel','navigate','hide','disable','fullscreen']){const h=harness();h.app.refresh();h.finish();if(action==='cancel')h.player.querySelector('.nt-autoplay-cancel').onclick();if(action==='navigate')h.location.search='?v=zzzzzzzzzzz';if(action==='hide')h.document.hidden=true;if(action==='disable')h.state.autoplayEnabled=false;if(action==='fullscreen')h.document.fullscreenElement={};h.advance(10000);assert.equal(h.navigations.length,0,action);h.app.destroy();}
});
test('live videos are not overridden',()=>{
 for(const options of [{live:true}]){const h=harness(options);h.app.refresh();h.finish();h.advance(10000);assert.equal(h.native(),true);assert.equal(h.navigations.length,0);h.app.destroy();}
});
test('no candidate or unconfirmed native switch means no automatic navigation',()=>{
 for(const kind of ['unknown','empty','new']){const h=harness({unknown:kind==='unknown'});if(kind==='empty')h.items.length=0;if(kind==='new')h.items.forEach(item=>item.published='new');h.app.refresh();h.finish();h.advance(10000);assert.equal(h.navigations.length,0,kind);h.app.destroy();}
});
test('candidate changed during countdown cancels rather than playing a different video',()=>{
 const h=harness();h.app.refresh();h.finish();h.items.shift();h.advance(10000);assert.equal(h.navigations.length,0);h.app.destroy();
});
test('disabling the extension restores original native on/off setting',()=>{
 for(const original of [true,false]){const h=harness({native:original});h.app.refresh();assert.equal(h.native(),false);h.state.enabled=false;h.app.refresh();assert.equal(h.native(),original);assert(h.player.querySelector('.nt-autoplay')===null||h.player.querySelector('.nt-autoplay').hidden);h.app.destroy();}
});

 test('default disabled leaves YouTube autoplay untouched',()=>{const h=harness();h.state.autoplayEnabled=false;h.app.refresh();assert.equal(h.native(),true);h.finish();h.advance(11000);assert.equal(h.navigations.length,0);h.app.destroy();});
 test('Play now navigates once and Cancel does not restart after refresh',()=>{
  const h=harness();h.app.refresh();h.finish();assert.match(h.player.querySelector('.nt-autoplay-image').src,/bbbbbbbbbbb/);h.player.querySelector('.nt-autoplay-play').onclick();h.advance(10000);assert.equal(h.navigations.length,1);
  const q=harness();q.app.refresh();q.finish();q.app.cancel();q.app.refresh();q.finish();q.advance(11000);assert.equal(q.navigations.length,0);
 });
 test('looping video and current/invalid/unknown-date candidates do not trigger autoplay',()=>{
  const h=harness();h.video.loop=true;h.app.refresh();h.finish();h.advance(11000);assert.equal(h.navigations.length,0);
  const q=harness();q.items.splice(0,2,{id:'aaaaaaaaaaa',published:'old'},{id:'invalid',published:'old'},{id:'ddddddddddd',published:'unknown'});q.app.refresh();q.finish();q.advance(11000);assert.equal(q.navigations.length,0);
 });


test('SPA navigation suspends the old player and resumes only after navigation finishes',()=>{
 const h=harness();h.app.refresh();h.finish();h.app.navigationStart();h.advance(11000);assert.equal(h.navigations.length,0);h.app.navigationFinish();h.app.destroy();
});
test('stored default is off and uses a fresh key independent of discarded autoplay experiments',()=>{
 const c=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(__dirname,'../extension/search.js'),'utf8'),c);assert.equal(c.RelatedBefore.defaults.autoplayEnabled,false);assert.equal(c.RelatedBefore.defaults.nostalgicAutoplay,undefined);
});

test('countdown is attached inside the player, outside the sidebar',()=>{const h=harness();h.app.refresh();h.finish();assert(h.player.querySelector('.nt-autoplay'));assert.equal(h.host.querySelector('.nt-autoplay'),null);h.app.destroy();});


test('enabled autoplay leaves playlist once, retaining video and position, then uses own countdown',()=>{
 const h=harness({playlist:true});h.location.search+='&index=4&start_radio=1';h.video.currentTime=42.7;
 h.app.refresh();h.app.refresh();assert.equal(h.playlistExits.length,1);
 const params=new URLSearchParams(h.playlistExits[0].split('?')[1]);assert.equal(params.get('v'),'aaaaaaaaaaa');assert.equal(params.get('t'),'42s');assert.equal(params.has('list'),false);assert.equal(params.has('index'),false);assert.equal(params.has('start_radio'),false);
 h.location.search='?'+params;h.app.refresh();h.finish();h.advance(10000);assert.equal(h.navigations[0],'/watch?v=bbbbbbbbbbb');
});
test('disabled autoplay or extension leaves original playlists untouched',()=>{
 for(const key of ['enabled','autoplayEnabled']){const h=harness({playlist:true});h.state[key]=false;h.app.refresh();assert.equal(h.playlistExits.length,0);assert.equal(h.native(),true);}
});
test('playlist exit preserves incoming timestamp before player is ready',()=>{
 const h=harness({playlist:true});h.location.search+='&t=90s';h.app.refresh();assert.ok(h.playlistExits[0].includes('t=90s'));
});
