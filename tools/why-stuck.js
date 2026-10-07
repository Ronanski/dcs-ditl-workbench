/* sheet triage: random inputs on every sheet, which logic outputs NEVER change + reader defects. usage: node tools/triage.js ditl-workbench-vX.html */
const {load,build}=require('/home/user/dcs-ditl-workbench/tools/lib.js');const {E,rows}=load(process.argv[2]);
let seed=4242;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
/* realistic range of an external analog input: from the set points of the comparators it feeds (fallback 0..100) */
const RGC=new Map();const rg=(S,n)=>{let c=RGC.get(S);if(!c)RGC.set(S,c={});if(!c[n]){let lo=0,hi=100,m=0;const seen=new Set(),q=[n];while(q.length){const x=q.pop();if(seen.has(x))continue;seen.add(x);for(const b of S.cns[x]||[]){if(b.p&&typeof b.p.sp==='number'&&['HC','LC','HLC','CMPK','HS','LS'].includes(b.k)){m=Math.max(m,Math.abs(b.p.sp));if(b.p.sp<0)lo=Math.min(lo,b.p.sp*1.5)}else if(['SUB','DEV','ADD','SUM','LAG','RATE','ABS','SQRT','SW','AMT','SEL'].includes(b.k))for(const o of b.o||[])q.push(o)}}if(m>0)hi=m*1.6;c[n]=()=>lo+rnd()*(hi-lo)}return c[n]};



const [,, , sheet, bid]=process.argv;const r=rows.find(x=>x.name===sheet);const S=build(E,r);const N=S.nets.length;const mn=new Array(N).fill(1e9),mx=new Array(N).fill(-1e9);
for(let t=0;t<80;t++){for(const n of S.ext)S.rt.ext[n]=S.nets[n].dig?(rnd()<.5?1:0):rg(S,n)();
 for(const b of S.blk){const st=S.rt.st[b.id];if(!st)continue;if(b.k==='AI'){const q=b.rng||{lo:0,hi:100};st.val=q.lo+rnd()*(q.hi-q.lo)}else if(b.k==='SIGAB')st.val=rnd()<.3?1:0;else if(b.k==='MAN'){const P=b.p||{};st.val=(P.lo||0)+rnd()*((P.hi==null?100:P.hi)-(P.lo||0))}}
 E.anSettle(S,6);const smp=()=>{for(let n=0;n<N;n++){const v=S.rt.v[n];if(v<mn[n])mn[n]=v;if(v>mx[n])mx[n]=v}};smp();for(let k=0;k<30;k++){E.anStep(S,.5);smp()}}
const seen=new Set();const show=(b,d)=>{if(seen.has(b.id)||d>7)return;seen.add(b.id);const ind='  '.repeat(d);
 console.log(ind+b.k+' #'+b.id+(b.tag?' '+b.tag:'')+' '+JSON.stringify(b.p).slice(0,70)+' out['+(b.o||[]).map(n=>n+':'+mn[n].toFixed(1)+'..'+mx[n].toFixed(1)).join(' ')+']');
 for(const n of b.i||[]){const ds=S.drv[n]||[];if(!ds.length)console.log(ind+'  <- net '+n+' ext '+mn[n].toFixed(1)+'..'+mx[n].toFixed(1)+(S.lab[n]?' "'+S.lab[n].t+'"':''));for(const d2 of ds)show(d2,d+1)}};
show(S.blk[+bid],0);
