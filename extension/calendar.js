(() => {
 const iso=(year,month,day)=>`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
 function monthDays(year,month,language){const first=new Date(year,month,1).getDay(),offset=(first-(language==='es'?1:0)+7)%7,count=new Date(year,month+1,0).getDate();return [...Array(offset).fill(null),...Array.from({length:count},(_,i)=>iso(year,month,i+1))];}
 const maxYear=(date=new Date())=>Math.max(2006,date.getFullYear());
 const maxDate=()=>`${maxYear()}-12-31`;
 let refresh=()=>{};
 globalThis.NostalgicCalendar={monthDays,maxYear,refresh:language=>refresh(language)};
 if(typeof document==='undefined')return;
 const input=document.getElementById('cutoff'),trigger=document.getElementById('cutoff-display'),panel=document.getElementById('date-calendar');
 if(!input||!trigger||!panel)return;
 let language='en',year=2022,month=0;
 const locale=()=>language==='es'?'es-ES':'en-US';
 const labels=()=>language==='es'?{previous:'Mes anterior',next:'Mes siguiente',month:'Mes',year:'Año',calendar:'Elegir fecha',close:'Cerrar calendario'}:{previous:'Previous month',next:'Next month',month:'Month',year:'Year',calendar:'Choose date',close:'Close calendar'};
 function button(text,name){const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',name);return b;}
 function close(focus=false){panel.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus();}
 function draw(){
   input.max=maxDate();if(year>maxYear()){year=maxYear();month=11;}
   const l=labels();panel.setAttribute('aria-label',l.calendar);panel.replaceChildren();
   const header=document.createElement('div');header.className='calendar-header';
   const previous=button('‹',l.previous),next=button('›',l.next),monthSelect=document.createElement('select'),yearSelect=document.createElement('select');
   previous.disabled=year===2006&&month===0;next.disabled=year===maxYear()&&month===11;
   previous.onclick=()=>{month--;if(month<0){month=11;year--;}draw();(panel.querySelector('.calendar-day[aria-pressed="true"]')||panel.querySelector('.calendar-day'))?.focus();};
   next.onclick=()=>{month++;if(month>11){month=0;year++;}draw();(panel.querySelector('.calendar-day[aria-pressed="true"]')||panel.querySelector('.calendar-day'))?.focus();};
   monthSelect.setAttribute('aria-label',l.month);yearSelect.setAttribute('aria-label',l.year);
   for(let i=0;i<12;i++){const option=document.createElement('option');option.value=i;option.textContent=new Intl.DateTimeFormat(locale(),{month:'long'}).format(new Date(2022,i,1));monthSelect.append(option);}
   for(let y=2006;y<=maxYear();y++){const option=document.createElement('option');option.value=y;option.textContent=y;yearSelect.append(option);}
   monthSelect.value=month;yearSelect.value=year;
   monthSelect.onchange=()=>{month=Number(monthSelect.value);draw();panel.querySelector('select').focus();};yearSelect.onchange=()=>{year=Number(yearSelect.value);draw();panel.querySelectorAll('select')[1].focus();};
   const dismiss=button('×',l.close);dismiss.className='calendar-close';dismiss.onclick=()=>close(true);header.append(previous,monthSelect,yearSelect,next,dismiss);panel.append(header);
   const weekdays=document.createElement('div');weekdays.className='calendar-weekdays';
   const sunday=language==='es'?2:1;
   for(let i=0;i<7;i++){const label=document.createElement('span');label.textContent=new Intl.DateTimeFormat(locale(),{weekday:'short'}).format(new Date(2023,0,sunday+i));weekdays.append(label);}panel.append(weekdays);
   const grid=document.createElement('div');grid.className='calendar-days';
   for(const value of monthDays(year,month,language)){
     if(!value){grid.append(document.createElement('span'));continue;}
     const date=new Date(year,month,Number(value.slice(-2))),day=button(Number(value.slice(-2)),new Intl.DateTimeFormat(locale(),{dateStyle:'full'}).format(date));day.className='calendar-day';day.dataset.date=value;day.setAttribute('aria-pressed',String(value===input.value));
     day.onclick=()=>{input.value=value;input.dispatchEvent(new Event('change',{bubbles:true}));(panel.querySelector('.calendar-day[aria-pressed="true"]')||panel.querySelector('.calendar-day'))?.focus();};grid.append(day);
   }panel.append(grid);
 }
 refresh=lang=>{language=lang==='es'?'es':'en';input.max=maxDate();const value=input.value||'2022-01-01';const [y,m,d]=value.split('-').map(Number);trigger.querySelector('.date-value').textContent=new Intl.DateTimeFormat(locale(),{year:'numeric',month:'short',day:'numeric'}).format(new Date(y,m-1,d));trigger.setAttribute('aria-label',labels().calendar);if(!panel.hidden)draw();};
 trigger.onclick=()=>{if(!panel.hidden){close();return;}[year,month]=(input.value&&input.value<=maxDate()?input.value:maxDate()).split('-').map(Number);month--;draw();panel.hidden=false;trigger.setAttribute('aria-expanded','true');(panel.querySelector('.calendar-day[aria-pressed="true"]')||panel.querySelector('.calendar-day'))?.focus();};
 input.addEventListener('change',()=>refresh(language));
 document.addEventListener('click',event=>{if(!panel.hidden&&!event.composedPath().includes(panel)&&!event.composedPath().includes(trigger))close();});
 document.addEventListener('keydown',event=>{
   if(panel.hidden)return;if(event.key==='Escape'){event.preventDefault();close(true);return;}
   const day=event.target.closest?.('.calendar-day');if(!day)return;
   const step={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key];if(!step)return;
   event.preventDefault();const [y,m,d]=day.dataset.date.split('-').map(Number),date=new Date(y,m-1,d+step);if(date.getFullYear()<2006||date.getFullYear()>maxYear())return;year=date.getFullYear();month=date.getMonth();draw();panel.querySelector(`[data-date="${iso(year,month,date.getDate())}"]`)?.focus();
 });
 refresh('en');
})();
