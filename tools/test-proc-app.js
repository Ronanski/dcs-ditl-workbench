/* Closed loops IN THE APP (circles / links between sheets live, every sheet of the linked set steps together): the loops that use the cross-sheet plant (remote), the loops whose PV is an input wire, the calculated PV (pin) and a few transmitter loops must bring the PV to the SV; for a remote loop the transmitter of the SOURCE sheet moves and every sheet that reads it sees the same value. usage: node tools/test-proc-app.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;const out={rows:[]};
 /* visit every sheet once so that the cross-sheet plant is resolved */
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;AN.go(AN.sheets.indexOf(sh));await new Promise(r=>setTimeout(r,60));AN.settle()}
 const want=[];for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;for(const b of sh.S.procs||[]){const m=b.proc.mode;if(m==='shared')continue;want.push({sh,b,m})}}
 const pick=[...want.filter(x=>x.m!=='transmitter'),...want.filter(x=>x.m==='transmitter').filter((x,i)=>i%6===0)];
 for(const {sh,b,m} of pick){AN.go(AN.sheets.indexOf(sh));await new Promise(r=>setTimeout(r,40));const S=sh.S,pr=b.proc,pn=AN.anPins(S,b),span=b.p.span>0?b.p.span:100,lo=b.p.rlo!=null?b.p.rlo:0;
  const reach=n=>{const seen=new Set(),q=b.o.slice();while(q.length){const x=q.pop();if(x===n)return true;if(seen.has(x))continue;seen.add(x);for(const c of S.cns[x]||[])for(const y of c.o||[])q.push(y);for(const[dd,s2]of S.link||[])if(s2===x)q.push(dd)}return false};
  for(const t of S.blk)if(t.k==='AMT'||t.k==='SW'){if(reach(t.a))S.rt.st[t.id].fm='A';else if(reach(t.b))S.rt.st[t.id].fm='B'}
  S.rt.force[pn.sv]=lo+.4*span;pr.on=true;for(let i=0;i<5;i++)AN.stepSet(sh,0);for(let i=0;i<300;i++)AN.stepSet(sh,.5);S.rt.force[pn.sv]=lo+.55*span;
  const N=Math.round(Math.max(1200,6*(b.p.ti||0))/.5);let mx=0;for(let i=0;i<N;i++){AN.stepSet(sh,.5)}
  const dev=Math.abs(S.rt.v[pn.sv]-S.rt.v[pn.pv])/span,R=pr.remote;const o={id:sh.name+' '+((b.txt||[])[1])+' ['+m+']',dev:+(dev*100).toFixed(1)};
  if(R){const FS=R.S,a=FS.blk.find(x=>x.id===R.ai[0]);o.srcAI=a?FS.rt.st[a.id].val:null;o.srcPin=FS.rt.v[R.pin];o.localPin=S.rt.v[pr.pv]}
  delete S.rt.force[pn.sv];out.rows.push(o)}
 return out});
const bad=r.rows.filter(x=>x.dev>3);console.log('loops tried in the app:',r.rows.length);r.rows.forEach(x=>console.log('  '+x.id+' |SV-PV| '+x.dev+' %'+(x.srcPin!=null?' | source sheet value '+(+x.srcPin).toFixed(2)+' = local '+(+x.localPin).toFixed(2):'')));
ck('every loop reaches its SV in the app (|SV-PV| < 3 % of the span)',bad.length===0,bad.map(x=>x.id+' '+x.dev).join('; '));
ck('remote loops: the source sheet and this sheet show the same PV',r.rows.filter(x=>x.srcPin!=null).every(x=>Math.abs(x.srcPin-x.localPin)<1e-6*Math.max(1,Math.abs(x.srcPin))||Math.abs(x.srcPin-x.localPin)<.05));
ck('no page errors',errs.length===0,errs.slice(0,3).join('|'));console.log(fail?fail+' FAIL':'ALL PASS');await b.close();process.exit(fail?1:0)})();
