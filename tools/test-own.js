/* Who controls, FORCE / SIM in the HMI, one state everywhere (user, 2026-10-08), tested with REAL mouse / keyboard on ABC-017:
   1. the up / down arrow of a number box applies the value (engine and Trend follow, no Enter needed)
   2. HMI open: the sheet panel controls are greyed (cannot write); HMI closed: they work
   3. HMI faceplate / widgets: F (SIM / FORCE) with a real click holds a PV (analog) and a digital point in RUN; the SV moved by the HMI slider does not change the forced PV; F again releases
   4. HMI, panel, Trend and the engine show the same SV / PV / MV
   usage: node tools/test-own.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const E=(f,a)=>p.evaluate(f,a);
await E(async()=>{await AN.data;AN.go(AN.sheets.findIndex(s=>s.name==='ABC-017'))});await p.waitForTimeout(500);
await E(()=>{if(AN.view)document.querySelector('button[title^="View mode"]').click()});
/* 1. arrows */
const sv=await E(()=>{const sh=AN.cs(),S=sh.S,b=S.blk.find(x=>x.k==='PID'),pn=AN.anPins(S,b);AN.sel={net:pn.sv};AN.selBox();AN.panelUpd(true);return{n:pn.sv}});await p.waitForTimeout(400);
await p.click('#anbar button:has-text("Run")');await p.waitForTimeout(500);
const inp=await p.$('#ansel input[type=number], #anp input[placeholder=value], #anp .fc input[type=number]');
if(inp){await inp.focus();await inp.fill('10');const ok=await p.$('#anp .fc button:has-text("✓")');if(ok)await ok.click();await p.waitForTimeout(300);const v0=await E(n=>AN.cs().S.rt.ext[n],sv.n);await inp.focus();await p.keyboard.press('ArrowUp');await p.waitForTimeout(400);const v1=await E(n=>AN.cs().S.rt.ext[n],sv.n);await p.keyboard.press('ArrowUp');await p.waitForTimeout(400);const v2=await E(n=>AN.cs().S.rt.ext[n],sv.n);
 ck('ArrowUp in a number box applies the value (no Enter / check button)',v1>v0&&v2>v1,JSON.stringify([v0,v1,v2]))}else ck('number box found for the SV',false);
/* 2. ownership */
const own0=await E(()=>{const e=document.querySelector('#anp .wr');return{has:!!e,pe:e?getComputedStyle(e).pointerEvents:null}});
ck('HMI closed: the panel controls work',own0.has&&own0.pe!=='none',JSON.stringify(own0));
await E(()=>{AN.hmiOpen('float');AN.hmiAuto()});await p.waitForTimeout(700);
const own1=await E(()=>{const e=document.querySelector('#anp .wr');return{pe:e?getComputedStyle(e).pointerEvents:null,banner:!!document.querySelector('#anp .own')}});
ck('HMI open: the panel controls are greyed (pointer-events none) and a banner says who controls',own1.pe==='none'&&own1.banner,JSON.stringify(own1));
/* 3. F in the HMI with real clicks */
const box=async(label)=>E(l=>{const pg=AN.hmi.pages[AN.hmi.cur];const w=pg.widgets.find(x=>x.label&&x.label.indexOf(l)>=0&&x.type!=='label');if(!w)return null;const g=document.querySelector('#hmicv g[data-id="'+w.id+'"]');const f=g.querySelector('rect[width="27"]').getBoundingClientRect(),c=g.getBoundingClientRect();return{id:w.id,fx:f.x+f.width/2,fy:f.y+f.height/2,x:c.x,y:c.y,w:c.width,h:c.height}},label);
const pvw=await E(()=>{const pg=AN.hmi.pages[AN.hmi.cur];const w=pg.widgets.find(x=>x.type==='num'&&/^PV|AI0533|PICSB1052|simulat/i.test(x.label||''))||pg.widgets.find(x=>x.type==='num');return w?{id:w.id,label:w.label,addr:w.addr,nn:w.nn}:null});
ck('the Auto page has a plant-value widget for the PV',!!pvw,JSON.stringify(pvw));
if(pvw){const g=async()=>E(id=>{const w=AN.hmi.pages[AN.hmi.cur].widgets.find(x=>x.id===id),g=document.querySelector('#hmicv g[data-id="'+id+'"]'),f=g.querySelector('rect[width="27"]').getBoundingClientRect();const st=AN.hmiState(w);return{fx:f.x+f.width/2,fy:f.y+f.height/2,how:st&&st.how,v:st&&st.S.rt.v[st.n],n:st&&st.n,F:st&&st.S.rt.force[st.n]}},pvw.id);
 let s0=await g();ck('before F: the PV is read only (plant / computed)',s0.how==='plant'||s0.how==='computed',JSON.stringify(s0));
 await p.mouse.click(s0.fx,s0.fy);await p.waitForTimeout(500);let s1=await g();ck('real click on F holds the PV (forced / simulated) in RUN',s1.how==='forced'&&s1.F!==undefined,JSON.stringify(s1));
 /* move the SV with the HMI slider; the forced PV must not move */
 const sl=await E(()=>{const pg=AN.hmi.pages[AN.hmi.cur];const w=pg.widgets.find(x=>x.type==='slider');const g=document.querySelector('#hmicv g[data-id="'+w.id+'"]'),r=g.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}});
 const held=s1.v;await p.mouse.click(sl.x+sl.w*.75,sl.y+sl.h*.6);await p.waitForTimeout(3000);let s2=await g();ck('SV moved from the HMI: the forced PV does not change',Math.abs(s2.v-held)<1e-9,JSON.stringify([held,s2.v]));
 await p.mouse.click(s2.fx,s2.fy);await p.waitForTimeout(800);let s3=await g();ck('F again releases the PV',s3.how!=='forced'&&s3.F===undefined,JSON.stringify(s3));}
/* digital point: a lamp of the page, forced from its F */
const dg=await E(()=>{const pg=AN.hmi.pages[AN.hmi.cur];const w=pg.widgets.find(x=>x.type==='lamp');if(!w)return null;return{id:w.id}});
if(dg){const gd=async()=>E(id=>{const w=AN.hmi.pages[AN.hmi.cur].widgets.find(x=>x.id===id),g=document.querySelector('#hmicv g[data-id="'+id+'"]'),f=g.querySelector('rect[width="27"]').getBoundingClientRect();const st=AN.hmiState(w);return{fx:f.x+f.width/2,fy:f.y+f.height/2,how:st.how,F:st.S.rt.force[st.n],v:st.S.rt.v[st.n]}},dg.id);
 const d0=await gd();await p.mouse.click(d0.fx,d0.fy);await p.waitForTimeout(500);const d1=await gd();ck('digital point: F holds it (forced / simulated)',d1.how==='forced',JSON.stringify([d0,d1]));await p.mouse.click(d1.fx,d1.fy);await p.waitForTimeout(500);const d2=await gd();ck('digital point released',d2.how!=='forced',JSON.stringify(d2))}
/* 4. same numbers everywhere */
await E(()=>{AN.hmiClose()});await p.waitForTimeout(500);
const sync=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const sh=AN.cs(),S=sh.S,b=S.blk.find(x=>x.k==='PID'),pn=AN.anPins(S,b);AN.sel={blk:b};AN.selBox();AN.panelUpd(true);await w(1500);
 const ser=AN.trSeries(sh),sk=ser.find(s=>/^SV/.test(s.name)).key,pk=ser.find(s=>/^PV/.test(s.name)).key,mk=ser.find(s=>/^MV/.test(s.name)).key;const last=k=>{const a=sh._tw.get(k);return a?a[a.length-1]:null};
 return{sv:[S.rt.v[pn.sv],last(sk)],pv:[S.rt.v[pn.pv],last(pk)],mv:[S.rt.v[b.o[0]],last(mk)],names:ser.slice(0,3).map(s=>s.name)}});
const near=(a,b)=>a!=null&&b!=null&&Math.abs(a-b)<=1e-6+.02*Math.max(1,Math.abs(a));
ck('Trend SV / PV / MV = the engine values the controller sees',near(sync.sv[0],sync.sv[1])&&near(sync.pv[0],sync.pv[1])&&near(sync.mv[0],sync.mv[1]),JSON.stringify(sync));
ck('no page errors',errs.length===0,errs.slice(0,3).join('|'));console.log(fail?fail+' FAIL':'ALL PASS');await b.close();process.exit(fail?1:0)})();
