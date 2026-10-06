/* browser test of the animations: valve travel, timer count, instant analog input. usage: node test-anim.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+require('path').resolve(process.argv[2]));await p.waitForTimeout(3000);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(4000);
const setup=await p.evaluate(()=>{AN.go(AN.sheets.findIndex(s=>s.name==='ABC-050'));const sh=AN.cs(),S=sh.S;
 const vb=S.blk.find(b=>b.k==='VLV');const tm=S.blk.find(b=>b.k==='TPS'&&b.p.sec>=5);const ti=tm.i[0];
 window._t={vn:vb.pins[0].n,vid:vb.id,tid:tm.id,ti,sec:tm.p.sec};return window._t});
const read=()=>p.evaluate(()=>{const S=AN.cs().S,t=window._t;const st=S.rt.st[t.vid],ts=S.rt.st[t.tid];
 const txt=[...document.querySelectorAll('#svg text.bd')].map(e=>e.textContent).filter(x=>/▲|▼|%$/.test(x));return {pos:+(st.pos||0).toFixed(1),mv:st.mv,acc:+(ts.acc||0).toFixed(1),run:ts.run,shown:txt.slice(0,6)}});
console.log('setup',setup);
await p.evaluate(()=>{const S=AN.cs().S,t=window._t;S.rt.force[t.vn]=100;S.rt.force[t.ti]=1;AN.settle()});
for(const ms of [300,1500,3000,6000]){await p.waitForTimeout(ms===300?300:ms-(ms===1500?300:ms===3000?1500:3000));console.log(ms,JSON.stringify(await read()))}
// colour of the valve outline while moving / after
const col=await p.evaluate(()=>[...document.querySelectorAll('#svg path[stroke-linejoin="round"]')].map(e=>e.getAttribute('stroke')).slice(0,3));console.log('valve stroke',col);
await p.evaluate(()=>{const S=AN.cs().S,t=window._t;S.rt.force[t.vn]=0;AN.settle()});await p.waitForTimeout(2500);console.log('closing',JSON.stringify(await read()));
console.log('errs',errs);await b.close()})();
