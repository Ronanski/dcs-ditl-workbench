/* VIEW / RUN / PAUSE modes, auto-trace, Back / Next, wire style. usage: node tools/test-modes.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
await p.evaluate(()=>AN.go(AN.sheets.findIndex(s=>s.name==='ABC-050')));await p.waitForTimeout(1000);
let bad=0;const T=(k,ok,x)=>{if(!ok)bad++;console.log((ok?'OK  ':'FAIL')+' '+k+(x!==undefined?'  '+x:''))};
const cols=()=>p.evaluate(()=>{const r={};document.querySelectorAll('#svg [stroke]').forEach(e=>{const c=e.getAttribute('stroke');if(c&&c[0]==='#'&&e.getAttribute('stroke-width')){r[c]=(r[c]||0)+1}});return r});
const btn=t=>p.locator('button:text-is("'+t+'")');
T('opens in VIEW',await p.evaluate(()=>AN.view&&document.body.classList.contains('anview')&&!AN.run));
T('default wire style solid / thin',await p.evaluate(()=>AN.ws.as==='solid'&&AN.ws.aw==1&&AN.ws.dw==1),await p.evaluate(()=>JSON.stringify([AN.ws.as,AN.ws.aw,AN.ws.dw])));
const c1=await cols();console.log('   VIEW colours',JSON.stringify(c1));
T('VIEW: wires all one grey',Object.keys(c1).filter(c=>c==='#7f8d99').length===1&&(c1['#7f8d99']||0)>100);
T('VIEW: Back/Next/step disabled',await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/^(◀ Back|Next ▶)$/.test(b.textContent)).every(b=>b.disabled)));
// select a block by click on the canvas
const pos=await p.evaluate(()=>{const S=AN.cs().S;const b=S.blk.find(b=>b.k==='AND'&&b.o.length&&S.cns[b.o[0]].length&&b.i.length>1);const w=140,h=w*.55;const v=[b.cx-w/2,-b.cy-h/2,w,h];AN.av['ABC-050']=v;document.getElementById('svg').setAttribute('viewBox',v.join(' '));return{id:b.id,cx:b.cx,cy:b.cy}});
await p.waitForTimeout(300);
const pt=await p.evaluate(({cx,cy})=>{const svg=document.getElementById('svg');const m=svg.getScreenCTM();return{x:m.a*cx+m.e,y:m.d*(-cy)+m.f}},pos);
await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(400);
T('VIEW click selects block',await p.evaluate(id=>!!(AN.sel&&AN.sel.blk&&AN.sel.blk.id===id),pos.id));
const glow=await p.evaluate(()=>[...document.querySelectorAll('#svg [stroke]')].filter(e=>e.style.filter).length);T('VIEW: auto trace glow',glow>0,glow);
T('VIEW: trace list in the panel',await p.evaluate(()=>/Trace/.test(document.getElementById('ansel').innerText)));
await p.mouse.click(pt.x+400,pt.y-250);await p.waitForTimeout(400);
T('click blank clears selection + trace',await p.evaluate(()=>!AN.sel&&![...document.querySelectorAll('#svg [stroke]')].some(e=>e.style.filter)));
// RUN
await btn('▶ Run').click();await p.waitForTimeout(1500);
T('Run leaves VIEW',await p.evaluate(()=>!AN.view&&AN.run));
const c2=await cols();console.log('   RUN colours',JSON.stringify(c2));T('RUN: not all one grey',Object.keys(c2).length>2);
T('RUN: no trace glow on select',await p.evaluate(id=>{AN.sel={blk:AN.cs().S.blk.find(b=>b.id===id)};AN.paint();return![...document.querySelectorAll('#svg [stroke]')].some(e=>e.style.filter)},pos.id));
await btn('❚❚ Pause').click();await p.waitForTimeout(300);
T('PAUSE: Back/Next enabled',await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/^(◀ Back|Next ▶)$/.test(b.textContent)).every(b=>!b.disabled)));
// time travel
await p.selectOption('select[title^="Pause"]','10');
const snap=()=>p.evaluate(()=>{const r=AN.cs().S.rt;return{t:+r.t.toFixed(2),v:Array.from(r.v).map(x=>+x.toFixed(4)).join(',')}});
const s0=await snap();await btn('Next ▶').click();await p.waitForTimeout(300);const s1=await snap();
T('Next +10 s moves time',Math.abs(s1.t-s0.t-10)<.05,JSON.stringify([s0.t,s1.t]));T('Next changes values',s1.v!==s0.v);
await btn('◀ Back').click();await p.waitForTimeout(300);const s2=await snap();
T('Back -10 s restores the time and ALL values',Math.abs(s2.t-s0.t)<.05&&s2.v===s0.v,JSON.stringify([s2.t]));
await btn('Next ▶').click();await btn('Next ▶').click();await p.waitForTimeout(200);await p.selectOption('select[title^="Pause"]','5');await btn('◀ Back').click();await p.waitForTimeout(200);
const s3=await snap();T('Back 5 s after two Next (10 s each) = t0+15',Math.abs(s3.t-(s0.t+15))<.1,String(s3.t));
// back after a free run
await btn('▶ Run').click();await p.waitForTimeout(2500);await btn('❚❚ Pause').click();const s4=await snap();await p.selectOption('select[title^="Pause"]','1');await btn('◀ Back').click();const s5=await snap();T('Back 1 s after Run',Math.abs(s5.t-(s4.t-1))<.15,JSON.stringify([s4.t,s5.t]));
// view again
await btn('View').click();await p.waitForTimeout(300);const c3=await cols();T('back to VIEW: grey again',(c3['#7f8d99']||0)>100&&!await p.evaluate(()=>AN.run));
// reset clears history and forces
await btn('Reset').click();await p.waitForTimeout(300);T('Reset clears history',await p.evaluate(()=>AN.sheets.every(s=>!s._hs||!s._hs.length)));
console.log('errs',errs,'bad',bad);await b.close()})();
