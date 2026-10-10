/* Group B: NOT gate truth table on every NOT gate, through the engine with the input net forced (traced input net given in the record).  usage: node tools/test-verify-not.js file.html [out-prefix] */
const L=require('./lib.js'),write=require('./lib-records.js');
const {E,rows}=L.load(process.argv[2]);const rec=[];
for(const sh of rows){const S=L.build(E,sh);for(const b of S.blk.filter(q=>q.k==='NOT')){
 const base={sheet:sh.name,block:'NOT#'+b.id,source:'truth table of NOT (docs/FUNCTIONALITY.md)'};
 if(b.i.length!==1||!b.o.length){rec.push({...base,input:'-',expected:'1 input, 1 output',actual:'inputs '+b.i.length+' outputs '+b.o.length,status:'NEEDS REVIEW',evidence:'unresolved pins: not verified'});continue}
 for(const [a,e] of [[0,1],[1,0]]){S.rt.force[b.i[0]]=a;for(let k=0;k<3;k++)E.anStep(S,0);const act=S.rt.v[b.o[0]];delete S.rt.force[b.i[0]];
  rec.push({...base,input:'in='+a,expected:String(e),actual:String(act),status:act===e?'PASS':'FAIL',evidence:'force net '+b.i[0]+' -> read net '+b.o[0]})}}}
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-NOT','NOT gate truth table - '+process.argv[2].split('/').pop(),rec,'Every NOT gate of every sheet, both input states.');console.log(cnt);
