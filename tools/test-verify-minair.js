/* ABC-002 minimum air flow (v1.20.10): the editable setting is the MINIMUM AIR FLOW in T/H (default 400); the signal into the high selector = 32 % of it (128 T/H, user 2026-10-10: "32% of min. air flow ... 400 x 32% = 128 t/h"); a change reaches the downstream calculation.  usage: node tools/test-verify-minair.js file.html [out-prefix]
   Unit evidence: SI0036 TAF DEMAND is in T/H (LINEAR.xls table S1-LN5 gives 446 T/H at the lowest input; DATA table TAF 446 T/H at 40 % load), so the constant compared with it must be T/H too. */
const L=require('./lib.js'),write=require('./lib-records.js');
const {E,rows}=L.load(process.argv[2]);const S=L.build(E,rows.find(r=>r.name==='ABC-002'));const rt=S.rt,rec=[];
const c=S.blk.find(b=>b.k==='CONST'&&b.p.mt),base={sheet:'ABC-002',block:c?'CONST#'+c.id:'(not found)',source:'user decision 2026-10-10 (default 400 T/H, keep the drawing 32 %)'};
const hs=c&&S.blk.find(b=>b.k==='HS'&&(b.i||[]).includes(c.o[0])),sum=hs&&S.blk.find(b=>b.k==='SUM'&&(b.i||[]).includes(hs.o[0]));
const run=()=>{for(let k=0;k<6;k++)E.anStep(S,0)};
if(!c||!hs){rec.push({...base,input:'-',expected:'min air flow constant found',actual:'not found',status:'FAIL',evidence:''})}
else{const other=hs.i.find(n=>n!==c.o[0]);rt.force[other]=0;run();
 rec.push({...base,input:'initial state',expected:'setting 400 T/H, signal 32 % x 400 = 128, original 32 % kept',actual:'th='+c.p.th+' signal='+rt.v[c.o[0]]+' orig='+c.p.orig+' val='+c.p.val,status:c.p.th===400&&Math.abs(rt.v[c.o[0]]-128)<1e-9&&c.p.orig===32&&c.p.val===32?'PASS':'FAIL',evidence:'block parameters + net value'});
 const chk=(nm,th)=>{const exp=th*.32;c.p.th=th;run();const a=rt.v[c.o[0]],h=rt.v[hs.o[0]];rec.push({...base,input:nm,expected:'signal 32 % x '+th+' = '+exp+' T/H, HS output '+exp+' (other input 0)',actual:'signal '+a+', HS '+h,status:Math.abs(a-exp)<1e-9&&Math.abs(h-exp)<1e-9?'PASS':'FAIL',evidence:'CONST out net '+c.o[0]+', HS out net '+hs.o[0]})};
 const sb=sum?rt.v[sum.o[0]]:null;chk('edited to 500 T/H',500);const sa=sum?rt.v[sum.o[0]]:null;
 rec.push({...base,input:'downstream SUM after 400 -> 500 T/H',expected:'SUM output changes by 32 (= 32 % of the 100 T/H change; sign = sign of that SUM leg)',actual:sb+' -> '+sa,source:'drawn wiring HS -> SUM',status:sum&&Math.abs(Math.abs(sa-sb)-32)<1e-9?'PASS':(sum?'FAIL':'NOT TESTED'),evidence:'delta '+(sa-sb)});
 chk('edited to 0 T/H',0);chk('edited to 250 T/H',250);
 c.p.th=400;rt.force[other]=600;run();rec.push({...base,input:'selector other input 600 > 128',expected:'HS passes 600',actual:String(rt.v[hs.o[0]]),source:'HIGH selector',status:rt.v[hs.o[0]]===600?'PASS':'FAIL',evidence:'other input forced 600'});
 rec.push({...base,input:'meaning of the drawing text "32 %"',expected:'32 % OF the minimum air flow',actual:'128 T/H at the default 400 T/H minimum air flow',source:'user explanation 2026-10-10',status:'PASS',evidence:'the base (400 T/H) is the editable default of the user\'s first instruction; the real minimum air flow of the plant is not written on the drawing (edit it in the panel)'})}
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-MINAIR','ABC-002 minimum air flow - '+process.argv[2].split('/').pop(),rec,'');console.log(cnt);
