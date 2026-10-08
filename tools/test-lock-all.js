/* Every point that the plant model drives (the PV input wire, the transmitter AI of the measurement) must be DISABLED in the panel of its sheet (user: "mas ok kung disabled ang slider ng PV"), on every sheet. usage: node tools/test-lock-all.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;const out={points:0,ok:0,bad:[],free:0,freeOk:0};for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;AN.go(AN.sheets.indexOf(sh));await new Promise(r=>setTimeout(r,60));AN.settle()}
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;AN.go(AN.sheets.indexOf(sh));await new Promise(r=>setTimeout(r,120));const S=sh.S;
  const keys=[];for(const b of S.procs||[]){const pr=b.proc;if(!pr||!pr.on||pr.mode==='shared')continue;if(pr.pinExt!=null&&pr.mode==='input')keys.push(['n'+pr.pinExt,sh.name+' '+((b.txt||[])[1])+' PV input']);for(const id of pr.ai||[])keys.push(['b'+id,sh.name+' '+((b.txt||[])[1])+' transmitter AI#'+id])}
  if(S.plantT){for(const [id,tag] of S.plantT.ai)keys.push(['b'+id,sh.name+' AI#'+id+' (measurement of '+tag+', driven from another sheet)']);for(const [n,tag] of S.plantT.ext)keys.push(['n'+n,sh.name+' wire '+n+' (PV input of '+tag+', driven from another sheet)'])}
  for(const [k,label] of keys){out.points++;const row=AN.rows&&AN.rows[k];if(!row){out.bad.push(label+': no row in the panel');continue}const els=[...row.querySelectorAll('input,button')];if(els.length&&els.every(e=>e.disabled))out.ok++;else out.bad.push(label+': '+els.filter(e=>!e.disabled).length+' of '+els.length+' controls still enabled')}
  /* a free transmitter (not driven by a loop) must stay editable */
  for(const bk of S.blk){if(bk.k!=='AI'||bk.fb)continue;let pb=null;try{pb=AN.procAI(S,bk.id)}catch(e){}if(pb)continue;const row=AN.rows&&AN.rows['b'+bk.id];if(!row)continue;out.free++;const els=[...row.querySelectorAll('input')];if(els.length&&els.every(e=>!e.disabled))out.freeOk++}}
 return out});
console.log('points the plant drives:',r.points,'| disabled in the panel:',r.ok,'| free transmitters:',r.free,'| still editable:',r.freeOk);r.bad.slice(0,20).forEach(x=>console.log('  FAIL '+x));
console.log(r.bad.length||errs.length?'FAIL':'ALL PASS',errs.slice(0,2).join('|'));await b.close();process.exit(r.bad.length||errs.length||r.free!==r.freeOk?1:0)})();
