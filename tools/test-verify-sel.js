/* Group C: SIG.AB / average-select circuit cases 1-5 on every SEL block that has SIG.AB flags.  usage: node tools/test-verify-sel.js file.html [out-prefix]
   Primary = first (left) input, secondary = second input. Expected = the rule of docs/FUNCTIONALITY.md "AVERAGE SELECT CIRCUIT" (average of the healthy inputs, one healthy = that one, all bad = hold last; zero is a valid value). */
const L=require('./lib.js'),write=require('./lib-records.js');
const {E,rows}=L.load(process.argv[2]);const rec=[];let nSel=0,nNoFlags=0;
for(const sh of rows){const S=L.build(E,sh);
 for(const b of S.blk.filter(q=>q.k==='SEL')){nSel++;if(!b.sgi||b.i.length<2||b.sgi.slice(0,b.i.length).some(x=>x==null)){nNoFlags++;rec.push({sheet:sh.name,block:'SEL#'+b.id,input:'(no cases)',expected:'SIG.AB flag per input',actual:'inputs '+b.i.length+', flags '+JSON.stringify(b.sgi||null),source:'drawing',status:'NOT TESTED',evidence:'a SIG.AB flag is not tied to every input of this SEL by the reader'});continue}
  const run=(pv,sv,pb,sb)=>{const rt=S.rt;rt.st[b.sgi[0]].val=pb;rt.st[b.sgi[1]].val=sb;rt.force[b.i[0]]=pv;rt.force[b.i[1]]=sv;for(let q=2;q<b.i.length;q++){rt.st[b.sgi[q]].val=1;rt.force[b.i[q]]=999}/* further inputs: marked bad, so only primary / secondary count */for(let k=0;k<4;k++)E.anStep(S,0);return rt.v[b.o[0]]};
  const mode=b.mopts.join('/');b.p.mode='AVG';const reset=()=>{for(const n of [b.i[0],b.i[1]])delete S.rt.force[n]};
  const pv=40,sv=60,zero=0;const cases=[
   [1,'Primary Normal / Secondary Normal',[pv,sv,0,0],(pv+sv)/2,'average of both healthy'],
   [2,'Primary Bad Signal / Secondary Normal',[pv,sv,1,0],sv,'bad input excluded, secondary used'],
   [3,'Primary Normal / Secondary Bad Signal',[pv,sv,0,1],pv,'bad input excluded, primary used'],
   [5,'Primary Normal = 0 / Secondary Normal nonzero',[zero,sv,0,0],(zero+sv)/2,'zero is a valid measurement, not bad']];
  for(const [n,nm,a,exp,why] of cases){const act=run(...a);rec.push({sheet:sh.name,block:'SEL#'+b.id+' (modes '+mode+')',input:'SIG.AB case '+n+': '+nm+' (P='+a[0]+', S='+a[1]+')',expected:exp+' ('+why+')',actual:String(act),source:'docs/FUNCTIONALITY.md AVERAGE SELECT CIRCUIT (average of healthy inputs)',status:Math.abs(act-exp)<1e-9?'PASS':'FAIL',evidence:'force inputs net '+b.i[0]+','+b.i[1]+'; flags st['+b.sgi[0]+'],st['+b.sgi[1]+'] -> output net '+b.o[0]})}
  /* case 4: both bad - the drawing does not say; the engine holds the last value */
  run(pv,sv,0,0);const last=run(pv+5,sv+5,1,1);rec.push({sheet:sh.name,block:'SEL#'+b.id,input:'SIG.AB case 4: both Bad Signal (inputs moved 40/60 -> 45/65)',expected:'defined failure response; engine rule = hold last good value ('+((pv+sv)/2)+')',actual:String(last),source:'docs/BLOCK-LIBRARY.md SEL (all bad = hold last); the drawing text does not define it',status:Math.abs(last-(pv+sv)/2)<1e-9?'NEEDS REVIEW':'FAIL',evidence:'behaviour is defined and deterministic, but its source is the app spec, not the drawing -> user to confirm'});
  reset();b.p.mode='AVG'; for(const k of [0,1])S.rt.st[b.sgi[k]].val=0;
 }}
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-SEL','SIG.AB / average-select verification - '+process.argv[2].split('/').pop(),rec,'SEL blocks found: '+nSel+'; without two SIG.AB flags (NOT TESTED): '+nNoFlags+'.');console.log(cnt,'SEL',nSel,'untested',nNoFlags);
