/* Group D: RATE / ramp path vs bypass path with the SAME input change, on every RATE / RAMPB block.  usage: node tools/test-verify-rate.js file.html [out-prefix]
   Expected (ramp path): after k seconds the output has moved by min(step, k x rate), rate = the number written on the drawing (per second after unit conversion).
   Expected (bypass path, bypass input = 1): output = input at once (drawing: "1:BYPASS").  Blocks with their own limit inputs (ABC-003E, ABC-052 "X% / sec", ABC-001B): limits come from other signals - tested as NOT TESTED here.
   A rate written in % (of the span) is applied by the engine in SIGNAL UNITS: valid only when the signal span is 100 -> NEEDS REVIEW (unit of rate) unless the text is absolute (T/H, kg/cm2...). */
const L=require('./lib.js'),write=require('./lib-records.js');
const {E,rows}=L.load(process.argv[2]);const rec=[];
for(const sh of rows){const S=L.build(E,sh);
 for(const b of S.blk.filter(q=>q.k==='RATE'||q.k==='RAMPB')){
  const txt=S.tx.filter(t=>Math.hypot(t.x-b.cx,t.y-b.cy)<60&&/\/\s*(sec|min|hr|h)\b/i.test(t.t)).map(t=>t.t.trim()).join(' ; ');
  const base={sheet:sh.name,block:b.k+'#'+b.id,source:'drawing text: '+(txt||'(no rate text found)')};
  if(b.main===undefined){rec.push({...base,input:'(simple ramp, no main/bypass pins)',expected:'',actual:'',status:'NOT TESTED',evidence:'block has no main pin recorded'});continue}
  if(b.up!==undefined){rec.push({...base,input:'limits from signals',expected:'limits follow the up/down limit signals',actual:'not exercised',status:'NOT TESTED',evidence:'own-limit RATE: needs per-sheet limit values'});continue}
  const rate=b.p.rate,rt=S.rt;
  if(!(rate>0)){rec.push({...base,input:'-',expected:'a rate from the drawing',actual:'rate='+rate,status:'NEEDS REVIEW',evidence:'missing / zero rate: engine would step instantly; flagged s.rev=NO RATE'});continue}
  const d=Math.max(3*rate,3),run=(byp,k)=>{rt.force[b.main]=0;if(b.byp>=0)rt.force[b.byp]=0;delete rt.st[b.id].y;rt.st[b.id].y=undefined;for(let i=0;i<3;i++)E.anStep(S,0);rt.force[b.main]=d;if(b.byp>=0)rt.force[b.byp]=byp;const o=[];for(let i=0;i<k;i++){E.anStep(S,1);o.push(rt.v[b.o[0]])}delete rt.force[b.main];if(b.byp>=0)delete rt.force[b.byp];return o};
  const ramp=run(0,4),ok=Math.abs(ramp[0]-Math.min(d,rate))<1e-9&&Math.abs(ramp[1]-Math.min(d,2*rate))<1e-9&&ramp[0]<d;
  const pct=/%/.test(txt)&&!/\bT\s*\/|kg\/cm2|MW|rpm/i.test(txt.replace(/%/g,'x').replace(/x\s*\/\s*(sec|min|hr)/gi,''));
  rec.push({...base,input:'ramp path: step 0 -> '+d+', bypass 0; rate '+rate+' units/s',expected:'t=1s '+Math.min(d,rate)+', t=2s '+Math.min(d,2*rate),actual:ramp.slice(0,2).join(' , '),status:ok?(pct?'NEEDS REVIEW':'PASS'):'FAIL',evidence:ok?(pct?'ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span)':'force main net '+b.main+' -> out net '+b.o[0]):'ramp does not follow the written rate'});
  if(b.byp>=0){const by=run(1,2);rec.push({...base,input:'bypass path: same step 0 -> '+d+', bypass = 1',expected:d+' at once ("1:BYPASS")',actual:by.join(' , '),status:Math.abs(by[0]-d)<1e-9?'PASS':'FAIL',evidence:'bypass net '+b.byp+' forced 1'})}
  else rec.push({...base,input:'bypass path',expected:'-',actual:'no bypass pin on this block',status:'NOT TESTED',evidence:''});
 }}
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-RATE','RATE / ramp vs bypass verification - '+process.argv[2].split('/').pop(),rec,'Same input change applied to the ramp path and the bypass path.');console.log(cnt);
