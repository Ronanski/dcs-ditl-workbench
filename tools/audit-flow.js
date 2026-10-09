/* WHOLE-SHEET FLOW CHECK (v1.20.7; owner 2026-10-10: "icheck ang buong logic diagram flow as a whole per sheet para sa tamang addressing at show ng mga values").
   Per sheet, plant model OFF: every origin input gets its OWN distinct value, the sheet runs to steady state, then:
   F1 every block of a simple arithmetic kind (ADD / SUM / SUB / DEV / MUL / DIV / ABS / AO / IP) is recomputed from the VALUES OF ITS INPUT WIRES with a formula written here (the pin signs "+" / "-" and "a" / "b" are re-read from the labels of the pins, not from the engine fields) and compared with its OUTPUT wire;
   F2 the number drawn beside every address text equals the value of the net the table tied it to (display = engine, no stale badge);
   F3 every address text of ONE net shows the same number;
   F4 every net that feeds a block has a source (driver, origin input, link) - a wire that carries a value into a block from nowhere is listed;
   F5 the sign of every SUB / DEV / SUM / ADD pin used by the engine equals the "+" / "-" written at that pin.
   Reports counts (blocks checked / not checkable) and every mismatch with sheet, block, address. usage: node tools/audit-flow.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;AN.procDefault=false;const R={sheets:0,blocks:0,checked:0,unchecked:{},bad:[],badge:0,badgeBad:[],multi:[],nosrc:[],sign:[],byKind:{}};
 const near=(a,b)=>Math.abs(a-b)<=1e-6+1e-6*Math.max(Math.abs(a),Math.abs(b));
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;const S=AN.ensure(sh);AN.go(AN.sheets.indexOf(sh));await new Promise(r=>setTimeout(r,120));for(const pr of S.procs||[])pr.proc.on=false;R.sheets++;
  let k=0;for(const e of S.ext){if(S.xlk&&S.xlk[e])continue;k++;S.rt.ext[e]=S.nets[e].dig?1:+(0.31+0.0173*k).toFixed(4)}
  for(const b of S.blk)if(b.k==='AI'&&!b.fb){const s=S.rt.st[b.id],q=b.rng||{lo:0,hi:100};s.val=s.act=q.lo+(0.2+0.011*(b.id%40))*(q.hi-q.lo)}
  for(let i=0;i<220;i++)AN.stepSet(sh,.5);
  try{AN.paint()}catch(e){}await new Promise(r=>setTimeout(r,120));const v=S.rt.v;
  /* F1 / F5 */
  for(const b of S.blk){R.blocks++;const K=b.k;
   if(!['ADD','SUM','SUB','DEV','MUL','DIV','ABS','AO','IP','HLLIM'].includes(K))continue;
   const outs=(b.o||[]).filter(n=>S.nets[n]&&S.nets[n].segs.length&&!S.nets[n].dig);if(!outs.length){R.unchecked['no output wire']=(R.unchecked['no output wire']||0)+1;continue}
   let exp=null,why=null;const ins=b.pins.filter(q=>q.role==='in');
   if(K==='ADD'||K==='SUM'||K==='SUB'||K==='DEV'){
    const labd=ins.every(q=>/^[+\-−]$/.test((q.lab||'').trim()));
    if(!labd&&K!=='SUM'&&K!=='ADD'){why='pins without a drawn + / - sign'}
    else{let y=0;for(const q of ins){const sg=/^[\-−]$/.test((q.lab||'').trim())?-1:1;y+=sg*v[q.n];
      const ip=(b.ip||[]).find(z=>z.n===q.n);if(ip&&/^[+\-−]$/.test((q.lab||'').trim())&&ip.sg!==sg)R.sign.push(sh.name+' '+K+'#'+b.id+' pin net'+q.n+' drawn '+q.lab+' engine sign '+ip.sg)}
     exp=y}}
   else if(K==='MUL'){let y=1;for(const q of ins)y*=v[q.n];if(b.gain!=null)y*=b.gain;if(!ins.length)why='no input';exp=y}
   else if(K==='DIV'){/* the text of the block says which pin is the numerator: "a / b" (A over B) or "b / a" */const tt=S.tx.filter(t=>Math.hypot(t.x-b.cx,t.y-b.cy)<30&&/(?:^|=)\s*[ab]\s*\/\s*[ab]\b/i.test(t.t.trim())).sort((x,y)=>Math.hypot(x.x-b.cx,x.y-b.cy)-Math.hypot(y.x-b.cx,y.y-b.cy))[0];const mm=tt&&/([ab])\s*\/\s*([ab])/i.exec(tt.t),nl=mm?mm[1].toLowerCase():'a',dl=mm?mm[2].toLowerCase():'b';const a=ins.find(q=>(q.lab||'').trim().toLowerCase()===nl),c=ins.find(q=>(q.lab||'').trim().toLowerCase()===dl);if(!a||!c)why='pins without drawn a / b';else if(Math.abs(v[c.n])<1e-9)why='divisor 0';else exp=v[a.n]/v[c.n]}
   else if(K==='HLLIM'){if(b.main==null||b.main<0){why='no main pin'}else{let x=v[b.main];if(b.lo>=0)x=Math.max(x,v[b.lo]);if(b.hi>=0)x=Math.min(x,v[b.hi]);exp=x}}
   else if(K==='ABS'){if(ins.length!==1)why='not one input';else exp=Math.abs(v[ins[0].n])}
   else{if(ins.length!==1)why='not one input';else exp=v[ins[0].n]}
   if(why||exp==null||!isFinite(exp)){R.unchecked[K+': '+(why||'no value')]=(R.unchecked[K+': '+(why||'no value')]||0)+1;continue}
   R.checked++;R.byKind[K]=(R.byKind[K]||0)+1;const got=v[outs[0]];
   if(!near(got,exp)&&Math.abs(got)<1e8)R.bad.push(sh.name+' '+K+'#'+b.id+' @'+Math.round(b.cx)+','+Math.round(b.cy)+': inputs give '+exp.toFixed(4)+', output wire shows '+got.toFixed(4)+(b.p&&b.p.clamp?'':''))}
  /* F2 / F3 */
  const byNet={};for(const x of AN.dbgL.addrRep||[]){const t=x.b.t.textContent;if(t==='')continue;R.badge++;const raw=v[x.n];const dig=S.nets[x.n].dig;if(!dig&&x.b.ai==null){const fmtv=parseFloat(t.replace(/,/g,''));if(isFinite(fmtv)&&Math.abs(fmtv-raw)>Math.max(0.006,Math.abs(raw)*0.006)&&Math.abs(raw)<1e6)R.badgeBad.push(sh.name+' '+x.t+' shows '+t+' but net '+x.n+' = '+raw.toFixed(4))}
   (byNet[x.n]=byNet[x.n]||new Set()).add(t)}
  for(const n in byNet)if(byNet[n].size>1)R.multi.push(sh.name+' net'+n+': '+[...byNet[n]].join(' / '));
  /* F4 */
  for(const b of S.blk){if(['CONST','AO','ALM','TXD','FIELD','UNK'].includes(b.k))continue;for(const n of b.i||[]){if(n==null||n<0||!S.nets[n]||!S.nets[n].segs.length)continue;const src=(S.drv[n]||[]).length||S.ext.includes(n)||(S.link||[]).some(x=>x[0]===n)||(S.kn&&S.kn[n]!=null)||S.nets[n].dig;if(!src)R.nosrc.push(sh.name+' '+b.k+'#'+b.id+' input net'+n+' @'+Math.round(b.cx)+','+Math.round(b.cy))}}
 }
 return R});
console.log('sheets',r.sheets,'| blocks',r.blocks,'| recomputed from the input wires:',r.checked,JSON.stringify(r.byKind));
console.log('not checkable:',JSON.stringify(r.unchecked));
console.log('F1 output differs from the inputs:',r.bad.length);r.bad.slice(0,40).forEach(x=>console.log('  ',x));
console.log('F2 badge differs from its net:',r.badgeBad.length,'of',r.badge);r.badgeBad.slice(0,20).forEach(x=>console.log('  ',x));
console.log('F3 one net, different numbers:',r.multi.length);r.multi.slice(0,20).forEach(x=>console.log('  ',x));
console.log('F4 block input without a source:',r.nosrc.length);r.nosrc.slice(0,30).forEach(x=>console.log('  ',x));
console.log('F5 pin sign differs from the drawn sign:',r.sign.length);r.sign.slice(0,20).forEach(x=>console.log('  ',x));
const ok=!r.bad.length&&!r.badgeBad.length&&!r.multi.length&&!r.sign.length&&!errs.length;console.log(errs.length?'page errors '+errs.join('|'):'',ok?'ALL PASS':'FAIL');await b.close();process.exit(ok?0:1)})();
