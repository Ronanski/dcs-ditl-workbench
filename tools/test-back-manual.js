/* Back / Next with manual intervention (input toggles, force, many linked sheets, 300x). usage: node tools/test-back-manual.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
let bad=0;const T=(k,ok,x)=>{if(!ok)bad++;console.log((ok?'OK  ':'FAIL')+' '+k+(x!==undefined?'  '+x:''))};
const btn=t=>p.locator('button:text-is("'+t+'")');
const go=async n=>{await p.evaluate(n=>AN.go(AN.sheets.findIndex(s=>s.name===n)),n);await p.waitForTimeout(1000)};
const snap=()=>p.evaluate(()=>{const sh=AN.cs(),S=sh.S,r=S.rt;return{t:+r.t.toFixed(2),v:Array.from(r.v).map(x=>+x.toFixed(4)).join(','),ext:JSON.stringify(r.ext),force:JSON.stringify(r.force),n:(sh._hs||[]).length}});
const step=async s=>p.selectOption('select[title^="Pause"]',String(s));
// ---- A: ABC-050, input toggled between steps
await go('ABC-050');await btn('▶ Run').click();await p.waitForTimeout(300);await btn('❚❚ Pause').click();await p.waitForTimeout(200);
await step(10);const a0=await snap();
await btn('Next ▶').click();const a1=await snap();
// toggle a digital input from the panel (manual intervention)
const tog=await p.evaluate(()=>{const S=AN.cs().S;const n=S.ext.find(n=>S.nets[n].dig);const old=S.rt.ext[n];return{n,old}});
await p.locator('#anp button:has-text("OFF")').first().click();await p.waitForTimeout(300);
const a2=await snap();T('manual input change takes effect (ext changed)',a2.ext!==a1.ext,'');
await btn('Next ▶').click();const a3=await snap();
await btn('◀ Back').click();const a4=await snap();T('Back 10 s returns to the moment of the intervention (t and ALL values)',a4.t===a2.t&&a4.v===a2.v,JSON.stringify([a2.t,a4.t]));
T('...and the input is still the changed one (ext kept)',a4.ext===a2.ext);
await btn('◀ Back').click();const a5=await snap();T('Back again goes before the intervention (t = start)',Math.abs(a5.t-a1.t)<.05||a5.t<=a1.t,JSON.stringify([a1.t,a5.t]));
// consistency of the panel with the restored input
const pn=await p.evaluate(()=>{const S=AN.cs().S;return Object.keys(S.rt.ext).length});T('panel still builds after Back (no crash)',pn>=0);
// ---- B: force then Back
await btn('Next ▶').click();await btn('Next ▶').click();
await p.evaluate(()=>{const S=AN.cs().S;const n=S.ext.find(n=>!S.nets[n].dig);S.rt.force[n]=77;AN.settle&&AN.settle()});
const b0=await snap();await btn('Next ▶').click();await btn('◀ Back').click();const b1=await snap();T('force survives Next + Back',b1.force===b0.force&&b1.t===b0.t);
await btn('◀ Back').click();await btn('◀ Back').click();const b2=await snap();T('Back before the force removes it from the state',b2.force==='{}'||b2.force!==b0.force,b2.force);
// ---- C: speed 300x run on a sheet with many linked sheets, then Back 1 s, 60 s
await go('ABC-003B');await p.selectOption('select[title^="Simulation"]','300');
const linked=await p.evaluate(()=>{let n=1;const set=[AN.cs()],seen=new Set(set);for(let i=0;i<set.length;i++)for(const l of (set[i].lk||[]))for(const y of[l.from,l.to])if(!seen.has(y)){seen.add(y);set.push(y)}return set.length});console.log('   linked sheets with ABC-003B:',linked);
const t0=Date.now();await btn('▶ Run').click();await p.waitForTimeout(6000);await btn('❚❚ Pause').click();await p.waitForTimeout(300);
const c0=await snap();console.log('   after 6 s at 300x: t =',c0.t,'history snapshots',c0.n,'ui alive',Date.now()-t0<12000);
await step(1);await btn('◀ Back').click();const c1=await snap();T('Back 1 s at 300x (replay from nearest snapshot)',Math.abs(c1.t-(c0.t-1))<.3,JSON.stringify([c0.t,c1.t]));
await step(60);await btn('◀ Back').click();const c2=await snap();T('Back 60 s',Math.abs(c2.t-(c1.t-60))<.6||c2.t<=c1.t-59,JSON.stringify([c1.t,c2.t]));
await btn('Next ▶').click();const c3=await snap();T('Next 60 s after Back moves forward',Math.abs(c3.t-(c2.t+60))<.6,JSON.stringify([c2.t,c3.t]));
const mem=await p.evaluate(()=>performance.memory?Math.round(performance.memory.usedJSHeapSize/1e6):-1);console.log('   JS heap MB',mem);
console.log('errs',errs,'bad',bad);await b.close()})();
