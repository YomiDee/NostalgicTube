/* Fechas locales y rangos conservadores para etiquetas relativas de YouTube. */
(() => {
  const defaults = {enabled:true, cutoff:'2022-01-01', mode:'hide', unknown:'hide', homeOnly:true};
  function parse(text, now = new Date()) {
    const abbreviations={a:'anos',d:'dias',h:'horas',min:'minutos',s:'segundos',sem:'semanas'};
    const s = (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/(hace\s+\d+)\s+(a|d|h|min|s|sem)\b/g,(_,prefix,unit)=>prefix+' '+abbreviations[unit]).replace(/\b(\d+)\s*(yrs?|y|mos?|wks?|w|d|h|mins?|m|secs?|s)\s+ago\b/g,(_,number,unit)=>number+' '+({y:'years',yr:'years',yrs:'years',mo:'months',mos:'months',w:'weeks',wk:'weeks',wks:'weeks',d:'days',h:'hours',m:'minutes',min:'minutes',mins:'minutes',s:'seconds',sec:'seconds',secs:'seconds'}[unit])+' ago');
    let m = s.match(/\b(20\d{2}|19\d{2})-(\d{2})-(\d{2})\b/);
    if (m) { const d = new Date(+m[1],+m[2]-1,+m[3]); if(d.getFullYear()===+m[1] && d.getMonth()===+m[2]-1 && d.getDate()===+m[3]) return [d,d]; }
    const months = {enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,julio:6,agosto:7,septiembre:8,octubre:9,noviembre:10,diciembre:11,january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};
    for(const [name,index] of Object.entries({...months})) months[name.slice(0,3)]=index;
    Object.assign(months,{ene:0,abr:3,ago:7,dic:11,sept:8});
    m = s.match(/\b(\d{1,2})\s+(?:de\s+)?([a-z]+)\.?\s+(?:de\s+)?(\d{4})\b/);
    if (!m) {const e = s.match(/\b([a-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})\b/); if(e) m=[e[0],e[2],e[1],e[3]];}
    if(m && months[m[2]]!==undefined) {const d=new Date(+m[3],months[m[2]],+m[1]); if(d.getMonth()===months[m[2]] && d.getDate()===+m[1]) return [d,d];}
    m = s.match(/(?:hace\s+)(\d+)\s*(segundos?|minutos?|horas?|dias?|semanas?|mes(?:es)?|anos?)/) || s.match(/\b(\d+)\s*(seconds?|minutes?|hours?|days?|weeks?|months?|years?)\s+ago\b/);
    if(!m) return null;
    const n=+m[1], unit=m[2];
    function back(k) {const d=new Date(now); if(/^(ano|year)/.test(unit)) { const day=d.getDate(); d.setDate(1); d.setFullYear(d.getFullYear()-k); const month=d.getMonth(); d.setDate(day); if(d.getMonth()!==month) d.setDate(0); } else if(/^(mes|month)/.test(unit)) {const day=d.getDate(); d.setDate(1); d.setMonth(d.getMonth()-k); const month=d.getMonth(); d.setDate(day); if(d.getMonth()!==month) d.setDate(0);} else {const ms=/^(seg|sec)/.test(unit)?1000:/^min/.test(unit)?60000:/^(hora|hour)/.test(unit)?3600000:/^(sem|week)/.test(unit)?604800000:86400000; d.setTime(d.getTime()-k*ms);} return d;}
    return [back(n+1),back(n)];
  }
  function classify(text, cutoff, now) {const range=parse(text,now); if(!range) return 'unknown'; const boundary=new Date(cutoff+'T00:00:00'); if(range[1]<boundary) return 'old'; if(range[0]>=boundary) return 'new'; return 'unknown';}
  globalThis.YouTubeAntes = {defaults,parse,classify};
})();
