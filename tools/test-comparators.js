/* every comparator (HC LC HLC CMPK HS LS) must switch when its input crosses its set point; DCMP both outputs. Input net is forced, so no upstream range is needed. usage: node tools/test-comparators.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let ok=0,bad=[],skip=0;
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 const run=(n,val)=>{S.rt.force[n]=val;E.anSettle(S,6)};
 for(const b of S.blk){if(!['HC','LC','HLC','CMPK','DCMP'].includes(b.k))continue;const P=b.p||{};const x=b.i&&b.i[0];if(x==null||!S.nets[x]){skip++;continue}
  const outs=b.k==='DCMP'?(b.dc||[]).map(d=>({n:d.n,op:d.op,sp:d.sp,inc:d.inc,neg:d.neg})):[{n:b.o[0],op:P.op,sp:P.sp,inc:P.inc,ref:P.ref}];
  if(!outs.length){bad.push(r.name+' '+b.k+'#'+b.id+' no set point read ('+JSON.stringify(b.txt||[]).slice(0,40)+')');continue}
  for(const o of outs){const refOK=o.ref>=0;let sp=o.sp;if(refOK){if(S.kn&&S.kn[o.ref]!=null)sp=S.kn[o.ref];else{S.rt.force[o.ref]=50;sp=50}}
   const d=Math.max(1,Math.abs(sp)*.1);const hi=sp+d,lo=sp-d;let lowOut,highOut;
   run(x,o.neg?-lo:lo);lowOut=S.rt.v[o.n]>.5?1:0;run(x,o.neg?-hi:hi);highOut=S.rt.v[o.n]>.5?1:0;delete S.rt.force[x];if(refOK)delete S.rt.force[o.ref];
   const want=o.op==='>'?[0,1]:[1,0];if(lowOut===want[0]&&highOut===want[1])ok++;else bad.push(r.name+' '+b.k+'#'+b.id+' '+o.op+' '+sp+' -> below='+lowOut+' above='+highOut+(refOK?' (set point from a wire)':''))}}}
console.log('comparator outputs that switch correctly:',ok,' problems:',bad.length,' skipped:',skip);bad.forEach(x=>console.log('  '+x));
