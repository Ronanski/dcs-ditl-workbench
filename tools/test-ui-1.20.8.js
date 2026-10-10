/* v1.20.8 UI scope: Plant / Save / Save as / Open / Import / Imports are gone from the analog toolbar, no page error, Ctrl+S does nothing, Health shows the review column.  usage: node tools/test-ui-1.20.8.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(()=>{const bar=document.getElementById('anbar');const t=[...bar.querySelectorAll('button,label,select')].map(x=>x.textContent.trim()||x.title);return{t,hasFile:!!bar.querySelector('input[type=file]')}});
const bad=r.t.filter(x=>/^(💾 Save|Save as|📂 Open|Import ABC DXF|Imports|Plant|Plant model)/.test(x));
console.log('toolbar:',r.t.join(' | '));console.log('forbidden items present:',bad,'file input present:',r.hasFile);console.log((bad.length||r.hasFile?'FAIL ':'PASS ')+'toolbar: no Save / Save as / Open / Import / Imports / Plant items, no file input');
await p.keyboard.press('Control+s');await p.waitForTimeout(300);
await p.click('#anbar button:has-text("Health")');await p.waitForTimeout(6000);const hh=await p.evaluate(()=>document.getElementById('anhp').innerText.slice(0,300));console.log('health:',hh.replace(/\n/g,' '));
await p.screenshot({path:'/tmp/claude-0/scratch/ui.png',clip:{x:0,y:0,width:1500,height:140}});
console.log('errs',errs);process.exitCode=(bad.length||r.hasFile||errs.length)?1:0;await b.close()})();
