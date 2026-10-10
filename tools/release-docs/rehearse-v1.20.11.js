/* Rehearsal for the v1.20.11 guide: before (v1.20.10) / after (v1.20.11) crops of live values, second-sheet zoom, colours.  usage: node tools/release-docs/rehearse-v1.20.11.js */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path'),fs=require('fs');
const crop=async(file,sheet,x,y,w,out)=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1000,height:700}});
 await p.goto('file://'+path.resolve(file));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
 await p.evaluate(n=>AN.go(AN.sheets.findIndex(s=>s.name===n)),sheet);await p.waitForTimeout(600);
 await p.evaluate(()=>{const r=[...document.querySelectorAll('#anbar button')].find(x=>/Run/.test(x.textContent));r&&r.click()});await p.waitForTimeout(600);
 await p.evaluate(()=>{const a=document.getElementById('anp');if(a)a.style.display='none'});
 await p.evaluate(([x,y,w])=>{const svg=[...document.querySelectorAll('svg')].sort((a,b)=>b.getBoundingClientRect().width-a.getBoundingClientRect().width)[0];const r=svg.getBoundingClientRect(),h=w*r.height/r.width;svg.setAttribute('viewBox',`${x-w/2} ${-y-h/2} ${w} ${h}`)},[x,y,w]);await p.waitForTimeout(400);
 const clip=await p.evaluate(()=>{const r=[...document.querySelectorAll('svg')].sort((a,b)=>b.getBoundingClientRect().width-a.getBoundingClientRect().width)[0].getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}});
 await p.screenshot({path:out,clip});await b.close()};
(async()=>{fs.mkdirSync('docs/guide-img',{recursive:true});
 await crop('archive/html/logic-sim-v1.20.10.html','ABC-057',280,230,150,'docs/guide-img/v11_057_before.png');
 await crop('logic-sim-v1.20.11.html','ABC-057',280,230,150,'docs/guide-img/v11_057_after.png');
 await crop('archive/html/logic-sim-v1.20.10.html','ABC-002',330,330,150,'docs/guide-img/v11_002_before.png');
 await crop('logic-sim-v1.20.11.html','ABC-002',330,330,150,'docs/guide-img/v11_002_after.png');
 await crop('archive/html/logic-sim-v1.20.10.html','ABC-026',200,430,150,'docs/guide-img/v11_026_before.png');
 await crop('logic-sim-v1.20.11.html','ABC-026',200,430,150,'docs/guide-img/v11_026_after.png');
 console.log('ok')})();
