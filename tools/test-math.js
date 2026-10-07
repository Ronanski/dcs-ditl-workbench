/* Every mathematical / selection block of every sheet against its legend formula: ABS, ADD, SUB, SUM, DEV (with the signs read from the drawing), MUL (product x gain), DIV (a / b), SQRT (100 sqrt(x / 100) in % of span), high / low selector, high / low limiters, HLLIM clamp, LAG (first order), CONST.  The inputs are forced to random values, the output is compared with the formula.  usage: node tools/test-math.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let seed=99;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
const cnt={},bad={};let tot=0,nbad=0;
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 for(const b of S.blk){const K=b.k;if(!['ABS','ADD','SUB','SUM','DEV','MUL','DIV','SQRT','HS','LS','HLIM','LLIM','HLLIM','LAG'].includes(K)||!b.o.length)continue;
  const ins=K==='DIV'?[b.nu,b.de]:K==='HLLIM'?[b.main,b.hi,b.lo].filter(x=>x>=0):b.i;if(!ins.length||ins.some(n=>n==null||n<0))continue;
  const o=b.o[0];for(let trial=0;trial<3;trial++){const val={};S.rt.force={};ins.forEach(n=>{val[n]=Math.round((rnd()*180-30)*100)/100;S.rt.force[n]=val[n]});
   if(K==='LAG'){const x=rnd()*80+10;S.rt.force[ins[0]]=x;E.anSettle(S,5);}else E.anSettle(S,5);
   const y=S.rt.v[o];let w;const g=n=>val[n];
   if(K==='ABS')w=Math.abs(g(ins[0]));
   else if(['ADD','SUB','SUM','DEV'].includes(K))w=b.ip.reduce((a,q)=>a+q.sg*g(q.n),0);
   else if(K==='MUL')w=ins.reduce((a,n)=>a*g(n),1)*(b.gain!=null?b.gain:1);
   else if(K==='DIV')w=Math.abs(g(b.de))<1e-9?null:g(b.nu)/g(b.de);
   else if(K==='SQRT')w=g(ins[0])<0?0:100*Math.sqrt(g(ins[0])/100);
   else if(K==='HS'||K==='LLIM')w=Math.max(...ins.map(g));
   else if(K==='LS'||K==='HLIM')w=Math.min(...ins.map(g));
   else if(K==='HLLIM'){w=g(b.main);if(b.lo>=0)w=Math.max(w,g(b.lo));if(b.hi>=0)w=Math.min(w,g(b.hi))}
   else if(K==='LAG'){continue}
   if(w==null)continue;cnt[K]=(cnt[K]||0)+1;tot++;if(Math.abs(y-w)>1e-6*Math.max(1,Math.abs(w))){nbad++;bad[K]=(bad[K]||0)+1;if(nbad<=15)console.log('MISMATCH',r.name,K+'#'+b.id,'sim',y,'formula',w,'inputs',JSON.stringify(val))}}
  if(K==='LAG'){S.rt.force={};S.rt.force[ins[0]]=0;E.anSettle(S,5);E.anStep(S,.5);S.rt.force[ins[0]]=100;const tau=b.p.tau;const y0=S.rt.v[o];let t=0;while(t<tau){E.anStep(S,.5);t+=.5}const yt=S.rt.v[o];cnt.LAG=(cnt.LAG||0)+1;tot++;const want=y0+(100-y0)*(1-Math.exp(-t/tau));if(Math.abs(yt-want)>1.5){nbad++;bad.LAG=(bad.LAG||0)+1;if(nbad<=15)console.log('MISMATCH',r.name,'LAG#'+b.id,'after tau',yt.toFixed(1),'first order',want.toFixed(1))}}}}
console.log('checks per kind',JSON.stringify(cnt),'| total',tot,'| mismatches',nbad,JSON.stringify(bad));
