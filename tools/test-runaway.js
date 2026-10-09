/* Runaway check (second reviewer, 2026-10-09: SI0061 / SI0380 positive feedback, values 1e21): every sheet, every input set to a non-zero value, 120 steps, plant model off: no wire may grow beyond 1e9 (a legitimate 1e7 exists: ABC-001B 10000 / (0.05 x MV)) or become NaN. usage: node tools/test-runaway.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;AN.procDefault=false;const bad=[];let n=0;
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;const S=AN.ensure(sh);AN.go(AN.sheets.indexOf(sh));await new Promise(r=>setTimeout(r,60));for(const pr of S.procs||[])pr.proc.on=false;n++;
  for(const e of S.ext){if(S.xlk&&S.xlk[e])continue;S.rt.ext[e]=S.nets[e].dig?1:0.4375}
  for(const b of S.blk)if(b.k==='AI'&&!b.fb){const s=S.rt.st[b.id],r=b.rng||{lo:0,hi:100};s.val=s.act=r.lo+.3*(r.hi-r.lo)}
  for(let i=0;i<120;i++)AN.stepSet(sh,.5);
  let mx=0,at=-1;for(let k=0;k<S.rt.v.length;k++){const v=S.rt.v[k];if(!isFinite(v)){mx=Infinity;at=k;break}if(Math.abs(v)>mx){mx=Math.abs(v);at=k}}
  if(mx>1e9){const l=S.lab[at];bad.push(sh.name+' net'+at+' '+(l&&l.t||'')+' = '+mx.toExponential(2))}}
 return{n,bad}});
console.log(JSON.stringify({sheets:r.n,runaway:r.bad.length}));r.bad.forEach(x=>console.log('RUNAWAY',x));console.log(r.bad.length||errs.length?'FAIL':'ALL PASS');await b.close();process.exit(r.bad.length||errs.length?1:0)})();
