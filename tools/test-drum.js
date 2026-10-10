/* ABC-010 drum level pressure compensation (S1-LN38 / S1-LN39 from the user's "Drum Level Calculation.xls"): at 0 kg/cm2 the corrected level must equal the measured level (identity), and the curves must be the file's. usage: node tools/test-drum.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(()=>{AN.go(AN.sheets.findIndex(s=>s.name==='ABC-010'));const S=AN.cs().S;const o=[];
 const ais=S.blk.filter(b=>b.k==='AI'),P=ais.filter(b=>b.rng&&b.rng.hi===250),L=ais.filter(b=>b.rng&&b.rng.lo===-422),fx=S.blk.filter(b=>b.k==='FX'&&(b.p.ln==='LN38'||b.p.ln==='LN39'));
 for(const [p,l] of [[0,0],[0,300],[0,-300],[145,300]]){for(const a of P){S.rt.st[a.id].val=p;S.rt.st[a.id].act=p}for(const a of L){S.rt.st[a.id].val=l;S.rt.st[a.id].act=l}
  for(let i=0;i<40;i++)AN.settle();o.push({p,l,ln:fx.map(b=>b.p.ln+'='+(+S.rt.v[b.o[0]]).toFixed(3)).join(' '),out:S.blk.filter(b=>b.k==='DIV').map(b=>+S.rt.v[b.o[0]].toFixed(2))})}
 return {o,warn:fx.map(b=>b.p.lnWarn||''),src:fx.map(b=>b.p.tbl&&b.p.tbl.src||'')}});
let bad=0;const T=(c,m)=>{if(!c)bad++;console.log((c?'OK   ':'FAIL ')+m)};
T(r.src.every(s=>/Drum Level Calculation|DCS Engr Station pattern/.test(s)),'LN38 and LN39 of station 1 come from the DCS patterns 038 / 039 (v1.20.9) or the Drum Level file ('+r.src.join(', ')+')');T(r.warn.every(w=>!w),'no table warning ('+r.warn.join('|')+')');
for(const x of r.o){if(x.p===0)T(x.out.every(v=>Math.abs(v-x.l)<1e-6),'0 kg/cm2, level '+x.l+' mm -> corrected '+x.out.join(', ')+' (identity)')}
const q=r.o.find(x=>x.p===145);T(q&&q.out.every(v=>Math.abs(v-541.2)<1),'145 kg/cm2, 300 mm -> 541.2 with the DCS patterns (531.3 with the old 19-point curve): '+(q&&q.out.join(', '))+' ('+(q&&q.ln)+')');
console.log('errs',errs.length);await b.close();process.exit(bad+errs.length?1:0)})();
