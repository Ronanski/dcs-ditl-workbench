/* Checks the engine against the SYMBOL LIST sheet (ABC-000): SET / RESET table (S R -> Q: 1 0 -> 1, 0 1 -> 0, 1 1 -> 0 = reset wins, 0 0 -> no change) and the ON delay / OFF delay / PULSE timer diagrams, for every FF and timer of the sheets.  usage: node tools/test-legend.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);
let tot=0,bad=0;const cnt={TON:[0,0],TOF:[0,0],TPS:[0,0]};
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 for(const b of S.blk){
  if(b.k==='FF'){const Sn=b.S,Rn=b.Rn;if(Sn==null||Rn==null||!S.nets[Sn]||!S.nets[Rn])continue;
   const run=(s,rr,pre)=>{S.rt.force={};for(const m of S.ext)if(S.nets[m].dig)S.rt.force[m]=0;S.rt.force[Sn]=pre[0];S.rt.force[Rn]=pre[1];E.anSettle(S,5);E.anStep(S,.1);S.rt.force[Sn]=s;S.rt.force[Rn]=rr;E.anStep(S,.1);E.anStep(S,.1);return S.rt.v[b.o[0]]>.5?1:0};
   for(const [s,rr,pre,exp] of [[1,0,[0,0],1],[0,1,[1,0],0],[1,1,[0,0],0],[1,1,[1,0],0],[0,0,[1,0],1],[0,0,[0,1],0]]){tot++;const v=run(s,rr,pre);if(v!==exp){bad++;console.log('FF MISMATCH',r.name,'FF#'+b.id,'S',s,'R',rr,'before',pre.join(''),'->',v,'legend',exp)}}}
  if(cnt[b.k]&&b.p&&b.p.sec>0&&b.i.length){const inn=b.i[0],o=b.o[0],X=b.p.sec;
   const trace=seq=>{S.rt.force={};for(const m of S.ext)if(S.nets[m].dig)S.rt.force[m]=0;S.rt.force[inn]=0;E.anSettle(S,5);for(let i=0;i<4;i++)E.anStep(S,.1);const out=[];for(const[val,dur]of seq){S.rt.force[inn]=val;for(let i=0,n=Math.round(dur/.1);i<n;i++){E.anStep(S,.1);out.push(S.rt.v[o]>.5?1:0)}}return out};
   const at=(a,t)=>a[Math.min(a.length-1,Math.round(t/.1)-1)];let ok=true;
   if(b.k==='TON'){const a=trace([[1,X+2],[0,2]]);ok=at(a,Math.max(.2,X*.5))===0&&at(a,X+.5)===1&&at(a,X+2.3)===0}
   if(b.k==='TOF'){const a=trace([[1,2],[0,X+2]]);ok=at(a,.3)===1&&at(a,2+X*.5)===1&&at(a,2+X+.5)===0}
   if(b.k==='TPS'){const a=trace([[1,X+3],[0,1]]);ok=at(a,.3)===1&&at(a,X+.5)===0}
   cnt[b.k][ok?0:1]++;if(!ok)console.log('TIMER MISMATCH',r.name,b.k+'#'+b.id,'X',X)}}}
console.log('FF legend checks (S R -> Q):',tot,'mismatch:',bad);console.log('timers [ok, mismatch]:',JSON.stringify(cnt));
