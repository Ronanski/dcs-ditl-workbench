/* Group D regression: RATE / RAMPB.  usage: node tools/test-verify-rate.js file.html [out-prefix]
   For every RATE / RAMPB block with a main input (own-limit RATE = NOT TESTED):
   (1) UNIT: expected engineering-unit rate per second = written number x time factor (/sec 1, /min 1/60, /hr 1/3600) x (span / 100 when written in %, 1 when absolute).
       Span of a % rate = the range of the controller the block feeds (drawn range) - VERIFIED table below overrides (user-confirmed or computed from the drawing).
   (2) SOURCE: instrument tag -> input value: the field value of the AI that feeds the block (through the drawn wiring) changes the block input.
   (3) RESPONSE: gradual, by elapsed simulation time (1 s steps and 4 x 0.25 s steps give the same output), never instantaneous.
   (4) BYPASS: same input change, bypass = 1 -> output follows at once; bypass = 0 -> ramp. */
const L=require('./lib.js'),write=require('./lib-records.js');
const {E,rows}=L.load(process.argv[2]);const rec=[];
/* verified engineering-unit rates (per second) that override the generic rule */
const VERIFIED={'ABC-001D#3':{r:2.7/3600,why:'drawing: 2.7T / HR = 2.25% / HR = 0.045T / MIN -> 0.00075 T/s (user-confirmed)'},'ABC-001D#4':{r:1.8/3600,why:'drawing: 1.8T / HR = 1.5% / HR = 0.03T / MIN -> 0.0005 T/s'},'ABC-032#13':{r:2,why:'user-confirmed: 1%/sec on the 0~200 T/H flow = 2 T/H/s'}};
const tf=t=>/\/\s*min/i.test(t)?1/60:/\/\s*(hr|h)\b/i.test(t)?1/3600:1;
for(const sh of rows){const S=L.build(E,sh);
 for(const b of S.blk.filter(q=>q.k==='RATE'||q.k==='RAMPB')){const P=b.p,key=sh.name+'#'+b.id,base={sheet:sh.name,block:b.k+'#'+b.id};
  if(b.main===undefined||b.up!==undefined){rec.push({...base,input:'-',expected:'-',actual:'-',source:'-',status:'NOT TESTED',evidence:b.up!==undefined?'own limit inputs (limits come from other signals)':'no main pin recorded'});continue}
  const txt=P.rtxt||'',num=anNumOf(txt),pct=P.pct||/%/.test(txt)&&!P.absHr;
  /* (1) unit conversion */
  let exp,src;
  if(VERIFIED[key]){exp=VERIFIED[key].r;src=VERIFIED[key].why}
  else if(!txt){exp=P.rate;src='no rate text near the block: engine default / assumed value ('+P.rate+') - not from the drawing'}
  else if(!pct){exp=num*tf(txt);src='absolute: '+txt}
  else{const sp=P.spanUnres?100:P.span;exp=num*tf(txt)*sp/100;src=txt+' x span '+sp+(P.spanUnres?' (span NOT resolved, 100 assumed)':' ['+P.spanSrc+']')}
  const okU=Math.abs(P.rate-exp)<=1e-12+1e-9*Math.abs(exp);
  rec.push({...base,input:'rate text "'+txt+'"',expected:exp+' units/s',actual:P.rate+' units/s',source:src,status:!txt?'NEEDS REVIEW':(!okU?'FAIL':(P.spanUnres?'NEEDS REVIEW':'PASS')),evidence:P.spanUnres?'span of the signal not found (no AI / controller range / table range on the path): % rate still applied as signal units':!txt?'rate not on the drawing':'rate/time-unit/span checked'});
  /* (2) source of the input: the NEAREST terminal on the analog data path (BFS) is the real source of the block input */
  {const seen=new Set([b.main]);let lvl=[b.main],term=null;for(let g=0;lvl.length&&g<40&&!term;g++){const nx=[];for(const n of lvl){const ds=S.drv[n]||[];if(!ds.length&&S.ext.includes(n)){term={k:'ext',n};break}for(const d of ds){const bl=d.i===undefined&&d.id!==undefined?S.blk.find(z=>z.id===d.id):d;if(!bl)continue;if(['AI','MAN','CONST','PID','PIDV'].includes(bl.k)){term={k:bl.k,bl};break}if(bl.k==='LINK'&&!(bl.i||[]).some(m=>m>=0&&(S.drv[m]||[]).length||S.ext.includes(m))){term={k:'LINK',bl};break}for(const m of bl.i||[])if(m>=0&&!seen.has(m)&&!S.nets[m].dig){seen.add(m);nx.push(m)}}if(term)break}lvl=nx}
   const rt=S.rt,keep=rt.ramp;
   if(!term)rec.push({...base,input:'source of the input',expected:'a traceable source',actual:'none found',source:'drawn wiring',status:'NEEDS REVIEW',evidence:'unresolved input source'});
   else if(term.k==='AI'||term.k==='ext'){rt.ramp=0;let a,c,nm;
    if(term.k==='AI'){const ai=term.bl,old=rt.st[ai.id].val,r=ai.rng||{lo:0,hi:100};const rd=v=>{rt.st[ai.id].val=v;for(let k=0;k<10;k++)E.anStep(S,0);for(let k=0;k<400;k++)E.anStep(S,1);return rt.v[b.main]};a=rd(r.lo);c=rd(r.hi);rt.st[ai.id].val=old;
     const tag=(S.tx.filter(t=>/^[A-Z]{2,4}-?[A-Z]{0,3}\d{3,5}[A-Z]?$/.test(t.t.trim())).sort((x,y)=>Math.hypot(x.x-ai.cx,x.y-ai.cy)-Math.hypot(y.x-ai.cx,y.y-ai.cy))[0]||{t:'?'}).t.trim();nm='instrument AI#'+ai.id+' (tag ~ '+tag+', range '+r.lo+' ~ '+r.hi+' '+(r.u||'')+')'}
    else{const n=term.n,old=rt.ext[n];const rd=v=>{rt.ext[n]=v;for(let k=0;k<10;k++)E.anStep(S,0);for(let k=0;k<400;k++)E.anStep(S,1);return rt.v[b.main]};a=rd(0);c=rd(50);rt.ext[n]=old;nm='field / manual input net '+n+' (set 0 then 50)'}
    rt.ramp=keep;S.rt=rt;
    rec.push({...base,input:nm,expected:'RATE input follows the supplied simulation value',actual:'block input '+a+' -> '+c,source:'drawn wiring source -> block input',status:Math.abs(c-a)>1e-9?'PASS':'NEEDS REVIEW',evidence:Math.abs(c-a)>1e-9?'valid simulated value reaches the block':'no response: a switch leg / limiter on the path blocks it in the default state'})}
   else rec.push({...base,input:'source of the input: '+term.k+(term.bl?'#'+term.bl.id:''),expected:'-',actual:'not an instrument: '+(term.k==='LINK'?'cross-sheet link, source is on another sheet':term.k==='MAN'||term.k==='PID'||term.k==='PIDV'||term.k==='CONST'?'operator / controller / constant':'?'),source:'drawn wiring',status:'NOT TESTED',evidence:'no instrument tag directly on the path'})}
  /* (3) gradual response by elapsed time  (4) bypass */
  if(!(P.rate>0))continue;
  const d=Math.max(3*P.rate,3),rt=S.rt,go=(byp,steps,dt)=>{rt.force[b.main]=0;if(b.byp>=0)rt.force[b.byp]=0;rt.st[b.id].y=undefined;for(let i=0;i<3;i++)E.anStep(S,0);rt.force[b.main]=d;if(b.byp>=0)rt.force[b.byp]=byp;const o=[];for(let i=0;i<steps;i++){E.anStep(S,dt);o.push(rt.v[b.o[0]])}delete rt.force[b.main];if(b.byp>=0)delete rt.force[b.byp];return o};
  const a=go(0,2,1),c=go(0,8,.25);const e1=Math.min(d,P.rate),e2=Math.min(d,2*P.rate);
  const okR=Math.abs(a[0]-e1)<1e-9&&Math.abs(a[1]-e2)<1e-9&&Math.abs(c[3]-e1)<1e-9&&Math.abs(c[7]-e2)<1e-9&&a[0]<d;
  rec.push({...base,input:'step 0 -> '+d+' with the written rate',expected:'1 s: '+e1+', 2 s: '+e2+' (same with 0.25 s steps), not instant',actual:'1 s steps '+a.join(' , ')+' | 0.25 s steps at 1 s / 2 s: '+c[3]+' , '+c[7],source:'rate x elapsed simulation time',status:okR?'PASS':'FAIL',evidence:'force main net '+b.main});
  if(b.byp>=0){const by=go(1,2,1);rec.push({...base,input:'bypass = 1, same step 0 -> '+d,expected:d+' at once ("1:BYPASS")',actual:by.join(' , '),source:'legend / drawing 1:BYPASS',status:Math.abs(by[0]-d)<1e-9?'PASS':'FAIL',evidence:'bypass net '+b.byp})}
  else rec.push({...base,input:'bypass path',expected:'-',actual:'no bypass pin on this block',source:'-',status:'NOT TESTED',evidence:''});
 }}
function anNumOf(t){const m=/(\d+(?:\.\d+)?)/.exec((t||'').replace(/RAMP\s*:/i,'').replace(/=.*$/,''));return m?+m[1]:NaN}
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-RATE','RATE / ramp regression - '+process.argv[2].split('/').pop(),rec,'Unit conversion (%/sec, %/min, %/hr, absolute), instrument-tag input, gradual response by elapsed time, ramp vs bypass.');console.log(cnt);
