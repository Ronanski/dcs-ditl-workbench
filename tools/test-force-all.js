/* FORCE / SIM has priority over the plant, on every modelled loop of every sheet (user rule, 2026-10-08: a forced PV does not change whatever the SV or the manual command is; analog and digital).
   For each loop: closed loop to the SV; FORCE the PV (as the controller sees it): it must stay at the forced value while the SV is moved and the controller output reacts; release: the PV goes back to the plant value.
   Then FORCE one transmitter (AI) of the loop: the plant must NOT overwrite it. Finally a digital point of the sheet is forced to 1 and to 0 and must hold. usage: node tools/test-force-all.js <html> */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let loops=0,ok=0,aiT=0,aiOk=0,dg=0,dgOk=0;const bad=[];
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);S.procs=E.anProcList(S);
 for(const b of S.procs){const pr=b.proc;if(!pr||pr.mode==='shared')continue;loops++;const pn=E.anPins(S,b),span=b.p.span>0?b.p.span:100,lo=b.p.rlo!=null?b.p.rlo:0,id=r.name+' '+((b.txt||[])[1]||b.k)+' ['+pr.mode+']';
  const reach=n=>{const seen=new Set(),q=b.o.slice();while(q.length){const x=q.pop();if(x===n)return true;if(seen.has(x))continue;seen.add(x);for(const c of S.cns[x]||[])for(const y of c.o||[])q.push(y);for(const[dd,s2]of S.link||[])if(s2===x)q.push(dd)}return false};
  for(const t of S.blk)if(t.k==='AMT'||t.k==='SW'){if(reach(t.a))S.rt.st[t.id].fm='A';else if(reach(t.b))S.rt.st[t.id].fm='B'}
  S.rt.force={};S.rt.pf={};pr.on=true;S.rt.force[pn.sv]=lo+.4*span;E.anSettle(S,5);for(let i=0;i<400;i++)E.anStep(S,.5);
  const X=lo+.8*span;delete S.rt.pf[pr.pv];S.rt.force[pr.pv]=X;let held=true,u0=S.rt.v[b.o[0]],umax=0;S.rt.force[pn.sv]=lo+.55*span;
  for(let i=0;i<400;i++){E.anStep(S,.5);if(Math.abs(S.rt.v[pr.pv]-X)>1e-6)held=false;umax=Math.max(umax,Math.abs(S.rt.v[b.o[0]]-u0))}
  delete S.rt.force[pr.pv];for(let i=0;i<6;i++)E.anStep(S,.5);const q=S.rt.pm[b.id],back=Math.abs(S.rt.v[pr.pv]-X)>1e-6&&(pr.mode==='pin'||Math.abs(S.rt.v[pr.pv]-q.y)<.06*span);
  if(held&&back)ok++;else bad.push(id+' force held '+held+' released '+back);
  if(pr.mode==='transmitter'&&pr.aiOut.length){aiT++;const aid=pr.ai[0],a=S.blk.find(x=>x.id===aid),on=a.pins.find(p=>p.role==='out').n,st=S.rt.st[aid],r_=a.rng||{lo:0,hi:100};S.rt.force[on]=r_.lo+.7*(r_.hi-r_.lo);const v0=st.val;for(let i=0;i<200;i++)E.anStep(S,.5);const stay=Math.abs(S.rt.v[on]-(r_.lo+.7*(r_.hi-r_.lo)))<1e-9&&Math.abs(st.val-v0)<1e-9;delete S.rt.force[on];if(stay)aiOk++;else bad.push(id+' forced transmitter was overwritten by the plant')}}
 /* digital point forced on the sheet */
 {const dnet=S.nets.findIndex((n,i)=>n.dig&&!S.ext.includes(i)&&(S.drv[i]||[]).some(d=>d.k!=='LINK')&&(S.cns[i]||[]).length);if(dnet>=0){dg++;S.rt.force={};let h=true;for(const val of [1,0,1]){S.rt.force[dnet]=val;for(let i=0;i<20;i++)E.anStep(S,.5);if(S.rt.v[dnet]!==val)h=false}delete S.rt.force[dnet];if(h)dgOk++;else bad.push(r.name+' digital net '+dnet+' did not hold the force')}}}
console.log('loops with a plant model:',loops,'| forced PV held + released:',ok,'| forced transmitter not overwritten:',aiOk+'/'+aiT,'| digital force held on sheets:',dgOk+'/'+dg,'| problems:',bad.length);bad.forEach(x=>console.log('  '+x));process.exit(bad.length?1:0);
