const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const context=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(__dirname,'../extension/calendar.js'),'utf8'),context);
test('calendar preserves ISO dates, leap years and localized first weekday',()=>{
 const days=context.NostalgicCalendar.monthDays;
 assert.equal(days(2024,1,'en').filter(Boolean).length,29);assert.equal(days(2023,1,'en').filter(Boolean).length,28);
 assert.equal(days(2023,0,'en')[0],'2023-01-01');assert.equal(days(2023,0,'es')[6],'2023-01-01');
 assert.equal(days(2006,0,'en').find(Boolean),'2006-01-01');assert.equal(days(2099,11,'en').at(-1),'2099-12-31');
});

test('maximum calendar year follows local year rollover automatically',()=>{
 const max=context.NostalgicCalendar.maxYear;
 assert.equal(max(new Date(2026,11,31,23,59)),2026);
 assert.equal(max(new Date(2027,0,1,0,0)),2027);
 assert.equal(max(new Date(2028,0,1)),2028);
});

function calendarHarness(){
 class Element{
  constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.attrs={};this.listeners={};this.hidden=false;this.value='';}
  append(...nodes){this.children.push(...nodes);}replaceChildren(){this.children=[];}setAttribute(k,v){this.attrs[k]=v;}focus(){}
  addEventListener(k,fn){(this.listeners[k]??=[]).push(fn);}dispatchEvent(e){for(const fn of this.listeners[e.type]||[])fn(e);}
  querySelectorAll(s){const nodes=this.children.flatMap(n=>[n,...n.querySelectorAll('*')]);return nodes.filter(n=>s==='*'||(s==='select'?n.tag==='select':s==='.date-value'?n.className==='date-value':s==='.calendar-close'?n.className==='calendar-close':s.includes('aria-pressed')?n.className==='calendar-day'&&n.attrs['aria-pressed']==='true':n.className==='calendar-day'));}
  querySelector(s){return this.querySelectorAll(s)[0];}
 }
 const input=new Element('input'),trigger=new Element('button'),panel=new Element('div'),label=new Element('span');label.className='date-value';trigger.append(label);input.value='2022-01-01';panel.hidden=true;
 const handlers={},document={getElementById:id=>({'cutoff':input,'cutoff-display':trigger,'date-calendar':panel}[id]),createElement:t=>new Element(t),createElementNS:(_,t)=>new Element(t),addEventListener:(k,fn)=>handlers[k]=fn};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../extension/calendar.js'),'utf8'),{document,Event:class{constructor(type){this.type=type;}}});
 let changes=0;input.addEventListener('change',()=>changes++);
 return {input,trigger,panel,handlers,changes:()=>changes,choose:()=>panel.querySelectorAll('.calendar-day').find(d=>d.dataset.date==='2022-01-05').onclick(),apply:()=>panel.querySelector('.calendar-close').onclick()};
}
test('calendar applies only on tick and emits one change',()=>{
 const h=calendarHarness();h.trigger.onclick();h.choose();assert.equal(h.input.value,'2022-01-01');assert.equal(h.changes(),0);assert.equal(h.panel.hidden,false);h.apply();assert.equal(h.input.value,'2022-01-05');assert.equal(h.changes(),1);assert.equal(h.panel.hidden,true);
 h.trigger.onclick();h.apply();assert.equal(h.changes(),1);
});
test('closing calendar without tick discards the draft',()=>{
 for(const close of [h=>h.handlers.keydown({key:'Escape',preventDefault(){}}),h=>h.handlers.click({composedPath:()=>[]}),h=>h.trigger.onclick()]){
  const h=calendarHarness();h.trigger.onclick();h.choose();close(h);assert.equal(h.input.value,'2022-01-01');assert.equal(h.changes(),0);h.trigger.onclick();h.apply();assert.equal(h.changes(),0);
 }
});
