/* ABC-002 minimum air flow: editable T/H setting, default 400 T/H = drawing 32 %, change reaches the downstream calculation.  usage: node tools/test-verify-minair.js file.html [out-prefix] */
const L=require('./lib.js'),write=require('./lib-records.js');
const {E,rows}=L.load(process.argv[2]);const S=L.build(E,rows.find(r=>r.name==='ABC-002'));const rt=S.rt,rec=[];
const c=S.blk.find(b=>b.k==='CONST'&&b.p.mt),base={sheet:'ABC-002',block:c?'CONST#'+c.id:'(not found)'};
const hs=c&&S.blk.find(b=>b.k==='HS'&&(b.i||[]).includes(c.o[0])),sum=hs&&S.blk.find(b=>b.k==='SUM'&&(b.i||[]).includes(hs.o[0]));
const run=()=>{for(let k=0;k<6;k++)E.anStep(S,0)};
if(!c||!hs){rec.push({...base,input:'-',expected:'min air flow constant found',actual:'not found',source:'drawing',status:'FAIL',evidence:''})}
else{
 const other=hs.i.find(n=>n!==c.o[0]);rt.force[other]=0;run();
 const chk=(nm,th,k,exp,src)=>{c.p.th=th;if(k!=null)c.p.k=k;run();const a=rt.v[c.o[0]],h=rt.v[hs.o[0]];rec.push({...base,input:nm,expected:'constant '+exp+' %, high selector output '+exp+' % (other input 0)',actual:'constant '+a+', HS '+h,source:src,status:Math.abs(a-exp)<1e-9&&Math.abs(h-exp)<1e-9?'PASS':'FAIL',evidence:'CONST out net '+c.o[0]+', HS out net '+hs.o[0]})};
 rec.push({...base,input:'initial state',expected:'default 400 T/H, original drawing constant 32 % kept',actual:'th='+c.p.th+' orig='+c.p.orig+' val='+c.p.val,source:'user decision 2026-10-10',status:c.p.th===400&&c.p.orig===32&&c.p.val===32?'PASS':'FAIL',evidence:'block parameters'});
 chk('default 400 T/H',400,null,32,'400 T/H x 0.08 = 32 % = drawing');
 const sumBefore=sum?rt.v[sum.o[0]]:null;
 chk('edited to 500 T/H',500,null,40,'500 x 0.08');
 const sumAfter=sum?rt.v[sum.o[0]]:null;
 rec.push({...base,input:'downstream SUM after the change 400 -> 500 T/H (other inputs unchanged)',expected:'SUM output changes by the + 8 % step',actual:sumBefore+' -> '+sumAfter,source:'drawn wiring HS -> SUM',status:sum&&Math.abs((sumAfter-sumBefore)-8)<1e-9?'PASS':(sum?'NEEDS REVIEW':'NOT TESTED'),evidence:'sign of the SUM leg decides: delta shown'});
 chk('edited to 0 T/H',0,null,0,'0 x 0.08');
 chk('edited k to 0.1 %/T/H at 400 T/H',400,0.1,40,'400 x 0.1');
 c.p.k=c.p.orig/400;c.p.th=400;rt.force[other]=60;run();rec.push({...base,input:'selector input 60 % > constant 32 %',expected:'HS passes 60',actual:String(rt.v[hs.o[0]]),source:'HIGH selector',status:rt.v[hs.o[0]]===60?'PASS':'FAIL',evidence:'other input forced 60'});
 rec.push({...base,input:'conversion 0.08 % per T/H',expected:'conversion written on the drawing',actual:'not on the drawing; chosen so that the default equals 32 %',source:'drawing SCALE CONVERT 35 / 1115 = 0.0314 % per T/H differs',status:'NEEDS REVIEW',evidence:'user decision: default 400 T/H; relation to the % signal to be confirmed'})}
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-MINAIR','ABC-002 minimum air flow - '+process.argv[2].split('/').pop(),rec,'');console.log(cnt);
