/* Finding 13 / MT-03: analog wires that carry a value (not 0) but are drawn GREY in Simulation mode.  usage: node tools/audit-grey-analog.js file.html [out.json]
   Every sheet: all transmitters / field inputs set to 30 % of their range, Run, paint. Reason classes: DEAD-LEG (the signal is only dimmed because nobody downstream follows it: unselected T / AMT leg, idle controller output...), SIGAB (flag net), DIG (net classed digital), OTHER. */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path'),fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
await p.evaluate(()=>{const r=[...document.querySelectorAll('#anbar button')].find(x=>/Run/.test(x.textContent));r&&r.click()});
const res=await p.evaluate(()=>{const out=[];for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;AN.go(AN.sheets.indexOf(sh));const S=AN.ensure(sh);const rt=S.rt;rt.ramp=0;
  for(const a of S.blk.filter(x=>x.k==='AI'&&!x.fb)){const r=a.rng||{lo:0,hi:100};rt.st[a.id].val=r.lo+.3*(r.hi-r.lo)}
  for(const n of S.ext)if(!S.nets[n].dig)rt.ext[n]=30
  for(let k=0;k<10;k++){AN.settle()}S._dk=null;AN.paint();const L=AN.dbgL,dead=S._dead;let analog=0,grey=0;const cls={};const ex=[];
  for(const n of S.nets){if(n.dig||!L.nets[n.id])continue;const v=rt.v[n.id];if(!(Math.abs(v)>1e-6))continue;analog++;const c=L.nets[n.id].getAttribute('stroke');if(c==='#3b4651'||c==='#7f8d99'){grey++;const k=dead.has(n.id)?(dead.direct&&dead.direct.has(n.id)?'DEAD-LEG (unselected T leg)':'DEAD-LEG (nobody downstream follows it)'):(n.sigab?'SIGAB':'OTHER');cls[k]=(cls[k]||0)+1;if(ex.length<4&&k==='OTHER')ex.push({n:n.id,lab:S.lab[n.id]&&S.lab[n.id].t,v})}}
  out.push({sheet:sh.name,analog,grey,cls,ex})}return out});
fs.writeFileSync(process.argv[3]||'/tmp/claude-0/scratch/grey.json',JSON.stringify(res,null,1));
const tot={analog:0,grey:0,cls:{}};res.forEach(r=>{tot.analog+=r.analog;tot.grey+=r.grey;for(const k in r.cls)tot.cls[k]=(tot.cls[k]||0)+r.cls[k]});console.log(JSON.stringify(tot),'sheets',res.length,'errs',errs);
console.log(res.filter(r=>r.cls.OTHER||r.cls.SIGAB).map(r=>r.sheet+' '+JSON.stringify(r.cls)).join('\n'));await b.close()})();
