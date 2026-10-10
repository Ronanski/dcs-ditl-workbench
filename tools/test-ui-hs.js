/* High / low selector: only the selected input wire is lit (findings 1, 6).  For every HS / LS with two or more inputs whose input nets are used by nobody else: force the inputs so that input A is selected, then B; the dimmed (dead) net must be exactly the other one, AND the engine output must equal the selected input.  usage: node tools/test-ui-hs.js file.html [out-prefix] */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');const write=require('./lib-records.js');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const rec=await p.evaluate(()=>{const R=[];for(const sh of AN.sheets){AN.go(AN.sheets.indexOf(sh));const S=AN.ensure(sh);
 for(const b of S.blk.filter(q=>(q.k==='HS'||q.k==='LS')&&q.i.length>=2)){const base={sheet:sh.name,block:b.k+'#'+b.id,source:'HS = max, LS = min of the inputs; unselected input dimmed like a T switch leg'};
  const ins=b.i.slice(0,2);const alone=ins.every(n=>(S.cns[n]||[]).length===1&&!S.nets[n].dig&&!S.rt.force[n]&&b.i.filter(m=>m===n).length===1);
  if(!alone||b.i.length>2||new Set(b.i).size<2){R.push({...base,input:'-',expected:'-',actual:'inputs '+b.i.length+(alone?'':' (an input net feeds other blocks)'),status:'NOT TESTED',evidence:'only 2-input selectors with private input wires are exercised'});continue}
  for(const [nm,va,vb] of [['A larger',70,30],['B larger',30,70]]){S.rt.force[ins[0]]=va;S.rt.force[ins[1]]=vb;for(let k=0;k<8;k++)AN.settle();const sel=(b.k==='HS')===(va>vb)?ins[0]:ins[1],oth=sel===ins[0]?ins[1]:ins[0];
   S._dk=null;AN.paint();const dead=S._dead,out=S.rt.v[b.o[0]],expOut=b.k==='HS'?Math.max(va,vb):Math.min(va,vb);
   if(dead.has(b.o[0])){R.push({...base,input:nm,expected:'-',actual:'the selector output itself is unused in the default switch states (whole block dimmed)',status:'NOT TESTED',evidence:'downstream T / AMT leg not selected'});continue}
   const okDim=dead.has(oth)&&!dead.has(sel),okOut=Math.abs(out-expOut)<1e-9;
   R.push({...base,input:nm+' ('+va+' / '+vb+')',expected:(b.k==='HS'?'max ':'min ')+expOut+'; dimmed net '+oth+', lit net '+sel,actual:'out '+out+'; dead(other)='+dead.has(oth)+' dead(selected)='+dead.has(sel),status:okDim&&okOut?'PASS':'FAIL',evidence:'S._dead after paint'});}
  delete S.rt.force[ins[0]];delete S.rt.force[ins[1]]}}
 return R});
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-HS','High / low selector active-wire highlight - '+process.argv[2].split('/').pop(),rec,'');console.log(cnt,'errs',errs);await b.close()})();
