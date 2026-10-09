/* many region screenshots in ONE browser session. usage: node tools/shot-batch.js file.html list.json outdir   (list = [{sheet,x,y,w,name,mark:[{x,y,w}],segs:[[x1,y1,x2,y2],...]}]; a red box is drawn around the marked text, the segs (the wire the table chose) in green) */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path'),fs=require('fs');
(async()=>{const [f,lst,od]=process.argv.slice(2);const L=JSON.parse(fs.readFileSync(lst,'utf8'));fs.mkdirSync(od,{recursive:true});
const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});
await p.goto('file://'+path.resolve(f));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
let cur=null;for(const it of L){if(cur!==it.sheet){await p.evaluate(n=>AN.go(AN.sheets.findIndex(s=>s.name===n)),it.sheet);await p.waitForTimeout(900);cur=it.sheet}
 await p.evaluate(([cx,cy,w,mk,it_segs])=>{const h=w*725/960,v=[cx-w/2,-cy-h/2,w,h];AN.av[AN.cs().name]=v;const sv=document.getElementById('svg');sv.setAttribute('viewBox',v.join(' '));sv.querySelectorAll('.mk').forEach(e=>e.remove());
  for(const g of it_segs||[]){const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('class','mk');l.setAttribute('x1',g[0]);l.setAttribute('y1',-g[1]);l.setAttribute('x2',g[2]);l.setAttribute('y2',-g[3]);l.setAttribute('stroke','#22e07a');l.setAttribute('stroke-width',1.4);l.setAttribute('opacity',.85);sv.appendChild(l)}
  for(const m of mk||[]){const r=document.createElementNS('http://www.w3.org/2000/svg','rect');r.setAttribute('class','mk');r.setAttribute('x',m.x-2);r.setAttribute('y',-m.y-6);r.setAttribute('width',(m.w||24));r.setAttribute('height',9);r.setAttribute('fill','none');r.setAttribute('stroke','#ff3b3b');r.setAttribute('stroke-width',.8);sv.appendChild(r)}},[it.x,it.y,it.w||120,it.mark,it.segs]);
 await p.waitForTimeout(250);await p.screenshot({path:path.join(od,it.name+'.png'),clip:{x:240,y:112,width:640,height:725}})}
await b.close()})();
