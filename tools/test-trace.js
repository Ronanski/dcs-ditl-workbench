/* step / view / trace / why. usage: node tools/test-trace.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const R=(k,v)=>console.log(k.padEnd(34),v);
await p.evaluate(()=>AN.go(AN.sheets.findIndex(s=>s.name==='ABC-050')));await p.waitForTimeout(800);
// pick an AND/OR block with a driven output and an input
const pick=await p.evaluate(()=>{const S=AN.cs().S;const b=S.blk.find(b=>(b.k==='AND'||b.k==='OR')&&b.o.length&&b.i.length>1&&S.cns[b.o[0]].length);return b?{id:b.id,k:b.k}:null});R('block',JSON.stringify(pick));
await p.evaluate(id=>{const S=AN.cs().S;AN.sel={blk:S.blk.find(b=>b.id===id)};},pick.id);
await p.click('button:has-text("Trace")');await p.waitForTimeout(300);
await p.evaluate(()=>{AN.paint();});
const tr=await p.evaluate(()=>{const sh=AN.cs(),S=sh.S;const c={};for(const n of S.nets){const e=document.querySelector&&0}return {on:AN.trace}});R('trace on',JSON.stringify(tr));
// re-select through UI path to build the panel
await p.evaluate(()=>{AN.paint();const d=document.getElementById('ansel');});
const txt=await p.evaluate(()=>{const d=document.getElementById('ansel');return d?d.innerText.slice(0,600):'(no ansel)'});R('panel',txt.replace(/\n/g,' | ').slice(0,400));
// step
const col=await p.evaluate(()=>{const r={};document.querySelectorAll('#svg [stroke]').forEach(e=>{const f=e.style.filter;if(f){const m=f.match(/rgb\([^)]*\)/);const k=m?m[0]:f;r[k]=(r[k]||0)+1}});return r});R('glow colours on trace',JSON.stringify(col));
await p.click('button:has-text("Trace")');await p.waitForTimeout(100);
const st=await p.evaluate(()=>{const t0=AN.cs().S.rt.t;return t0});
await p.click('button:text-is("+1 s")');await p.waitForTimeout(200);
const st2=await p.evaluate(()=>({t:AN.cs().S.rt.t,fl:AN.flh?AN.flh.size:null}));R('step +1 s',JSON.stringify([st,st2]));
await p.click('button:text-is("+10 s")');R('t after +10',await p.evaluate(()=>AN.cs().S.rt.t.toFixed(1)));
// view mode
await p.click('button:has-text("View")');await p.waitForTimeout(200);
const v1=await p.evaluate(()=>({run:document.querySelector('button[title^="Run"]').disabled,step:[...document.querySelectorAll('button')].find(x=>x.textContent==='+1 s').disabled,cls:document.body.classList.contains('anview')}));R('view mode on',JSON.stringify(v1));
const t3=await p.evaluate(()=>AN.cs().S.rt.t);await p.keyboard.press('Space');await p.waitForTimeout(400);R('Space in view: t unchanged',String(await p.evaluate(()=>AN.cs().S.rt.t)===t3&&!await p.evaluate(()=>AN.run)));
await p.click('button:has-text("View")');R('view off',await p.evaluate(()=>!document.body.classList.contains('anview')));
console.log('errs',errs);await b.close()})();
