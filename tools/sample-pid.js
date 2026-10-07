/* sample: what the PID does with the DEFAULT tuning (Kp 1, Ti 60 s, Td 0) and with another tuning. usage: node tools/sample-pid.js file.html [sheet] [tag] */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);const sheet=process.argv[3]||'ABC-003B',tag=process.argv[4]||'FICFA1043B';
function run(kp,ti,td){const S=build(E,rows.find(r=>r.name===sheet));const pid=S.blk.find(b=>(b.k==='PID')&&b.tag===tag);pid.p.kp=kp;pid.p.ti=ti;pid.p.td=td;
 const dev=S.drv[pid.in0].find(d=>d.k==='DEV'),sv=dev.ip.find(q=>q.sg>0).n,pvn=dev.ip.find(q=>q.sg<0).n;const ai=S.drv[pvn].find(d=>d.k==='AI');const rng=ai.rng||{lo:0,hi:100},span=rng.hi-rng.lo;
 const st=S.rt.st[pid.id],ast=S.rt.st[ai.id];const tau=20,mvToEU=m=>rng.lo+span*m/100;let pv=mvToEU(40);ast.val=pv;const sv0=rng.lo+span*.4,sv1=rng.lo+span*.55;
 S.rt.force[sv]=sv0;E.anSettle(S,6);for(let i=0;i<600;i++){E.anStep(S,.5);pv+=(mvToEU(st.out)-pv)/tau*.5;ast.val=pv}
 S.rt.force[sv]=sv1;const out=[];let peak=-1e9;for(let t=0;t<=600;t+=.5){if(t%30===0||t===10||t===20||t===45)out.push([t,pv,st.out]);E.anStep(S,.5);pv+=(mvToEU(st.out)-pv)/tau*.5;ast.val=pv;peak=Math.max(peak,pv)}
 return{pid,rng,span,sv0,sv1,out,over:(peak-sv1)/(sv1-sv0)*100}}
for(const [kp,ti,td] of [[1,60,0],[2,20,0]]){const r=run(kp,ti,td);console.log(`\n${sheet} ${tag}  range ${r.rng.lo}~${r.rng.hi} ${r.rng.u||''}  action ${r.pid.p.act<0?'reverse':'direct'}   Kp ${kp}  Ti ${ti}s  Td ${td}   SV ${r.sv0.toFixed(1)} -> ${r.sv1.toFixed(1)}   (plant: first order, 20 s)`);
 console.log(' t(s)   PV      MV(%)');for(const [t,pv,mv] of r.out)console.log(String(t).padStart(5),pv.toFixed(2).padStart(8),mv.toFixed(1).padStart(8));console.log(' overshoot',r.over.toFixed(1),'%')}
