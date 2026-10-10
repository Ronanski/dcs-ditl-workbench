/* Which analog nets show NO number (rules 6, 7, 8 of the user's xlsx: every analog wire / net carries its value, except where an address already shows it, and except the final-element chain AO / I/P / valve / actuator / ALM where the equipment shows it).  usage: node tools/audit-values-rules.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
await p.evaluate(()=>{const r=[...document.querySelectorAll('#anbar button')].find(x=>/Run/.test(x.textContent));r&&r.click()});
const names=await p.evaluate(()=>AN.sheets.map(s=>s.name).filter(n=>!/ABC-000/.test(n)));let tot=0,miss=0,hid=0;const rows=[];
for(const n of names){await p.evaluate(n=>AN.go(AN.sheets.findIndex(x=>x.name===n)),n);await p.waitForTimeout(300);
 const r=await p.evaluate(()=>{const S=AN.cs().S,L=AN.dbgL;const vis=new Set(L.bd.filter(q=>q.t.style.display!=='none'&&q.t.textContent).map(q=>q.n));const PASS=['IP','AO','PO','TP','FIELD','VLV','ACT','ALM'];let tot=0;const m=[];
  S.nets.forEach((nt,i)=>{if(!nt||nt.dig||!(nt.segs||[]).length)return;const D=S.drv[i]||[],C=S.cns[i]||[];if(!D.length&&!C.length&&!S.ext.includes(i))return;tot++;const skip=(D.length&&D.every(d=>PASS.includes(d.k)))||(C.length&&C.every(q=>PASS.includes(q.k)));if(skip)return;if(vis.has(i)||(L.addrN&&L.addrN.has(i)))return;m.push(i+':'+D.map(d=>d.k).join('/')+'>'+C.map(c=>c.k).join('/'))});
  return{tot,m}});
 tot+=r.tot;miss+=r.m.length;if(r.m.length)rows.push(n+' nets='+r.tot+' without a number='+r.m.length+'  '+r.m.slice(0,6).join(' '))}
console.log(rows.join('\n'));console.log('TOTAL analog nets',tot,'without a number',miss);await b.close()})();
