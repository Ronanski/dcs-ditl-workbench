/* screenshot of a region of an analog sheet. usage: node tools/shot-region.js file.html ABC-002 cx cy width out.png */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const [f,sh,cx,cy,w,out]=process.argv.slice(2);const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});
await p.goto('file://'+path.resolve(f));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
await p.evaluate(n=>AN.go(AN.sheets.findIndex(s=>s.name===n)),sh);await p.waitForTimeout(1200);
await p.evaluate(([cx,cy,w])=>{const h=w*725/960,v=[cx-w/2,-cy-h/2,w,h];AN.av[AN.cs().name]=v;document.getElementById('svg').setAttribute('viewBox',v.join(' '))},[+cx,+cy,+w]);
await p.waitForTimeout(500);await p.screenshot({path:out,clip:{x:240,y:112,width:960,height:725}});await b.close()})();
