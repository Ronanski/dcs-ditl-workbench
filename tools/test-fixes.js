/* Fixes from the user's screenshots (2026-10-08): (1) ABC-002 average select circuit of the two O2 transmitters must give the AVERAGE (4.30 and 4.60 -> 4.45, SI0048), the SIG.AB flag of a transmitter excludes it; (2) an arrow that ends in the side of another wire joins it (ABC-003E); (3) the O2 correction tables LN15 (ABC-002) and LN21 (ABC-003A..D) give a RATIO 0.8 ~ 1.2, not 80 ~ 120. usage: node tools/test-fixes.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;AN.go(AN.sheets.findIndex(s=>s.name==='ABC-002'));await new Promise(r=>setTimeout(r,500));const S=AN.cs().S;const ai=t=>S.blk.find(b=>b.k==='AI'&&b.tagAI===t),sel=S.blk.find(b=>b.k==='SEL'&&b.o.some(n=>S.lab[n]&&S.lab[n].t==='SI0048')),out=sel.o[0];
 const set=(t,v)=>{const a=ai(t);S.rt.st[a.id].val=S.rt.st[a.id].act=v};const o={};set('AI0273',4.3);set('AI0433',4.6);AN.settle();o.avg=S.rt.v[out];
 const sg=S.blk.filter(x=>x.k==='SIGAB');o.sgi=sel.sgi;const first=sg.find(x=>x.id===sel.sgi[0]);S.rt.st[first.id].val=1;AN.settle();o.flagged=S.rt.v[out];S.rt.st[first.id].val=0;AN.settle();o.back=S.rt.v[out];
 const fx=(sheet,ln)=>{AN.go(AN.sheets.findIndex(s=>s.name===sheet));const S2=AN.cs().S;const f=S2.blk.find(b=>b.k==='FX'&&b.p.ln===ln);const lo=f.p.tbl.pts||f.p.tbl.p2;return{ys:[Math.min(...lo.map(q=>q[1])),Math.max(...lo.map(q=>q[1]))],key:f.p.tbl.key}};
 AN.go(AN.sheets.findIndex(s=>s.name==='ABC-003E'));{const S3=AN.cs().S,a=S3.seg.find(q=>Math.abs(q.x1-676.3)<.2&&Math.abs(q.y1-176.2)<.2&&Math.abs(q.x2-676.3)<.2),g=S3.seg.find(q=>Math.abs(q.x1-687)<.2&&Math.abs(q.y1-176.2)<.2);o.arrowT={orange:a&&a.net,grey:g&&g.net,same:!!(a&&g&&a.net===g.net)}}
 o.ln15=fx('ABC-002','LN15');o.ln21=fx('ABC-003A','LN21');o.ln3=fx('ABC-004A','LN3');return o});
console.log(JSON.stringify(r));
ck('average select circuit of the O2 transmitters: 4.30 and 4.60 -> 4.45 (SI0048)',Math.abs(r.avg-4.45)<1e-6,r.avg);
ck('both transmitters have their SIG.AB flag paired',r.sgi.every(x=>x!=null),JSON.stringify(r.sgi));
ck('flag of the first transmitter = bad: the circuit uses the second one (4.60), then back to 4.45',Math.abs(r.flagged-4.6)<1e-6&&Math.abs(r.back-4.45)<1e-6,r.flagged+' / '+r.back);
ck('ABC-003E: the arrow that ends in the side of the grey wire joins it (one net)',r.arrowT.same,JSON.stringify(r.arrowT));
ck('LN15 output is a ratio 0.8 ~ 1.2',Math.abs(r.ln15.ys[0]-.8)<1e-6&&Math.abs(r.ln15.ys[1]-1.2)<1e-6,JSON.stringify(r.ln15));
ck('LN21 output is a ratio 0.8 ~ 1.2',Math.abs(r.ln21.ys[0]-.8)<1e-6&&Math.abs(r.ln21.ys[1]-1.2)<1e-6,JSON.stringify(r.ln21));
ck('LN3 (already a ratio) is unchanged',Math.abs(r.ln3.ys[0]-.8)<1e-6&&Math.abs(r.ln3.ys[1]-1.2)<1e-6,JSON.stringify(r.ln3));
ck('no page errors',errs.length===0,errs.slice(0,3).join('|'));console.log(fail?fail+' FAIL':'ALL PASS');await b.close();process.exit(fail?1:0)})();
