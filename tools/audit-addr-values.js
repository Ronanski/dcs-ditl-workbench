/* Which ADDRESS texts of the drawings have NO value beside them? (user 2026-10-08: "dapat address at wires, hindi wires lang"). For every sheet: every text that is the address / tag of an ANALOG wire (S.lab, S.tagN) must have a visible live value beside it (digital addresses: colour only, user 2026-10-08). usage: node tools/audit-addr-values.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
await p.evaluate(async()=>{await AN.data;AN.go(AN.sheets.findIndex(s=>s.name==='ABC-002'));await new Promise(r=>setTimeout(r,400));if(AN.view)document.querySelector('button[title^="View mode"]').click()});await p.click('#anbar button:has-text("Run")');
const r=await p.evaluate(async()=>{const out={sheets:0,texts:0,covered:0,missA:[],missD:[]};
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;AN.go(AN.sheets.indexOf(sh));await new Promise(r=>setTimeout(r,350));const S=sh.S,L=AN.dbgL;if(!S||!L)continue;out.sheets++;
  const bds=(L.bd||[]).filter(x=>x.t.style.display!=='none'&&x.t.textContent!=='').map(x=>({n:x.n,x:+x.t.getAttribute('x'),y:-+x.t.getAttribute('y')}));
  const seen=new Set();const items=[];S.lab.forEach((l,n)=>{if(l&&l.t&&S.nets[n].segs.length)items.push({n,t:l.t,x:l.x,y:l.y,h:l.h||3})});(S.tagN||[]).forEach(q=>{const tx=S.tx.find(z=>z.t===q.t);if(tx&&S.nets[q.n]&&S.nets[q.n].segs.length)items.push({n:q.n,t:q.t,x:tx.x,y:tx.y,h:tx.h||3})});
  for(const it of items){const k=it.n+'|'+it.t+'|'+Math.round(it.x)+'|'+Math.round(it.y);if(seen.has(k))continue;seen.add(k);out.texts++;const ex=it.x+it.t.length*it.h*.62;
   if(S.nets[it.n].dig){out.texts--;out.digSkipped=(out.digSkipped||0)+1;continue}const ok=bds.some(q=>q.n===it.n&&Math.hypot(q.x-ex,q.y-it.y)<60);if(ok)out.covered++;else out.missA.push(sh.name+' '+it.t+' net'+it.n)}}
 return out});
console.log(JSON.stringify({sheets:r.sheets,addressTexts:r.texts,withValue:r.covered,missingAnalog:r.missA.length,digitalTextsNotRequired:r.digSkipped}));console.log('analog e.g.',r.missA.slice(0,12).join(' | '));console.log('digital e.g.',r.missD.slice(0,12).join(' | '));/* input -> address: switch a digital input and an analog input, the badge beside the address must follow */
const t=await p.evaluate(async()=>{AN.go(AN.sheets.findIndex(s=>s.name==='ABC-003B'));await new Promise(r=>setTimeout(r,400));const sh=AN.cs(),S=sh.S,L=AN.dbgL,o={};const bd=n=>{const q=L.bd.find(x=>x.n===n&&!x.wire&&x.t.style.display!=='none');return q?q.t.textContent:null};
 const dn=S.ext.find(n=>!S.nets[n].dig&&S.lab[n]&&!(S.xlk&&S.xlk[n]));S.rt.ext[dn]=2;AN.stepSet(sh,.5);await new Promise(r=>setTimeout(r,500));o.d0=bd(dn);S.rt.ext[dn]=7.5;AN.stepSet(sh,.5);await new Promise(r=>setTimeout(r,1500));o.d1=bd(dn);o.dn=S.lab[dn].t;o.dig=L.bd.some(x=>S.nets[x.n].dig&&!x.wire&&x.addr);return o});
console.log('input -> address badge:',JSON.stringify(t));
const ok=r.missA.length===0&&t.d0&&t.d1&&t.d0!==t.d1&&!t.dig&&errs.length===0;console.log(ok?'ALL PASS':'FAIL');await b.close();process.exit(ok?0:1)})();
