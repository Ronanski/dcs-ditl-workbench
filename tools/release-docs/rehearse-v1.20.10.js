/* Rehearsal of the Manual Testing Guide v1.20.10 in a headless browser (same steps the user will do). Writes docs/guide-img/*.png and docs/guide-rehearsal.json.  usage: node tools/release-docs/rehearse-v1.20.10.js logic-sim-v1.20.10.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path'),fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1700,height:950}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const OUT={},img=n=>'docs/guide-img/'+n+'.png';
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const go=async n=>{await p.evaluate(n=>AN.go(AN.sheets.findIndex(x=>x.name===n)),n);await p.waitForTimeout(700)};
const run=async()=>{await p.evaluate(()=>{if(AN.run)return;const r=[...document.querySelectorAll('#anbar button')].find(x=>/Run/.test(x.textContent));r&&r.click()});await p.waitForTimeout(500)};
const pt=(sel)=>p.evaluate(sel=>{const f=new Function('AN',sel);const q=f(AN);const svg=[...document.querySelectorAll('svg')].sort((a,b)=>b.getBoundingClientRect().width-a.getBoundingClientRect().width)[0];const m=svg.getScreenCTM(),P=svg.createSVGPoint();P.x=q.cx;P.y=-q.cy;const r=P.matrixTransform(m);return{x:r.x,y:r.y}},sel);
const zoomTo=async(x,y,w)=>{await p.evaluate(([x,y,w])=>{const svg=[...document.querySelectorAll('svg')].sort((a,b)=>b.getBoundingClientRect().width-a.getBoundingClientRect().width)[0];const r=svg.getBoundingClientRect(),h=w*r.height/r.width;svg.setAttribute('viewBox',`${x-w/2} ${-y-h/2} ${w} ${h}`)},[x,y,w]);await p.waitForTimeout(400)};
const shot=async(n)=>{await p.screenshot({path:img(n)})};
// MT-01 Bad Signal direct to a logic block: ABC-028 AI0181 -> DEV
await go('ABC-028');await run();
const m1=await p.evaluate(()=>{const S=AN.cs().S;const a=S.blk.find(b=>b.k==='AI'&&b.sig);const on=a.pins.find(q=>q.role==='out').n;const dv=S.blk.find(b=>(S.cns[on]||[]).some(q=>q.k==='DEV'&&S.blk.find(z=>z.id===q.id)))&&S.blk.find(b=>b.id===(S.cns[on].find(q=>q.k==='DEV')||{}).id);return{ai:a.id,tag:a.tagAI,rng:a.rng,on,cx:a.cx,cy:a.cy,dev:dv&&dv.id,devOut:dv&&dv.o[0]}});
OUT.mt01={...m1};
await p.evaluate(a=>{AN.sel={blk:AN.cs().S.blk.find(b=>b.id===a)};AN.selBox();AN.panelUpd(true)},m1.ai);await p.waitForTimeout(500);
await p.evaluate(()=>{const r=[...document.querySelectorAll('#anp div.r')].find(x=>/OUT AI\d+/.test(x.innerText)||x.querySelector('input'));});
await p.evaluate(([n,v])=>{AN.cs().S.rt.ramp=0;AN.cs().S.rt.st[AN.cs().S.blk.find(b=>b.k==='AI'&&b.sig).id].val=v;AN.settle()},[m1.on,m1.rng?m1.rng.lo+(m1.rng.hi-m1.rng.lo)*.5:50]);await p.waitForTimeout(700);
const rd=()=>p.evaluate(([on,dev])=>{const S=AN.cs().S;return{signal:S.rt.v[on],dev:dev!=null?S.rt.v[dev]:null}},[m1.on,m1.devOut]);
OUT.mt01.before=await rd();await zoomTo(m1.cx,m1.cy,70);await shot('mt01_before');
const bad=p.locator('#anp button:has-text("Bad Signal")').first();OUT.mt01.hasBadBtn=await bad.count()>0;await bad.dispatchEvent('click');await p.waitForTimeout(800);OUT.mt01.after=await rd();await shot('mt01_after');
await p.locator('#anp button:has-text("FORCED BAD")').first().dispatchEvent('click').catch(()=>{});await p.waitForTimeout(600);OUT.mt01.back=await rd();
// MT-02 COS popup: ABC-003B
await go('ABC-003B');await run();
const c=await pt("const c=AN.cs().S.blk.filter(b=>b.k==='COS'&&b.used)[0];return {cx:c.cx,cy:c.cy}");await p.mouse.click(c.x,c.y);await p.waitForTimeout(900);
OUT.mt02={popup:await p.evaluate(()=>{const o=document.getElementById('cospop');return o?o.innerText.replace(/\n/g,' | '):null})};await shot('mt02_popup');
await p.selectOption('#cospop select','B');await p.waitForTimeout(500);await p.fill('#cospop input[type=number]','12.5');OUT.dbg=await p.evaluate(()=>({n:document.querySelectorAll('#cospop').length,val:document.querySelector('#cospop input[type=number]').value,dis:document.querySelector('#cospop input[type=number]').disabled,en:document.getElementById('cospop').innerText.slice(-200)}));await p.press('#cospop input[type=number]','Enter');OUT.dbg2=await p.evaluate(()=>{const S=AN.cs().S,c=S.blk.filter(b=>b.k==='COS'&&b.used)[0];const e=AN.cosInfo(S,c.vnet);return {on:AN.cosOn(S,e),ext:S.rt.ext[c.vnet],sheet:AN.cs().name,same:(document.getElementById('cospop')._pu||[]).length}});await p.waitForTimeout(700);
await p.waitForTimeout(2500);OUT.mt02.after=await p.evaluate(()=>{const S=AN.cs().S,c=S.blk.filter(b=>b.k==='COS'&&b.used)[0];return{target:S.rt.ext[c.vnet],value:S.rt.v[c.vnet],run:AN.run}});await p.keyboard.press('Escape');await p.waitForTimeout(300);OUT.mt02.closed=!(await p.evaluate(()=>!!document.getElementById('cospop')));
// MT-03/04 FX in ABC-002
await go('ABC-002');await run();
const f29=await pt("const f=AN.cs().S.blk.find(b=>b.k==='FX'&&b.p.ln==='LN29');return {cx:f.cx,cy:f.cy}");await p.mouse.click(f29.x,f29.y);await p.waitForTimeout(800);
OUT.mt03={panel:await p.evaluate(()=>[...document.querySelectorAll('#anp small')].map(x=>x.innerText).filter(t=>/Input to the table|Table X/.test(t)))};
const n29=await p.evaluate(()=>{const f=AN.cs().S.blk.find(b=>b.k==='FX'&&b.p.ln==='LN29');return{i:f.i[0],o:f.o[0]}});
await p.evaluate(n=>{const S=AN.cs().S;S.rt.force[n.i]=1;AN.settle()},n29);await p.waitForTimeout(500);OUT.mt03.out=await p.evaluate(n=>AN.cs().S.rt.v[n.o],n29);OUT.mt03.x=await p.evaluate(()=>{const f=AN.cs().S.blk.find(b=>b.k==='FX'&&b.p.ln==='LN29');return AN.cs().S.rt.st[f.id].fxx});
await p.evaluate(()=>{AN.sel={blk:AN.cs().S.blk.find(b=>b.k==='FX'&&b.p.ln==='LN29')};AN.selBox();AN.panelUpd(true)});await zoomTo(f29.cx||0,0,10).catch(()=>{});
const f29b=await p.evaluate(()=>{const f=AN.cs().S.blk.find(b=>b.k==='FX'&&b.p.ln==='LN29');return{cx:f.cx,cy:f.cy}});await zoomTo(f29b.cx,f29b.cy,60);await shot('mt03');
await p.evaluate(n=>{delete AN.cs().S.rt.force[n.i];AN.settle()},n29);
const m4=await p.evaluate(()=>{const S=AN.cs().S;const f=S.blk.find(b=>b.k==='FX'&&b.p.ln==='LN1');const man=S.blk.find(b=>b.k==='MAN'&&b.p.lo===8000);const r=[];for(const v of[8000,10000,12000]){S.rt.ramp=0;S.rt.force[f.i[0]]=v;AN.settle();r.push([v,S.rt.v[f.o[0]]]);delete S.rt.force[f.i[0]]}return{points:r,man:!!man}});OUT.mt04=m4;
// MT-05 min air flow
OUT.mt05=await p.evaluate(()=>{const S=AN.cs().S;const c=S.blk.find(b=>b.k==='CONST'&&b.p.mt);S.rt.force[c.o[0]]=undefined;delete S.rt.force[c.o[0]];AN.settle();return{th:c.p.th,out:S.rt.v[c.o[0]],id:c.id}});
// MT-06 review marks: count of '?' marks on ABC-003B
await go('ABC-003B');OUT.mt06=await p.evaluate(()=>({rv:AN.rv,marks:document.querySelectorAll('#reviewmarks rect').length}));await shot('mt06');
// MT-07 duplicate numbers: TOF/TCF/BM in ABC-002
await go('ABC-002');await run();await zoomTo(300,640,110);OUT.mt07={};await shot('mt07');
// MT-08 xref
await go('ABC-003B');
OUT.mt08={links:await p.evaluate(()=>AN.dbgL.nXref)};
// MT-10 second pane
await go('ABC-002');await p.locator('#anbar button:has-text("2nd sheet")').dispatchEvent('click');await p.waitForTimeout(1500);OUT.mt10={second:await p.evaluate(()=>AN.p2&&AN.p2.name)};await shot('mt10');await p.locator('#cv2h button:has-text("✕")').dispatchEvent('click');
// MT-12 colours + mode label
await go('ABC-002');await p.evaluate(()=>{const S=AN.cs().S;S.rt.force[S.blk.find(b=>b.k==='AI').pins.find(q=>q.role==='out').n]=12;AN.settle()});await p.waitForTimeout(600);
OUT.mt12={mode:await p.evaluate(()=>document.getElementById('anmode').textContent),frc:await p.evaluate(()=>document.querySelectorAll('svg text.bd.frc').length)};await shot('mt12');
fs.writeFileSync('docs/guide-rehearsal.json',JSON.stringify({OUT,errs},null,1));console.log(JSON.stringify(OUT).slice(0,1800),errs);await b.close()})();
