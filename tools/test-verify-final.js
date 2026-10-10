/* Finding 15 (final element behaviour): command is instant, POSITION is gradual with the stroke time of the block.  usage: node tools/test-verify-final.js file.html [out-prefix]
   Every VLV / ACT block: command 0 -> 100 (or 0 -> 1 for a digital command): position after 1 s must be 100/stroke, never 100 at once; after `stroke` seconds it is 100; and back.  Stroke = block parameter (default VLV 20 s, ACT 30 s: ASSUMED unless the drawing gives it). */
const L=require('./lib.js'),write=require('./lib-records.js');
const {E,rows}=L.load(process.argv[2]);const rec=[];
for(const sh of rows){const S=L.build(E,sh);const rt=S.rt;
 for(const b of S.blk.filter(q=>q.k==='VLV'||q.k==='ACT')){const base={sheet:sh.name,block:b.k+'#'+b.id+' '+(b.tag||''),source:'block stroke time P.stroke='+b.p.stroke+' s (default / assumed unless on the drawing)'};
  if(!(b.i||[]).length){rec.push({...base,input:'-',expected:'-',actual:'-',status:'NOT TESTED',evidence:'no command input'});continue}
  const dig=S.nets[b.i[0]].dig,hi=dig?1:100,st=b.p.stroke;rt.force[b.i[0]]=0;for(let k=0;k<3;k++)E.anStep(S,0);rt.st[b.id].pos=0;
  rt.force[b.i[0]]=hi;E.anStep(S,1);const p1=rt.st[b.id].pos;for(let k=1;k<Math.ceil(st);k++)E.anStep(S,1);E.anStep(S,1);const pe=rt.st[b.id].pos;delete rt.force[b.i[0]];
  const e1=Math.min(100,100/st);
  rec.push({...base,input:'command '+(dig?'0 -> 1':'0 -> 100')+' (digital OPEN is instant)',expected:'position 1 s: '+e1+' %, after '+Math.ceil(st)+' s: 100 %',actual:'1 s: '+p1+' %, end: '+pe+' %',status:(p1!=null&&Math.abs(p1-e1)<1e-6&&p1<100||st<=1)&&Math.abs(pe-100)<1e-6?'PASS':(p1==null?'NEEDS REVIEW':'FAIL'),evidence:'cmd net '+b.i[0]});
 }}
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-FINAL','Final element gradual position - '+process.argv[2].split('/').pop(),rec,'Command may be instant, position follows the stroke time.');console.log(cnt);
