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
