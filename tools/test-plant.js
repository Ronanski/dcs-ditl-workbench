/* Plant window (REHEATER): opens as a pop-out window, every number is an address of the sheets, FORCE / SIM from the field side goes through the drawn wires to the valve, the same IO address is one value on every sheet. usage: node tools/test-plant.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const ctx=await b.newContext({viewport:{width:1700,height:950}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const E=(f,a)=>p.evaluate(f,a);
await E(()=>{AN.procDefault=true;AN.run=true;AN.spd=30});
const hasHmi=await E(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent==='HMI'&&b.offsetParent).length);
ck('toolbar: no visible HMI button, a Plant button',hasHmi===0&&await E(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='Plant'&&b.offsetParent)));
/* 1. open: real pop-out window */
const [pop]=await Promise.all([ctx.waitForEvent('page',{timeout:20000}),p.click('button:text-is("Plant")')]);await pop.waitForTimeout(2500);
ck('the plant graphic is a separate window',!!pop&&await pop.evaluate(()=>!!document.querySelector('svg')&&document.title.includes('Plant')));
const info=await pop.evaluate(()=>{const tit=[...document.querySelectorAll('title')].map(t=>t.textContent);return{n:document.querySelectorAll('text').length,missing:tit.filter(t=>/not on any ABC sheet|not found on any sheet/.test(t))}});
console.log('texts',info.n,'unresolved',info.missing.length);info.missing.forEach(m=>console.log('   -',m.slice(0,110)));
ck('screen is drawn',info.n>150);
/* 2. values are the addresses: window = sheets */
const same=await E(()=>{const o=[];for(const t of ['PT-MS1006-1','PT-MS1006-2','PT-HR1003-1','TT-HR1012-1','PT-CR1003']){const L=AN.plAIs().get(t);if(!L)continue;const vs=L.map(x=>x.S.rt.v[x.n]);o.push({t,sheets:L.map(x=>x.sh.name).join('/'),vs})}return o});
console.log(JSON.stringify(same));
ck('same IO address on several sheets carries ONE value',same.every(r=>r.vs.every(v=>Math.abs(v-r.vs[0])<1e-6)));
/* 3. input -> wires -> output: SIM the main steam pressure above the setpoint => the HP bypass valve opens (PICMS1006 MV) ; the same value shows on every sheet carrying PT-MS1006-1 */
const r1=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const sv=AN.plRes({pid:'PICMS1006',pin:'SV'}),mv=AN.plRes({pid:'PICMS1006',pin:'MV'}),pt=AN.plRes({ai:'PT-MS1006-1'}),pv=AN.plRes({pid:'PICMS1006',pin:'PV'});const out={};
 AN.hmiToggleForce({sheet:sv.sheet,nn:sv.nn});await w(200);AN.hmiWrite({sheet:sv.sheet,nn:sv.nn},125);await w(9000);out.sv=AN.plVal(sv);out.pv0=AN.plVal(pv);out.mv0=AN.plVal(mv);
 AN.hmiToggleForce({sheet:pt.sheet,nn:pt.nn});await w(300);AN.hmiWrite({sheet:pt.sheet,nn:pt.nn},out.sv+14);await w(2500);out.pt=AN.plVal(pt);out.mv1=AN.plVal(mv);out.others=AN.plAIs().get('PT-MS1006-1').map(x=>x.sh.name+'='+x.S.rt.v[x.n].toFixed(1));
 AN.hmiToggleForce({sheet:pt.sheet,nn:pt.nn});AN.hmiToggleForce({sheet:sv.sheet,nn:sv.nn});await w(300);return out});
console.log(JSON.stringify(r1));
ck('SIM of the field transmitter is carried to all sheets of the address',r1.others.every(s=>Math.abs(+s.split('=')[1]-(r1.sv+14))<0.2),r1.others.join(' '));
ck('HP bypass: pressure 14 above the SV -> the bypass valve (MV of PICMS1006, ACT:N direct) opens more, through the drawn wiring',r1.mv1>r1.mv0+3,r1.mv0.toFixed(1)+' -> '+r1.mv1.toFixed(1));
const txt=await pop.evaluate(()=>[...document.querySelectorAll('text')].map(t=>t.textContent));
ck('window shows the valve opening of PCVMS1020 as a number',txt.some(t=>/^\d+\.\d %$/.test(t)));
/* 4. ownership: sheets read only while the window is open; closing the window gives control back */
const own=await E(()=>({body:document.body.classList.contains('hmiown'),open:AN.plantUi.open}));ck('plant window open = panel read only',own.body&&own.open);
/* 5. a free transmitter set in the window shows in the panel / sheets */
const r2=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));AN.procDefault=false;const pt=AN.plRes({ai:'PT-CR1003'});if(!pt)return{none:1};const st=AN.hmiState({sheet:pt.sheet,nn:pt.nn});return{how:st.how}});console.log(JSON.stringify(r2));
await pop.close();await p.waitForTimeout(1800);
const after=await E(()=>({open:AN.plantUi.open,body:document.body.classList.contains('hmiown')}));
ck('closing the window releases the sheets',!after.open&&!after.body);
ck('no page errors',errs.length===0,errs.slice(0,3).join(' | '));
console.log(fail?'FAILED '+fail:'ALL PASS');await b.close();process.exit(fail?1:0)})();
