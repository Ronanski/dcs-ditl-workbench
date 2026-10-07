/* usage: node shot.js file.html sheet x0 y0 x1 y1 out.png  (view window in drawing units) */
const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const [f,nm,x0,y0,x1,y1,out]=process.argv.slice(2);const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+require('path').resolve(f));await p.waitForTimeout(3000);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(4000);
await p.evaluate(([nm,x0,y0,x1,y1])=>{AN.go(AN.sheets.findIndex(s=>s.name===nm));const sh=AN.cs(),S=sh.S;
 // switch on every external digital input and give analog inputs a value so wires light up
 for(const n of S.ext){S.rt.ext[n]=S.nets[n].dig?1:40}AN.settle();for(let i=0;i<30;i++)AN.settle();
 const w=+x1-+x0,h=+y1-+y0;AN.av[nm]=[+x0,-+y1,w,h];document.getElementById('svg').setAttribute('viewBox',AN.av[nm].join(' '));AN.paint()},[nm,x0,y0,x1,y1]);
await p.waitForTimeout(500);await p.screenshot({path:out});console.log('errs',errs);await b.close()})();
