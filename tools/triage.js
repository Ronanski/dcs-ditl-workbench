/* sheet triage: random inputs on every sheet, which logic outputs NEVER change + reader defects. usage: node tools/triage.js ditl-workbench-vX.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);
let seed=4242;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
const res=[];
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);const N=S.nets.length;const mn=new Array(N).fill(1e9),mx=new Array(N).fill(-1e9);
 for(let t=0;t<80;t++){for(const n of S.ext)S.rt.ext[n]=S.nets[n].dig?(rnd()<.5?1:0):rnd()*100;
  for(const b of S.blk){const st=S.rt.st[b.id];if(!st)continue;if(b.k==='AI'){const q=b.rng||{lo:0,hi:100};st.val=q.lo+rnd()*(q.hi-q.lo)}else if(b.k==='SIGAB')st.val=rnd()<.3?1:0;else if(b.k==='MAN'){const P=b.p||{};st.val=(P.lo||0)+rnd()*((P.hi==null?100:P.hi)-(P.lo||0))}}
  E.anSettle(S,6);const smp=()=>{for(let n=0;n<N;n++){const v=S.rt.v[n];if(v<mn[n])mn[n]=v;if(v>mx[n])mx[n]=v}};smp();for(let k=0;k<30;k++){E.anStep(S,.5);smp()}}
 const st=n=>mx[n]-mn[n]<1e-6;
 let drv=0,stuck=0;const sb=[];
 for(const b of S.blk){if(!b.o||!b.o.length||['AI','AO','ACT','VLV','IP','CONST','TXD','ACH','ALM','SIGAB','COS','FIELD','MAN','TP','PO','FOUT'].includes(b.k))continue;if(!S.nets[b.o[0]]||!S.nets[b.o[0]].segs.length)continue;drv++;if(b.o.every(st)){stuck++;sb.push(b.k+'#'+b.id)}}
 const cw=S.blk.filter(b=>b.k==='CONST'&&b.warn).length,cref=S.blk.filter(b=>b.k==='CONST'&&b.ref).length;
 const noin=S.blk.filter(b=>['AND','OR','NOT','FF','TON','TOF','TPS','HC','LC','SW','AMT','SUM','SUB','MUL','DIV','DEV','FX','LAG','RATE','RAMPB','SQRT','ABS','PID'].includes(b.k)&&(!b.i||!b.i.length)&&b.o&&b.o.length).length;
 const pidn=S.blk.filter(b=>b.k==='PID'||b.k==='PIDV').length;
 res.push({s:r.name,blocks:S.blk.length,drv,stuck,pct:drv?Math.round(100*stuck/drv):0,cw,noin,pidn,sb:sb.slice(0,8).join(' ')})}

res.sort((a,b)=>(b.stuck+b.cw*2+b.noin*3)-(a.stuck+a.cw*2+a.noin*3));
console.log('sheet  blocks drv stuck % constNotFound noInput PID');for(const o of res)console.log(o.s.padEnd(9),String(o.blocks).padStart(4),String(o.drv).padStart(4),String(o.stuck).padStart(4),String(o.pct).padStart(4)+'%',String(o.cw).padStart(3),String(o.noin).padStart(3),String(o.pidn).padStart(3));
const t=k=>res.reduce((a,o)=>a+o[k],0);console.log('TOTAL stuck',t('stuck'),'of',t('drv'),'constNF',t('cw'),'noInput',t('noin'));
const clean=res.filter(o=>o.stuck<=1&&o.cw===0&&o.noin===0);console.log('CLEAN sheets (<=1 stuck, 0 const-not-found, 0 no-input):',clean.length,clean.map(o=>o.s.replace('ABC-','')).join(' '));
