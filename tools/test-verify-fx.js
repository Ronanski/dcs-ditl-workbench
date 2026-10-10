/* Group A verification (LINEAR FX) with reusable test records.  usage: node tools/test-verify-fx.js file.html [out-prefix]
   For EVERY FX block of every sheet: low / midpoint / high of the table range, one point below and one above the table domain.
   Expected value = independent interpolation of the ORIGINAL points of the table (tbl.o0, i.e. the LINEAR.xls points), source = table key + file.
   Record: sheet, tag/block, input conditions, expected value/unit, actual value/unit, source of expected, evidence, status, correction, retest.
   PASS = equal to expected (1e-6); FAIL = differs; NEEDS REVIEW = no table / ambiguous units / range of the drawing differs from the table; NOT TESTED = no evidence. */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path'),fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const rec=await p.evaluate(()=>{
 const interp=(pts,x)=>{const o=[];pts.forEach(q=>{const l=o[o.length-1];if(!l||l[0]!==q[0]||l[1]!==q[1])o.push([q[0],q[1]])});o.sort((a,c)=>a[0]-c[0]);if(x<=o[0][0])return o[0][1];for(let i=1;i<o.length;i++)if(x<=o[i][0]){const a=o[i-1],c=o[i];return a[1]+(c[1]-a[1])*(x-a[0])/((c[0]-a[0])||1)}return o[o.length-1][1]};
 const R=[];
 for(const sh of AN.sheets){AN.go(AN.sheets.indexOf(sh));const S=AN.ensure(sh);
  for(const x of S.blk){if(x.k!=='FX')continue;const t=x.p.tbl,tag=sh.name+' FX#'+x.id+' '+(x.p.ln||'(no LN)');
   const base={sheet:sh.name,block:'FX#'+x.id,ln:x.p.ln||'',table:t?t.key:null,xu:t?(t.xu||'').trim():null,yu:t?(t.yu||'').trim():null,source:t?('LINEAR.xls '+t.key+(t.src?' / '+t.src:'')):'none'};
   const inN=x.i[0],outN=x.o[0];
   if(!t||!(t.o0||t.pts)){if(sh.name==='ABC-000')continue;/* legend sheet: excluded (user 2026-10-10) */S.rt.force[inN]=50;for(let k=0;k<8;k++)AN.settle();const st=(S.rt.st[x.id]||{}).fxs;delete S.rt.force[inN];
     R.push({...base,input:'50 (any)',expected:'warning + NEEDS REVIEW, no silent pass-through',actual:'status='+st,status:st==='NOTABLE'?'NEEDS REVIEW':'FAIL',evidence:'S.rt.st['+x.id+'].fxs='+st,correction:'v1.20.8: anFXs flags NOTABLE; panel + Health show NEEDS REVIEW',retest:'v1.20.8 run'});continue}
   const pts=t.o0||t.pts,xs=pts.map(q=>q[0]),lo=Math.min(...xs),hi=Math.max(...xs),xr=t.xr||[lo,hi];
   const cases=[['low (range start)',xr[0]],['midpoint',(xr[0]+xr[1])/2],['high (range end)',xr[1]],['below table domain',lo-(hi-lo)*0.1],['above table domain',hi+(hi-lo)*0.1]];
   const unitBad=!/\S/.test(base.xu.replace(/RANGE/i,'').replace(/[()]/g,''))||!/\S/.test(base.yu.replace(/RANGE/i,'').replace(/[()]/g,''));
   for(const [nm,xv] of cases){S.rt.force[inN]=xv;for(let k=0;k<8;k++)AN.settle();const act=S.rt.v[outN],st=(S.rt.st[x.id]||{}).fxs;delete S.rt.force[inN];
     const outside=xv<lo||xv>hi,exp=outside?(xv<lo?interp(pts,lo):interp(pts,hi)):interp(pts,xv);
     let status,note='';
     if(outside){status=(st==='OUT'&&Math.abs(act-exp)<1e-6)?'PASS':'FAIL';note='out of table domain: end value held AND flagged OUT (NEEDS REVIEW in the panel)'}
     else status=Math.abs(act-exp)<1e-6*Math.max(1,Math.abs(exp))?'PASS':'FAIL';
     if(status==='PASS'&&unitBad&&!outside){note='numbers match the table; the unit text of the LINEAR header is empty (informational: the ranges and the description are in the table; user 2026-10-10)'}
     R.push({...base,input:nm+': '+xv+' '+base.xu,expected:exp+' '+base.yu+(note?' ('+note+')':''),actual:act+' '+base.yu+' st='+st,status,evidence:'force net '+inN+' -> read net '+outN,correction:'',retest:'v1.20.8 run'})}
   /* range of the transmitter that feeds the block (only when the FX input is a transmitter, possibly through LAG / RATE / LINK) against the x range of the table */
   {const up=(n,d,pa)=>{const q=(S.drv[n]||[])[0];if(!q)return null;const bl=S.blk.find(z=>z.id===q.id);if(!bl)return null;if(bl.k==='AI')return{bl,pa:pa.concat('AI')};if(d>6||!['LAG','RATE','RAMPB','LINK','ABS'].includes(bl.k))return null;return up(bl.i[0],d+1,pa.concat(bl.k))};
    const u=up(inN,0,[]);
    if(u&&u.bl.rng){const r=u.bl.rng,ok=Math.abs(r.lo-xr[0])<1e-9&&Math.abs(r.hi-xr[1])<1e-9;
     R.push({...base,input:'transmitter range '+r.lo+' ~ '+r.hi+' (path '+u.pa.join('>')+')',expected:'= table x range '+xr[0]+' ~ '+xr[1]+' '+base.xu,actual:r.lo+' ~ '+r.hi,status:ok?'PASS':'NEEDS REVIEW',evidence:'AI block #'+u.bl.id+' rng vs '+base.table+' xr',correction:'',retest:'v1.20.8 run'});
     if(u.pa.length===1){const rt=S.rt,keep=rt.ramp;rt.ramp=0;const st=rt.st[u.bl.id],old=st.val;
      for(const [nm,v] of [['transmitter at low',r.lo],['transmitter at mid',(r.lo+r.hi)/2],['transmitter at high',r.hi]]){st.val=v;for(let k=0;k<10;k++)AN.settle();const act=rt.v[outN];const exp=interp(pts,v);
       R.push({...base,input:nm+': '+v+' (AI #'+u.bl.id+' -> FX, drawn wiring)',expected:exp+' '+base.yu,actual:act+' '+base.yu,status:Math.abs(act-exp)<1e-6*Math.max(1,Math.abs(exp))?'PASS':'FAIL',evidence:'field side AI -> FX output net '+outN,correction:'',retest:'v1.20.8 run'})}
      st.val=old;rt.ramp=keep;for(let k=0;k<10;k++)AN.settle()}}}
  }}
 return R});
const cnt={};rec.forEach(r=>cnt[r.status]=(cnt[r.status]||0)+1);
const pre=process.argv[3]||'docs/TEST-RESULTS-FX';fs.writeFileSync(pre+'.json',JSON.stringify(rec,null,1));
const md=['# LINEAR FX verification - '+path.basename(process.argv[2]),'','Counts: '+JSON.stringify(cnt),'','Generated by `node tools/test-verify-fx.js`. Expected = independent interpolation of the original LINEAR.xls points; PASS only when the engine equals it.','','| sheet | block | LN / table | input | expected | actual | status | evidence |','|---|---|---|---|---|---|---|---|'];
rec.filter(r=>r.status!=='PASS').forEach(r=>md.push(`| ${r.sheet} | ${r.block} | ${r.ln} ${r.table||''} | ${r.input} | ${r.expected} | ${r.actual} | ${r.status} | ${r.evidence} |`));
md.push('','PASS records (not listed above): '+(cnt.PASS||0)+' - all in '+pre+'.json');fs.writeFileSync(pre+'.md',md.join('\n'));
console.log(cnt,'records',rec.length,'errs',errs);await b.close()})();
