/* Page links, strictly: every circle of every sheet (numbered, lettered, number + sheet, single circle with "( FROM / TO ABC-xxx )") and every signal-tag link is checked against what the drawing says: partner found, one sender + one receiver, the partner is on the sheet the text names, the tags written beside both ends agree.  usage: node tools/audit-links.js file.html [--all]  (prints the problems; --all prints every link) */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const all=process.argv.includes('--all');
const res=await p.evaluate((all)=>{const rep=[],stat={circles:0,internal:0,xc:0,ref:0,tag:0,linked:0};const cod=n=>n.replace(/^ABC-/,'');
 const kindOf=c=>c.tgt?'number/letter + sheet':(typeof c.num==='string'?'letter':'number');const byKind={};
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;let S;try{S=AN.ensure(sh)}catch(e){continue}const lk=AN.linksOf(sh);stat.tag+=lk.filter(l=>l.to===sh&&l.tag).length;
  const circ=S.conn.concat(S.xc||[]);
  for(const c of circ){stat.circles++;const k=kindOf(c);byKind[k]=(byKind[k]||0)+1;
   const mine=lk.filter(l=>(l.at&&l.at.c===c)||(l.peer&&l.peer.c===c));const pairedHere=S.conn.some(q=>q!==c&&!c.tgt&&q.num===c.num&&q.sink!==c.sink);
   if(pairedHere&&!c.tgt){stat.internal++;continue}
   if(c.tgt)stat.xc++;if(c.ref)stat.ref++;
   if(!mine.length){rep.push('NOT LINKED | '+sh.name+' '+k+' "'+c.num+'"'+(c.tgt?' / '+c.tgt:'')+(c.ref?' ('+c.ref.dir+' '+c.ref.code+')':'')+' '+(c.sink?'sink':'source')+' @'+Math.round(c.x)+','+Math.round(c.y)+' tags '+JSON.stringify(c.tags||[]));continue}
   stat.linked++;
   for(const l of mine){const other=l.at&&l.at.c===c?l.peer:l.at;if(!other||!other.sh)continue;const o=other.c||{};
    /* sheet named by the text */
    const want=c.tgt?[String(c.tgt)]:(c.ref?(c.ref.codes||[c.ref.code]):null);
    if(want){const oc=cod(other.sh.name);const ok=want.some(w=>w===oc||(!/[A-Z]$/.test(w)&&parseInt(w,10)===parseInt(oc,10)));if(!ok)rep.push('WRONG SHEET | '+sh.name+' "'+c.num+'" says '+want.join('/')+' but is linked to '+other.sh.name)}
    /* tags written beside both ends */
    const ta=c.tags||[],tb=o.tags||[];if(ta.length&&tb.length&&!ta.some(t=>tb.includes(t)))rep.push('TAGS DIFFER | '+sh.name+' "'+c.num+'" '+JSON.stringify(ta)+' <-> '+other.sh.name+' "'+(o.num)+'" '+JSON.stringify(tb));
    /* one sender, one receiver */
    const sender=l.from===sh&&l.fromC===c||l.from!==sh&&l.toC===c;
    if(all)rep.push('link | '+(l.from.name+' -> '+l.to.name)+' "'+l.num+'" '+JSON.stringify(ta))}}}
 return {rep,stat,byKind}});
console.log('circles',res.stat.circles,JSON.stringify(res.byKind),'| paired inside the same sheet:',res.stat.internal,'| circles with a sheet / FROM-TO text:',res.stat.xc+res.stat.ref,'| linked to another sheet:',res.stat.linked,'| tag links (signal tag output here, input there):',res.stat.tag);
const probs=res.rep.filter(x=>!x.startsWith('link'));console.log('problems:',probs.length);res.rep.forEach(x=>console.log(x));await b.close()})();
