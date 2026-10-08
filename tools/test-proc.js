/* Process model: for every PID / PIDV that has one, switch it ON, step the SV by 15 % of the span and watch the PV follow it through the REAL chain (selector, ramp, valve): the PV must reach the SV (|SV - PV| < 3 % of the span) without a growing oscillation.
   Loops that cannot reach it (output at its limit, manual selector) are listed. usage: node tools/test-proc.js <html> */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let tot=0,ok=0,na=0;const bad=[],info=[];
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);S.procs=E.anProcList(S);
 for(const b of S.blk){if(b.k!=='PID'&&b.k!=='PIDV')continue;if(!b.proc){na++;info.push(r.name+' '+(b.txt[1]||b.k)+': no process model (PV is not a field signal)');continue}tot++;
  const d=S.drv[b.in0].map(x=>S.blk.find(q=>q.id===x.id)).find(q=>q&&q.k==='DEV'),pl=d.ip.find(q=>q.sg>0),span=b.p.span>0?b.p.span:100;
  /* the selector behind the controller on its leg */
  /* every T / switch that the controller output passes through is put on the leg that carries it (the logic would do it with its own signals) */
  const reach=n=>{const seen=new Set(),q=b.o.slice();while(q.length){const x=q.pop();if(x===n)return true;if(seen.has(x))continue;seen.add(x);for(const c of S.cns[x]||[])for(const y of c.o||[])q.push(y);for(const[dd,s2]of S.link||[])if(s2===x)q.push(dd)}return false};
  for(const t of S.blk)if(t.k==='AMT'||t.k==='SW'){if(reach(t.a))S.rt.st[t.id].fm='A';else if(reach(t.b))S.rt.st[t.id].fm='B'}
  const lo=b.p.rlo!=null?b.p.rlo:0,sv0=lo+.4*span,sv1=lo+.55*span;S.rt.force={};b.proc.on=true;S.rt.force[pl.n]=sv0;E.anSettle(S,5);
  const pvAt=()=>S.rt.v[b.proc.pv];for(let i=0;i<2000;i++)E.anStep(S,.5);S.rt.force[pl.n]=sv1;
  const N=Math.round(Math.max(1800,6*(b.p.ti||0))/.5);const devs=[];let ov=0;for(let i=0;i<N;i++){E.anStep(S,.5);const e=(sv1-pvAt())/span;devs.push(Math.abs(e));if(-e>ov)ov=-e}
  const end=devs.slice(-200).reduce((a,c)=>Math.max(a,c),0),mid=devs.slice(Math.round(N/2),Math.round(N/2)+200).reduce((a,c)=>Math.max(a,c),0),u=S.rt.v[b.o[0]];
  const id=r.name+' '+(b.txt[1]||b.k)+' (Kp '+(+b.p.kp).toFixed(2)+' Ti '+b.p.ti+' Td '+b.p.td+', '+(b.p.lt||'general')+', K '+b.proc.K+' T '+b.proc.T+' L '+b.proc.L+')';
  if(end<.03&&!(end>mid*1.5+.01))ok++;else bad.push(id+' end |dev| '+(100*end).toFixed(1)+' % mid '+(100*mid).toFixed(1)+' % output now '+u.toFixed(1)+' limits '+b.p.lo+' ~ '+b.p.hi+' selector '+(S.blk.filter(t=>(t.k==='AMT'||t.k==='SW')&&(t.trkFrom||[]).includes(b)).map(t=>S.rt.st[t.id].fm+'/'+S.rt.st[t.id].pk).join(',')))}}
console.log('PID / PIDV with a process model:',tot,'| PV reaches the SV without growing oscillation:',ok,'| problems:',bad.length,'| no model:',na);bad.forEach(x=>console.log('  '+x));info.forEach(x=>console.log('  info '+x))
