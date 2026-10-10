/* v1.20.10: second sheet pane: opens, shows live values, never the same sheet twice, maximum two, swap, close.  usage: node tools/test-pane2.js file.html [screenshot.png] */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1800,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const R=[];const ok=(n,c,x)=>R.push((c?'PASS ':'FAIL ')+n+(x!==undefined?'  '+x:''));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
await p.evaluate(()=>AN.go(AN.sheets.findIndex(s=>s.name==='ABC-002')));await p.waitForTimeout(700);
await p.locator('#anbar button:has-text("2nd sheet")').dispatchEvent('click');await p.waitForTimeout(1500);
const st=await p.evaluate(()=>({on:document.getElementById('cv2').classList.contains('on'),n:document.getElementById('svg2').children.length,name:AN.p2&&AN.p2.name,main:AN.cs().name,sel:document.querySelector('#cv2h select')&&document.querySelector('#cv2h select').value}));
ok('the second pane opens with another sheet (not the main one)',st.on&&st.n>5&&st.name&&st.name!==st.main,JSON.stringify(st));
await p.evaluate(()=>{const r=[...document.querySelectorAll('#anbar button')].find(x=>/Run/.test(x.textContent));r&&r.click()});await p.waitForTimeout(1500);
// live: change an input on the second sheet's engine and see its badge change without it being the main sheet
const live=await p.evaluate(async()=>{const sh2=AN.p2,S2=sh2.S;const ai=S2.blk.find(b=>b.k==='AI'&&!b.fb&&b.pins.some(q=>q.role==='out'));if(!ai)return{none:true};const n=ai.pins.find(q=>q.role==='out').n;const t0=S2.rt.v[n];S2.rt.st[ai.id].val=(ai.rng?ai.rng.lo+(ai.rng.hi-ai.rng.lo)*.5:50);await new Promise(r=>setTimeout(r,1500));const t1=S2.rt.v[n];const txt=[...document.querySelectorAll('#cv2 svg text.bd')].map(t=>t.textContent).filter(Boolean);return{t0,t1,badges:txt.length}});
ok('the second sheet is simulated live (its engine runs while it is not the main sheet)',live.none||(live.t1!==live.t0&&live.badges>0),JSON.stringify(live));
// same sheet twice not allowed
const same=await p.evaluate(()=>{const n2=AN.p2.name;AN.go(AN.sheets.findIndex(s=>s.name===n2));return{p2:!!AN.p2,cur:AN.cs().name,n2}});await p.waitForTimeout(500);
ok('going to the sheet that is in the second pane closes the pane (no duplicates)',!same.p2&&same.cur===same.n2,JSON.stringify(same));
await p.locator('#anbar button:has-text("2nd sheet")').dispatchEvent('click');await p.waitForTimeout(1000);
const sw=await p.evaluate(()=>{const a=AN.cs().name,b=AN.p2.name;return{a,b}});
await p.locator('#cv2h button:has-text("Swap")').dispatchEvent('click');await p.waitForTimeout(1200);
const sw2=await p.evaluate(()=>({main:AN.cs().name,p2:AN.p2&&AN.p2.name}));ok('Swap exchanges main and second sheet',sw2.main===sw.b&&sw2.p2===sw.a,JSON.stringify({before:sw,after:sw2}));
if(process.argv[3])await p.screenshot({path:process.argv[3]});
await p.locator('#cv2h button:has-text("✕")').dispatchEvent('click');await p.waitForTimeout(500);
ok('close hides the pane',!(await p.evaluate(()=>document.getElementById('cv2').classList.contains('on')))&&!(await p.evaluate(()=>AN.p2)));
console.log(R.join('\n'));console.log('errs',errs);process.exitCode=R.some(x=>x.startsWith('FAIL'))||errs.length?1:0;await b.close()})();
