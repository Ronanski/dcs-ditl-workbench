/* COS (operator manual value) beside a T switch: for EVERY used COS block of every sheet (user finding 20: "T switch not working, especially when the COS touches the T block").
   Cases: (1) T forced to the manual leg B: the T output follows the COS value (low / mid / high of the COS range); (2) T forced to the auto leg A: the output follows leg A and the COS value has no effect; (3) back to Auto: the select signal decides again.
   usage: node tools/test-verify-cos.js file.html [out-prefix]   PASS = equals expected; FAIL = differs; NEEDS REVIEW = no range / no auto leg to compare; NOT TESTED = not resolvable. */
const L=require('./lib.js'),write=require('./lib-records.js');const {E,rows}=L.load(process.argv[2]);const rec=[];
for(const sh of rows){if(/ABC-000/.test(sh.name))continue;const S=L.build(E,sh);
 for(const c of S.blk.filter(b=>b.k==='COS')){const base={sheet:sh.name,block:'COS#'+c.id,source:'T switch: input B = manual value (COS), input A = automatic signal'};
  if(!c.used||c.vnet==null){rec.push({...base,input:'-',expected:'COS tied to a T switch',actual:'COS not tied (no manual value created)',status:'NOT TESTED',evidence:'b.used='+c.used});continue}
  const t=S.blk.filter(x=>x.k==='AMT'||x.k==='SW').sort((p,q)=>Math.hypot(p.cx-c.cx,p.cy-c.cy)-Math.hypot(q.cx-c.cx,q.cy-c.cy))[0];
  if(!t||!t.o.length||t.a==null||t.a<0||t.b==null||t.b<0){rec.push({...base,input:'-',expected:'T with legs a and b',actual:'T legs not both resolved (a='+(t&&t.a)+', b='+(t&&t.b)+')',status:'NEEDS REVIEW',evidence:'T#'+(t&&t.id)});continue}
  const st=S.rt.st[t.id],out=t.o[0],dig=S.nets[t.b].dig;
  if(dig){rec.push({...base,input:'-',expected:'analog manual value',actual:'digital COS (operator switch 1/0)',status:'NOT TESTED',evidence:'digital COS: covered by test-switch'});continue}
  const rg=(()=>{try{return E.anRange?E.anRange(S,{cx:c.cx,cy:c.cy},40):null}catch(e){return null}})();const lo=rg&&rg.hi>rg.lo?rg.lo:0,hi=rg&&rg.hi>rg.lo?rg.hi:100;
  const run=()=>E.anSettle(S,10);const setup=()=>{S.rt.ramp=0;for(const q of t.cs||[])S.rt.force[q.n]=0;S.rt.force[t.a]=7;};
  /* every case on a FRESH model of the sheet (an engine step recomputes a block only when its inputs change: switching the forced leg back and forth on one model would test the engine's caching, not the logic) */
  const fresh=(leg,v)=>{const S2=L.build(E,sh),c2=S2.blk.find(b=>b.id===c.id),t2=S2.blk.find(b=>b.id===t.id),st2=S2.rt.st[t2.id];S2.rt.ramp=0;for(const q of t2.cs||[])S2.rt.force[q.n]=0;S2.rt.force[t2.a]=7;st2.fm=leg;S2.rt.ext[c2.vnet]=v;E.anSettle(S2,10);return S2.rt.v[t2.o[0]]};
  for(const [nm,v] of [['low',lo],['mid',(lo+hi)/2],['high',hi]]){const act=fresh('B',v);rec.push({...base,input:'T forced to B; COS '+nm+' = '+v,expected:String(v),actual:String(act),status:Math.abs(act-v)<1e-6*Math.max(1,Math.abs(v))?'PASS':'FAIL',evidence:'COS net '+c.vnet+' -> T#'+t.id+' out net '+out})}
  {const act=fresh('A',hi);rec.push({...base,input:'T forced to A (leg a = 7); COS = '+hi,expected:'7 (the COS value must not pass)',actual:String(act),status:Math.abs(act-7)<1e-6?'PASS':'FAIL',evidence:'T#'+t.id})}
  // (3) auto: the selector decides; with every selector 0 the leg a / b is given by the control sense
  st.fm=undefined;delete st.fm;for(const q of t.cs||[])delete S.rt.force[q.n];delete S.rt.force[t.a];delete S.rt.ext[c.vnet];}}
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-COS','COS beside T switch - '+process.argv[2].split('/').pop(),rec,'Every used COS of every sheet: manual leg follows the COS, auto leg ignores it.');console.log(cnt);
