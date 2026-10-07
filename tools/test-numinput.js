/* manual numeric input (FORCE and INPUT) with a REAL mouse click on the check button, Run and Pause. usage: node test-numinput.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
await p.evaluate(()=>{AN.go(AN.sheets.findIndex(s=>s.name==='ABC-057'))});await p.waitForTimeout(1200);
await p.evaluate(()=>document.querySelectorAll('#anp details').forEach(d=>d.open=true));
const res=[];
const clickSlow=async(loc)=>{const bb=await loc.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(350);await p.mouse.up()};
for(const mode of ['run','pause']){
 const isRun=await p.evaluate(()=>AN.run);if((mode==='run')!==isRun)await p.click('#anbar button:has-text("'+(mode==='run'?'Run':'Pause')+'")');await p.waitForTimeout(600);
 for(const how of ['click','enter']){
  // FORCE: an analog wire from the "Signals to force" list
  const fi=p.locator('#anp input[placeholder=value]').first();await fi.scrollIntoViewIfNeeded();
  const key=await p.evaluate(()=>{const i=document.querySelector('#anp input[placeholder=value]');return i?1:0});
  if(!key){res.push(mode+' '+how+' FORCE: no force box found');continue}
  await fi.click();await fi.fill('');await p.keyboard.type('77');await p.waitForTimeout(250);
  if(how==='click'){const ok=fi.locator('xpath=following-sibling::button[1]');await clickSlow(ok)}else await p.keyboard.press('Enter');
  await p.waitForTimeout(400);
  const f=await p.evaluate(()=>{const S=AN.cs().S;return Object.values(S.rt.force)});
  res.push(mode+' '+how+' FORCE -> forced values '+JSON.stringify(f)+(f.includes(77)?'  OK':'  FAIL'));
  await p.evaluate(()=>{const S=AN.cs().S;for(const k in S.rt.force)delete S.rt.force[k];delete (AN.sv['ABC-057']||{}).force});
 }
}
// INPUT numeric (inCtl): ABC-003B block 6 (AMT) has an external analog input, select it on the drawing with a real click
await p.evaluate(()=>{AN.go(AN.sheets.findIndex(s=>s.name==='ABC-003B'))});await p.waitForTimeout(1500);
await p.evaluate(()=>{AN.av['ABC-003B']=[621,-468,80,40];document.getElementById('svg').setAttribute('viewBox','621 -468 80 40')});await p.waitForTimeout(400);
const pt=await p.evaluate(()=>{const svg=document.getElementById('svg'),m=svg.getScreenCTM(),q=svg.createSVGPoint();q.x=661;q.y=-448;const r=q.matrixTransform(m);return{x:r.x,y:r.y}});
await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(600);
for(const mode of ['run','pause']){
 const isRun=await p.evaluate(()=>AN.run);if((mode==='run')!==isRun)await p.click('#anbar button:has-text("'+(mode==='run'?'Run':'Pause')+'")');await p.waitForTimeout(500);
 for(const how of ['click','enter']){
  const box=p.locator('#anp .fc:has(small:text-is("INPUT")) input[type=number]').first();
  if(!await box.count()){res.push(mode+' '+how+' INPUT: no INPUT box (block not selected?)');continue}
  await box.click();await box.fill('');await p.keyboard.type('77');await p.waitForTimeout(250);
  if(how==='click')await clickSlow(box.locator('xpath=following-sibling::button[1]'));else await p.keyboard.press('Enter');
  await p.waitForTimeout(400);
  const v=await p.evaluate(()=>{const S=AN.cs().S;return S.rt.ext[130]});
  res.push(mode+' '+how+' INPUT -> '+v+(v===77?'  OK':'  FAIL'));
  await p.evaluate(()=>{AN.cs().S.rt.ext[130]=0});
 }
}
console.log(res.join('\n'),'\nerrs',errs);await b.close()})();
