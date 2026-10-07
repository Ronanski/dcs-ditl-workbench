/* sheet triage: random inputs on every sheet, which logic outputs NEVER change + reader defects. usage: node tools/triage.js ditl-workbench-vX.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);
let seed=4242;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
/* realistic range of an external analog input: from the set points of the comparators it feeds (fallback 0..100) */
const RGC=new Map();const rg=(S,n)=>{let c=RGC.get(S);if(!c)RGC.set(S,c={});if(!c[n]){let lo=0,hi=100,m=0;const seen=new Set(),q=[n];while(q.length){const x=q.pop();if(seen.has(x))continue;seen.add(x);for(const b of S.cns[x]||[]){if(b.p&&typeof b.p.sp==='number'&&['HC','LC','HLC','CMPK','HS','LS'].includes(b.k)){m=Math.max(m,Math.abs(b.p.sp));if(b.p.sp<0)lo=Math.min(lo,b.p.sp*1.5)}else if(['SUB','DEV','ADD','SUM','LAG','RATE','ABS','SQRT','SW','AMT','SEL'].includes(b.k))for(const o of b.o||[])q.push(o)}}if(m>0)hi=m*1.6;c[n]=()=>lo+rnd()*(hi-lo)}return c[n]};

const roots=[];const kindCount={};
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);const N=S.nets.length;const mn=new Array(N).fill(1e9),mx=new Array(N).fill(-1e9);
 for(let t=0;t<80;t++){for(const n of S.ext)S.rt.ext[n]=S.nets[n].dig?(rnd()<.5?1:0):rg(S,n)();
  for(const b of S.blk){const st=S.rt.st[b.id];if(!st)continue;if(b.k==='AI'){const q=b.rng||{lo:0,hi:100};st.val=q.lo+rnd()*(q.hi-q.lo)}else if(b.k==='SIGAB')st.val=rnd()<.3?1:0;else if(b.k==='MAN'){const P=b.p||{};st.val=(P.lo||0)+rnd()*((P.hi==null?100:P.hi)-(P.lo||0))}}
  E.anSettle(S,6);const smp=()=>{for(let n=0;n<N;n++){const v=S.rt.v[n];if(v<mn[n])mn[n]=v;if(v>mx[n])mx[n]=v}};smp();for(let k=0;k<30;k++){E.anStep(S,.5);smp()}}
 const st=n=>mx[n]-mn[n]<1e-6;const skip=['AI','AO','ACT','VLV','IP','CONST','TXD','ACH','ALM','SIGAB','COS','FIELD','MAN','TP','PO','FOUT'];
 for(const b of S.blk){if(!b.o||!b.o.length||skip.includes(b.k))continue;if(!S.nets[b.o[0]]||!S.nets[b.o[0]].segs.length)continue;if(!b.o.every(st))continue;
  const ins=(b.i||[]).filter(n=>S.nets[n]);const stuckIn=ins.filter(st).length;
  const root=stuckIn===0||ins.length===0; // all inputs vary yet output never does
  const val=Math.round(mx[b.o[0]]*100)/100;
  const desc=b.k+(b.tag?' '+b.tag:'')+' #'+b.id+' ['+(b.txt||[]).slice(0,2).join('/').slice(0,40)+'] in:'+ins.map(n=>{const d=S.drv[n]&&S.drv[n][0];return (d?d.k:'ext')+(st(n)?'*':'')}).join(',')+' out='+val;
  if(root){roots.push({s:r.name,k:b.k,desc,dig:S.nets[b.o[0]].dig,val});kindCount[b.k]=(kindCount[b.k]||0)+1}}}
console.log('ROOT stuck blocks (inputs vary, output never): ',roots.length);console.log(JSON.stringify(kindCount));
const bySheet={};for(const o of roots)(bySheet[o.s]=bySheet[o.s]||[]).push(o);
for(const s in bySheet){console.log('\n'+s);for(const o of bySheet[s])console.log('  '+o.desc)}
