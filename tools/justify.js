/* CONTROLLABILITY: for every digital logic output, search an input combination (backward justification) that makes it 0 and one that makes it 1, apply it with forces, simulate, and check. Outputs that cannot be driven to a value are listed = dead logic or a reader defect.  usage: node tools/justify.js file.html [sheet] */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);const only=process.argv[3];
const DIGK=new Set(['AND','OR','NOT','FF','TON','TOF','TPS','TPV','HC','LC','HLC','CMPK','HS','LS','DCMP']);let tot=0,okc=0;const fails=[];
for(const r of rows){if(/ABC-000/.test(r.name)||(only&&r.name!==only))continue;const S=build(E,r);
 const LINKSRC=new Map();for(const[d,sr]of S.link||[])LINKSRC.set(d,sr);
 const drvOf=n=>(S.drv[n]||[]).find(d=>d.k!=='LINK');

 const addCon=(rq,net,gt,sp,inc)=>{if(net in rq)return false;const key='a'+net;const c=Object.assign({lo:-Infinity,hi:Infinity},rq[key]||{});const e=Math.max(.01,Math.abs(sp)*.001);if(gt)c.lo=Math.max(c.lo,sp+(inc?0:e));else c.hi=Math.min(c.hi,sp-(inc?0:e));if(c.lo>c.hi)return false;rq[key]=c;return true};
 const j=(n,val,req,depth)=>{ // returns true and fills req, or false
  if(depth>14)return false;if(n in req)return req[n]===val;
  const d=drvOf(n);const lk=LINKSRC.get(n);
  if(!d){ if(lk!=null&&!S.ext.includes(n))return j(lk,val,req,depth+1); if(S.kn&&S.kn[n]!=null)return S.kn[n]===val; req[n]=val;return true}
  const save=Object.assign({},req);const tryList=(opts)=>{for(const o of opts){const rq=Object.assign({},save);rq[n]=val;let ok=true;for(const[m,v]of o){if(!j(m,v,rq,depth+1)){ok=false;break}}if(ok){for(const k in req)delete req[k];Object.assign(req,rq);return true}}return false};
  const ins=(d.i||[]).filter(x=>S.nets[x]);const P=d.p||{};
  switch(d.k){
   case 'AND':return val?tryList([ins.map(x=>[x,1])]):tryList(ins.map(x=>[[x,0]]));
   case 'OR':return val?tryList(ins.map(x=>[[x,1]])):tryList([ins.map(x=>[x,0])]);
   case 'NOT':return tryList([[[ins[0],val?0:1]]]);
   case 'FF':return val?tryList([[[d.S,1],[d.Rn,0]]]):tryList([[[d.Rn,1]]]);
   case 'TON':case 'TPS':case 'TPV':return val?tryList([[[ins[0],1]]]):tryList([[[ins[0],0]]]);
   case 'TOF':return tryList([[[ins[0],val?1:0]]]);
   case 'HC':case 'LC':case 'HLC':case 'CMPK':case 'HS':case 'LS':{const x=ins[0];const sp=P.ref>=0?(S.kn&&S.kn[P.ref]!=null?S.kn[P.ref]:50):(P.sp||0);const gt=P.op==='>';const rq=Object.assign({},req);if(!addCon(rq,x,val?gt:!gt,sp,val?!!P.inc:!P.inc))return false;rq[n]=val;for(const k in req)delete req[k];Object.assign(req,rq);return true}
   case 'DCMP':{const x=ins[0];const dc=(d.dc||[]).find(q=>q.n===n);if(!dc)return false;const gt=dc.op==='>';let g2=val?gt:!gt,sp=dc.sp;if(dc.neg){g2=!g2;sp=-sp}const rq=Object.assign({},req);if(!addCon(rq,x,g2,sp,false))return false;rq[n]=val;for(const k in req)delete req[k];Object.assign(req,rq);return true}
   case 'SW':case 'AMT':{const legs=[d.a,d.b].filter(x=>x>=0);const opts=[];(d.cs||[]).forEach(c=>{const leg=c.A?d.a:d.b;const rest=(d.cs||[]).filter(q=>q!==c).map(q=>[q.n,0]);if(leg>=0)opts.push([[c.n,1],...rest,[leg,val]])});return tryList(opts)}
   case 'PVSV':{const rq=Object.assign({},req);const a=d.pv,b2=d.sv;if(a in rq||b2 in rq)return false;rq[a]=val?0:10;rq[b2]=val?10:0;rq[n]=val;for(const k in req)delete req[k];Object.assign(req,rq);return true}
   case 'SIGAB':req[n]=val;return true;
   case 'ALM':return false;
   default:return false}};
 const check=(n,val)=>{const req={};if(!j(n,val,req,0))return 'no assignment';const r0=sim(n,val,req,0);return r0==='ok'?r0:(sim(n,val,req,1)==='ok'?'ok':r0)};
 const sim=(n,val,req,init)=>{
  for(const b of S.blk)if(b.k==='AI'||b.k==='SIGAB'){}
  S.rt.force={};for(const k in req){const m=+k;const d=drvOf(m);if(!d||true){if(!(drvOf(m)&&DIGK.has(drvOf(m).k)&&false))S.rt.force[m]=req[k]}}
  // only force the leaves: nets with no logic driver, and analog set-point inputs
  S.rt.force={};for(const k in req){if(k[0]==='a')continue;const m=+k;const d=drvOf(m);const leaf=!d||!DIGK.has(d.k)&&!['SW','AMT'].includes(d.k);if(leaf||(S.nets[m]&&!S.nets[m].dig))S.rt.force[m]=req[k]}
  const leaves=Object.keys(S.rt.force).map(Number);S.rt.force={};for(const m of S.ext)if(S.nets[m].dig)S.rt.force[m]=init;for(const[dd]of S.link||[]){if(!drvOf(dd))S.rt.force[dd]=init}E.anSettle(S,10);for(let t=0;t<10;t++)E.anStep(S,.5);for(const[dd]of S.link||[])delete S.rt.force[dd];
  for(const m of leaves)S.rt.force[m]=req[m];for(const k in req)if(k[0]==='a'){const c=req[k],m=+k.slice(1);S.rt.force[m]=(c.lo>-Infinity&&c.hi<Infinity)?(c.lo+c.hi)/2:c.lo>-Infinity?c.lo+Math.max(1,Math.abs(c.lo)*.2):c.hi-Math.max(1,Math.abs(c.hi)*.2)}let mx=0,mn=1;E.anSettle(S,10);const smp=()=>{const q=S.rt.v[n]>.5?1:0;if(q>mx)mx=q;if(q<mn)mn=q};smp();for(let t=0;t<200;t++){E.anStep(S,.5);smp()}const v=val?mx:mn;S.rt.force={};return v===val?'ok':'assignment found but simulation gives '+(val?mx:mn)};
 for(const b of S.blk){if(!DIGK.has(b.k)||!b.o||!b.o.length)continue;if(!S.nets[b.o[0]]||!S.nets[b.o[0]].segs.length)continue;
  for(const n of b.o){if(!S.nets[n].dig)continue;for(const val of[0,1]){tot++;const res=check(n,val);if(res==='ok')okc++;else fails.push(r.name+' '+b.k+'#'+b.id+' '+(b.tag||(b.txt||[])[0]||'')+' -> '+val+' : '+res)}}}}
console.log('digital outputs x value (0 / 1):',tot,' reachable:',okc,' NOT reachable:',fails.length);const by={};fails.forEach(f=>{const s=f.split(' ')[0];by[s]=(by[s]||0)+1});console.log(JSON.stringify(by));fails.slice(0,200).forEach(f=>console.log('  '+f));
