const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function element(tag){return {tag,children:[],attrs:{},textContent:'',append(...nodes){for(const n of nodes)if(n.tag==='fragment')this.children.push(...n.children);else this.children.push(n);},replaceChildren(){this.children=[];},setAttribute(k,v){this.attrs[k]=v;}};}
const ctx=vm.createContext({document:{createElement:element,createDocumentFragment:()=>element('fragment')}});vm.runInContext(fs.readFileSync(path.join(__dirname,'../extension/watch-cards.js'),'utf8'),ctx);
test('watch cards use separate thumbnail/text columns, safe text and append without losing prior cards',()=>{
 const container=element('div'),video={id:'abcdefghijk',title:'<img onerror=alert(1)>',channel:'Example',published:'10 years ago',renderer:{videoRenderer:{lengthText:{simpleText:'3:26'},viewCountText:{simpleText:'0 views'}}}};
 ctx.NostalgicWatchCards.render(container,[video],false);const card=container.children[0];assert.equal(card.children.length,2);assert.equal(card.children[0].href,'/watch?v=abcdefghijk');assert.equal(card.children[0].children[1].textContent,'3:26');assert.equal(card.children[1].children[0].textContent,video.title);assert.equal(card.children[1].children[2].textContent,'0 views · 10 years ago');
 ctx.NostalgicWatchCards.render(container,[{...video,id:'12345678901'}],true);assert.equal(container.children.length,2);
 ctx.NostalgicWatchCards.render(container,[{...video,id:'javascript:alert(1)'}],false);assert.equal(container.children.length,0);
});
