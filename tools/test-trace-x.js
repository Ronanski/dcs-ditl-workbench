/* T1: Trace follows outputs into the receiving sheet. For EVERY link of every sheet: select the sending wire in VIEW mode, the panel must list "▶ continues in sheet X", clicking it must open X with the receiving wire selected and a trace panel. usage: node tools/test-trace-x.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1700,height:950}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;const res={links:0,row:0,jump:0,sel:0,panel:0,back:0,fail:[]};const names=AN.sheets.map(s=>s.name);
 for(const nm of names){const i=AN.sheets.findIndex(s=>s.name===nm);if(AN.cat!=='an')continue;AN.go(i);const sh=AN.cs();if(!sh||!sh.S)continue;let ls=[];try{ls=AN.linksOf(sh).filter(l=>l.from===sh)}catch(e){continue}
  const seen=new Set();
  for(const l of ls){const key=l.to.name+'|'+l.toNets[0]+'|'+l.fromNets[0];if(seen.has(key))continue;seen.add(key);res.links++;
   AN.go(i);AN.sel={net:l.fromNets[0]};const pn=document.getElementById('anp');
   AN.selBox();AN.paint();AN.panelUpd(true);
   const rows=[...document.querySelectorAll('#ansel .tr, #anp .tr')].filter(x=>/continues in sheet/.test(x.textContent));
   const mine=rows.filter(x=>x.textContent.includes('sheet '+l.to.name));
   if(!mine.length){res.fail.push(nm+' -> '+l.to.name+' (circle '+l.num+'): no ▶ row');continue}
   res.row++;mine[0].click();await new Promise(r=>setTimeout(r,60));
   if(AN.cs().name!==l.to.name){res.fail.push(nm+' -> '+l.to.name+': did not jump (at '+AN.cs().name+')');continue}res.jump++;
   if(AN.sel&&l.toNets.includes(AN.sel.net))res.sel++;else res.fail.push(nm+' -> '+l.to.name+': receiving wire not selected');
   if(/Driven by/.test(document.body.innerText))res.panel++;
  }}
 return res});
const bk=await p.evaluate(async()=>{const o={};const w=ms=>new Promise(r=>setTimeout(r,ms));AN.hist.length=0;const i=AN.sheets.findIndex(s=>s.name==='ABC-003E');AN.go(i);const sh=AN.cs(),l=AN.linksOf(sh).find(x=>x.from===sh&&x.to.name==='ABC-003B');
 AN.sel={net:l.fromNets[0]};AN.selBox();AN.paint();AN.panelUpd(true);[...document.querySelectorAll('.tr')].find(x=>/continues in sheet ABC-003B/.test(x.textContent)).click();await w(80);o.at=AN.cs().name;
 const btn=[...document.querySelectorAll('button')].find(x=>x.textContent==='↩ Back'&&x.offsetParent);o.hasBack=!!btn;if(btn){btn.click();await w(150)}o.after=AN.cs().name;
 /* upstream jump (◀) selects the sending wire */
 AN.go(AN.sheets.findIndex(s=>s.name==='ABC-003B'));const s2=AN.cs();const lk=AN.linksOf(s2).find(x=>x.to===s2&&x.from.name==='ABC-003E');AN.sel={net:lk.toNets[0]};AN.selBox();AN.paint();AN.panelUpd(true);const up=[...document.querySelectorAll('.tr')].find(x=>/◀ sheet ABC-003E/.test(x.textContent));o.up=!!up;if(up){up.click();await w(80);o.upAt=AN.cs().name;o.upSel=AN.sel&&lk.fromNets.includes(AN.sel.net)}
 return o});console.log('back / upstream:',JSON.stringify(bk));
console.log(JSON.stringify({...r,fail:r.fail.slice(0,15),nfail:r.fail.length}));console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
