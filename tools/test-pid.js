/* PID closed-loop test on ABC-017 (PICSB1052): first-order plant, reverse action, tracking, anti-windup. usage: node tools/test-pid.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);
const S=build(E,rows.find(r=>r.name==='ABC-017'));const pid=S.blk.find(b=>b.k==='PID');
const dev=S.drv[pid.in0].find(d=>d.k==='DEV');const sv=dev.ip.find(q=>q.sg>0).n,pvn=dev.ip.find(q=>q.sg<0).n;
const ai=S.drv[pvn].find(d=>d.k==='AI');const rng=ai.rng||{lo:0,hi:50};const amt=S.cns[pid.o[0]].find(c=>c.k==='AMT'||c.k==='SW');
const st=S.rt.st[pid.id],ast=S.rt.st[ai.id];
console.log('PID',pid.tag,'act',pid.p.act,'kp',pid.p.kp,'ti',pid.p.ti,'span',pid.p.span,'AI range',JSON.stringify(rng),'SV net',sv,'PV net',pvn);
const plant=(gain,tau,mv0)=>{let pv=ast.val;return mv=>{pv+=(gain*(mv-mv0)+rng.lo+(rng.hi-rng.lo)/2-pv)/tau*0.5;ast.val=Math.max(rng.lo,Math.min(rng.hi,pv))}};
const run=(sec,pl)=>{for(let i=0;i<sec*2;i++){E.anStep(S,.5);pl(st.out)}};
S.rt.force[sv]=(rng.lo+rng.hi)/2+5;ast.val=(rng.lo+rng.hi)/2;E.anSettle(S,6);
// reverse action, positive plant gain (valve opens -> PV up): PV must reach SV
const pl=plant(0.5,20,50);run(900,pl);
const pv=S.rt.v[pvn],mv=st.out;console.log('reverse + positive plant: SV',S.rt.force[sv],'PV',pv.toFixed(2),'MV',mv.toFixed(1),Math.abs(pv-S.rt.force[sv])<.3?'OK':'FAIL');
// step the setpoint
S.rt.force[sv]+=3;run(900,pl);console.log('after SV +3: PV',S.rt.v[pvn].toFixed(2),Math.abs(S.rt.v[pvn]-S.rt.force[sv])<.3?'OK':'FAIL');
// settle (dt=0) must not move the integrator
const i0=st.I;E.anSettle(S,6);console.log('settle keeps integrator',Math.abs(st.I-i0)<1e-9?'OK':'FAIL');
// anti-windup: huge error, output pinned at limit, then error reversed recovers quickly
S.rt.force[sv]=rng.hi+1000;run(120,pl);const sat=st.out;S.rt.force[sv]=(rng.lo+rng.hi)/2;run(60,pl);console.log('anti-windup: saturated',sat.toFixed(1),'then MV',st.out.toFixed(1),'PV',S.rt.v[pvn].toFixed(1),st.out<95?'OK':'FAIL (wound up)');
// tracking: AMT on its manual input -> PID follows the AMT output
S.rt.force[amt.b]=37;amt&&(S.rt.st[amt.id].fm='B');for(let i=0;i<20;i++)E.anStep(S,.5);
const y=S.rt.st[amt.id].y;console.log('manual (value 37): AMT output',(+y).toFixed(2),'PID out',st.out.toFixed(2),Math.abs(y-37)<.5&&Math.abs(y-st.out)<.5?'OK (tracks)':'FAIL');
S.rt.st[amt.id].fm=undefined;const before=S.rt.st[amt.id].y;E.anStep(S,.5);E.anStep(S,.5);console.log('back to auto: AMT output',before.toFixed?before.toFixed(2):before,'->',(+S.rt.st[amt.id].y).toFixed(2),Math.abs(S.rt.st[amt.id].y-37)<5?'OK (bumpless)':'FAIL (jump)');
// direct action
pid.p.act=1;S.rt.force[sv]=(rng.lo+rng.hi)/2+5;ast.val=(rng.lo+rng.hi)/2;st.I=0;st.out=0;st.inited=0;const pl2=plant(-0.5,20,50);run(900,pl2);console.log('direct + negative plant: PV',S.rt.v[pvn].toFixed(2),'SV',S.rt.force[sv],Math.abs(S.rt.v[pvn]-S.rt.force[sv])<.3?'OK':'FAIL');

let R=0,N=0;for(const r of rows){if(/ABC-000/.test(r.name))continue;const Q=build(E,r);for(const b of Q.blk)if(b.k==='PID'||b.k==='PIDV')b.p.act<0?R++:N++}console.log('ACT parsed from the drawings: reverse',R,'normal',N,R===38&&N===30?'OK':'CHECK (expected 38 / 30)');
