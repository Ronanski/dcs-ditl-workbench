/* v1.20.9 UI regression (the user's manual test findings of 2026-10-10).  usage: node tools/test-ui-1.20.9.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const R=[];const ok=(n,c,x)=>R.push((c?'PASS ':'FAIL ')+n+(x!==undefined?'  '+x:''));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const go=async n=>{await p.evaluate(n=>AN.go(AN.sheets.findIndex(x=>x.name===n)),n);await p.waitForTimeout(700)};
const run=async()=>{await p.evaluate(()=>{const r=[...document.querySelectorAll('#anbar button')].find(x=>/Run/.test(x.textContent));r&&r.click()});await p.waitForTimeout(400)};
await go('ABC-002');await run();
// 1. typed (FORCE) value on the AI output: address, ALM, instrument tag
await p.evaluate(()=>{AN.sel={blk:AN.cs().S.blk.find(b=>b.id===3)};AN.selBox();AN.panelUpd(true)});await p.waitForTimeout(500);
await p.evaluate(()=>{const row=[...document.querySelectorAll('#anp div.r')].find(r=>/OUT AI0273/.test(r.innerText));const i=row.querySelector('input'),ok=[...row.querySelectorAll('button')].find(x=>x.textContent==='✓');i.value='15';ok.click()});await p.waitForTimeout(700);
const t1=await p.evaluate(()=>{const S=AN.cs().S,L=AN.dbgL;const near=(t)=>{let best=null,bd=1e9;for(const q of S.tx){const d=Math.hypot(q.x-(+t.getAttribute('x')),q.y-(-+t.getAttribute('y')));if(d<bd){bd=d;best=q.t.trim()}}return best};
 const vis=[...document.querySelectorAll('svg text.bd')].filter(t=>t.style.display!=='none'&&t.textContent.trim()==='15.00').map(t=>near(t));return{vis,tag:[...document.querySelectorAll('svg text.bd')].some(t=>t.style.display!=='none'&&/AT-FG1122|AIFG1122/.test(near(t)))}});
ok('typed (forced) AI value 15 shows beside the AI0273 address',t1.vis.some(x=>/AI0273/.test(x)),JSON.stringify(t1.vis));
ok('no value beside the instrument tag AT-FG1122 or the ALM tag',!t1.tag);
ok('no 15.00 at ALM / instrument tag',!t1.vis.some(x=>/ALM|AIFG1122|AT-FG/.test(x)));
await p.evaluate(()=>{const S=AN.cs().S;delete S.rt.force[S.blk.find(b=>b.id===3).o[0]];AN.settle()});
// 2. range: typed value beyond the written range (AI0273 range 0 ~ 25 %) in the FORCE box
await p.evaluate(()=>{const row=[...document.querySelectorAll('#anp div.r')].find(r=>/OUT AI0273/.test(r.innerText));const i=row.querySelector('input'),ok=[...row.querySelectorAll('button')].find(x=>x.textContent==='✓');i.value='99';ok.click()});await p.waitForTimeout(500);
const f2=await p.evaluate(()=>{const S=AN.cs().S;return S.rt.force[S.blk.find(b=>b.id===3).o[0]]});ok('FORCE typed 99 on a 0 ~ 25 % transmitter is limited to 25',f2===25,f2);
await p.evaluate(()=>{const S=AN.cs().S;delete S.rt.force[S.blk.find(b=>b.id===3).o[0]];AN.settle()});
// 3. wire values on / off
const cw=async()=>p.evaluate(()=>{const L=AN.dbgL,S=AN.cs().S;return L.bd.filter(q=>q.wire&&!q.skip&&q.t.style.display!=='none').length});
const w1=await cw();ok('Wire values ON by default: wires without an address show a number',w1>0,w1);
await p.evaluate(()=>{[...document.querySelectorAll('#anbar button')].find(x=>x.textContent==='Wire values').click()});await p.waitForTimeout(400);const w0=await cw();ok('Wire values button switches them off',w0===0,w0);
await p.evaluate(()=>{[...document.querySelectorAll('#anbar button')].find(x=>x.textContent==='Wire values').click()});await p.waitForTimeout(300);
// 4. select circuit wires lit / grey when bad
const sw=async()=>p.evaluate(()=>{const S=AN.cs().S,L=AN.dbgL;S._dk=null;AN.paint();return Object.keys(S.selw||{}).map(n=>L.nets[+n].getAttribute('stroke'))});
await p.evaluate(()=>{const S=AN.cs().S;S.rt.ramp=0;S.rt.st[3].val=4.3;S.rt.st[4].val=4.6;S.rt.st[8].val=0;S.rt.st[9].val=0;AN.settle()});const c0=await sw();
ok('the two wires into the SELECT CIRCUIT are lit (analog colour) when healthy',c0.length===2&&c0.every(c=>c!=='#3b4651'&&c!=='#7f8d99'),JSON.stringify(c0));
await p.evaluate(()=>{const S=AN.cs().S;S.rt.st[8].val=1;AN.settle()});const c1=await sw();ok('the wire of a transmitter forced BAD turns grey (excluded from the average)',c1.some(c=>c==='#3b4651'),JSON.stringify(c1));
await p.evaluate(()=>{const S=AN.cs().S;S.rt.st[8].val=0;AN.settle()});
// 5. division block
const dv=await p.evaluate(()=>{const S=AN.cs().S,b=S.blk.find(q=>q.id===44);return{k:b.k,nu:b.nu,de:b.de,pins:b.pins.map(p=>p.lab+':'+p.n)}});ok('ABC-002 #44 (the division symbol) is a DIV with a / b',dv.k==='DIV',JSON.stringify(dv));
// 6. block settings survive Reset; per-block reset
await go('ABC-050');
const rb=await p.evaluate(()=>{const S=AN.cs().S;const b=S.blk.find(q=>q.k==='RAMPB');return b&&{id:b.id,rate:b.p.rate}});
if(rb){await p.evaluate(([id])=>{const S=AN.cs().S;AN.sel={blk:S.blk.find(q=>q.id===id)};AN.selBox();AN.panelUpd(true)},[rb.id]);await p.waitForTimeout(500);
 await p.evaluate(()=>{const row=[...document.querySelectorAll('#anp div.r')].find(r=>/Rate \(signal/.test(r.innerText));const i=row.querySelector('input');i.value='7';i.dispatchEvent(new Event('change',{bubbles:true}))});await p.waitForTimeout(400);
 const r1=await p.evaluate(([id])=>AN.cs().S.blk.find(q=>q.id===id).p.rate,[rb.id]);ok('block rate set to 7',r1===7,r1);
 await p.evaluate(()=>{[...document.querySelectorAll('#anbar button')].find(x=>x.textContent==='Reset').click()});await p.waitForTimeout(600);
 const r2=await p.evaluate(([id])=>AN.cs().S.blk.find(q=>q.id===id).p.rate,[rb.id]);ok('global Reset keeps the block setting (7)',r2===7,r2);
 await p.evaluate(([id])=>{const S=AN.cs().S;AN.sel={blk:S.blk.find(q=>q.id===id)};AN.selBox();AN.panelUpd(true)},[rb.id]);await p.waitForTimeout(500);
 await p.evaluate(()=>{[...document.querySelectorAll('#anp button')].find(x=>/Reset this block to default/.test(x.textContent)).click()});await p.waitForTimeout(500);
 const r3=await p.evaluate(([id])=>AN.cs().S.blk.find(q=>q.id===id).p.rate,[rb.id]);ok('"Reset this block to default" restores the default rate',Math.abs(r3-rb.rate)<1e-12,r3+' vs '+rb.rate)}
// 7. min air flow signal is the T/H setting
await go('ABC-002');const ma=await p.evaluate(()=>{const S=AN.cs().S,c=S.blk.find(b=>b.k==='CONST'&&b.p.mt);return{th:c.p.th,out:S.rt.v[c.o[0]],orig:c.p.orig}});ok('minimum air flow: setting 400 T/H = signal 400, drawing 32 % kept',ma.th===400&&ma.out===400&&ma.orig===32,JSON.stringify(ma));
console.log(R.join('\n'));console.log('errs',errs);process.exitCode=R.some(x=>x.startsWith('FAIL'))||errs.length?1:0;await b.close()})();
