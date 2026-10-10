/* Bad Signal (SIG.AB) on every transmitter that has one (user 2026-10-10): with the flag forced ON the logic receives ZERO from that transmitter and the B.xxxx flag net is 1; back to normal the value returns.
   usage: node tools/test-verify-ab.js file.html [out-prefix] */
const L=require('./lib.js'),write=require('./lib-records.js');const {E,rows}=L.load(process.argv[2]);const rec=[];
for(const sh of rows){if(/ABC-000/.test(sh.name))continue;const S0=L.build(E,sh);
 for(const a of S0.blk.filter(b=>b.k==='AI'&&b.sig)){const base={sheet:sh.name,block:'AI#'+a.id+' / SIGAB#'+a.sig.id,source:'user rule 2026-10-10: bad signal = receiving block gets 0 and the B flag is 1'};
  const S=L.build(E,sh),ai=S.blk.find(b=>b.id===a.id),sg=S.blk.find(b=>b.id===a.sig.id),on=ai.pins.find(p=>p.role==='out').n,fl=sg.o&&sg.o.length?{n:sg.o[0]}:null,rng=ai.rng&&ai.rng.hi>ai.rng.lo?ai.rng:{lo:0,hi:100};
  if(ai.fb){rec.push({...base,input:'-',expected:'free transmitter',actual:'feedback AI: its value follows the position of its valve / actuator',status:'NOT TESTED',evidence:'AI#'+ai.id+' b.fb'});continue}
  const v=rng.lo+(rng.hi-rng.lo)*0.6;S.rt.ramp=0;S.rt.st[ai.id].val=v;E.anSettle(S,10);const n0=S.rt.v[on];
  rec.push({...base,input:'normal, value '+v,expected:String(v),actual:String(n0),status:Math.abs(n0-v)<1e-6?'PASS':'FAIL',evidence:'AI out net '+on});
  S.rt.st[sg.id].val=1;E.anSettle(S,10);const n1=S.rt.v[on],f1=fl?S.rt.v[fl.n]:null;
  rec.push({...base,input:'Bad Signal ON',expected:'0 into the logic and flag = 1',actual:'signal '+n1+', flag '+f1,status:n1===0&&(fl?f1===1:true)?'PASS':'FAIL',evidence:'AI out net '+on+', '+(fl?'flag net '+fl.n:'no wire of this sheet carries the B flag (it is used by address on other sheets / DITL)')});
  const users=(S.cns[on]||[]).filter(q=>q.k!=='SIGAB');
  if(users.length){const q=users[0];const bq=S.blk.find(b=>b.id===q.id);const rd=bq&&bq.i&&bq.i.includes(on);rec.push({...base,input:'receiver '+q.k+'#'+q.id,expected:'receiver input net = 0',actual:String(S.rt.v[on]),status:rd&&S.rt.v[on]===0?'PASS':'FAIL',evidence:'consumer of the net'})}
  S.rt.st[sg.id].val=0;E.anSettle(S,10);const n2=S.rt.v[on],f2=fl?S.rt.v[fl.n]:null;
  rec.push({...base,input:'back to normal',expected:v+' and flag 0',actual:'signal '+n2+', flag '+f2,status:Math.abs(n2-v)<1e-6&&(fl?f2===0:true)?'PASS':'FAIL',evidence:'restore'})}}
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-AB','Bad Signal (SIG.AB) - '+process.argv[2].split('/').pop(),rec,'Every transmitter with a SIG.AB box.');console.log(cnt);
