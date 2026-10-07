/* descriptions + address highlight. usage: node tools/test-ades.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.adesLoad();const A=await AN.adesLoad();AN.go(AN.sheets.findIndex(s=>s.name==='ABC-050'));return{stations:Object.keys(A),n:Object.values(A).reduce((a,t)=>a+Object.keys(t).length,0),stn:AN.shStn(AN.cs()),f1:AN.adesFind(AN.cs(),'I.0413'),f2:AN.adesFind(AN.cs(),'S1 M.0160'),f3:AN.adesFind(AN.cs(),'TR708')}});
console.log(JSON.stringify(r));
await p.waitForTimeout(800);const rows=await p.evaluate(()=>[...document.querySelectorAll('#anp .ir')].map(r=>r.textContent.slice(0,120)).filter(t=>/I\.04|M\.3103/.test(t)).slice(0,3));console.log('panel rows',rows);
const pos=await p.evaluate(()=>{const S=AN.cs().S;for(let n=0;n<S.lab.length;n++){const l=S.lab[n];if(l&&/I\.0413/.test(l.t)){const sg=S.seg[S.nets[n].segs[0]];return{n,x:(sg.x1+sg.x2)/2,y:(sg.y1+sg.y2)/2}}}return null});console.log('wire',JSON.stringify(pos));
if(pos){await p.evaluate(([x,y])=>{AN.av['ABC-050']=[x-30,-y-18,60,36];document.getElementById('svg').setAttribute('viewBox',[x-30,-y-18,60,36].join(' '))},[pos.x,pos.y]);await p.waitForTimeout(300);
await p.evaluate(n=>{AN.sel={net:n};AN.paint()},pos.n);await p.waitForTimeout(400);
console.log('card',JSON.stringify(await p.evaluate(()=>{const c=document.getElementById('antag');return c&&{shown:getComputedStyle(c).display,text:c.innerText}})));
await p.screenshot({path:'/tmp/claude-0/ades.png'});
await p.evaluate(()=>{AN.sel=null;AN.paint()});await p.waitForTimeout(300);console.log('card hidden after deselect',await p.evaluate(()=>getComputedStyle(document.getElementById('antag')).display))}
console.log('errs',errs);await b.close()})();
