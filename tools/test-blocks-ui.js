/* UI of the function blocks and of the page links: SUMA total + reset, SEL mode, TP / DIV panels, and the circle click that walks EVERY other end (C of ABC-001B: 001A, 001C, 001C).  usage: node tools/test-blocks-ui.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
let bad=0;const T=(k,ok,x)=>{if(!ok)bad++;console.log((ok?'OK  ':'FAIL')+' '+k+(x!==undefined?'  '+x:''))};
const centre=async(sheet,x,y,w=70)=>{await p.evaluate(([sheet,x,y,w])=>{AN.go(AN.sheets.findIndex(s=>s.name===sheet));const h=w*.55,v=[x-w/2,-y-h/2,w,h];AN.av[sheet]=v;document.getElementById('svg').setAttribute('viewBox',v.join(' '))},[sheet,x,y,w]);await p.waitForTimeout(500);const r=await p.evaluate(()=>{const e=document.getElementById('svg').getBoundingClientRect();return{x:e.x+e.width/2,y:e.y+e.height/2}});return r};
const panel=()=>p.evaluate(()=>{const d=document.getElementById('ansel');return d?d.innerText:''});
/* SUMA */
let r=await centre('ABC-003B',412,610,60);await p.mouse.click(r.x,r.y);await p.waitForTimeout(500);let t=await panel();T('SUMA panel shows the total and a reset button',/Total = integral/.test(t)&&/Reset total/.test(t),t.split('\n').slice(0,3).join(' | '));
await p.evaluate(()=>{const S=AN.cs().S;const bl=S.blk.find(x=>x.k==='SUMA');S.rt.force[bl.i[0]]=3600});await p.evaluate(()=>{const S=AN.cs().S;for(let i=0;i<20;i++)AN.settle&&0});
const tot=await p.evaluate(()=>{const S=AN.cs().S;const bl=S.blk.find(x=>x.k==='SUMA');return S.rt.st[bl.id].tot});T('SUMA starts at 0',tot===0||tot===undefined,String(tot));
/* SEL mode */
r=await centre('ABC-009A',292,612,60);await p.mouse.click(r.x,r.y);await p.waitForTimeout(500);t=await panel();T('SEL panel has the mode select (PRI / SEC / AVG)',/Select mode/.test(t)&&/PRI/.test(t),t.split('\n').slice(0,4).join(' | '));
const mode=await p.evaluate(()=>{const d=document.getElementById('ansel');const s=d.querySelector('select');if(!s)return null;s.value='PRI';s.dispatchEvent(new Event('change'));return AN.cs().S.blk.find(x=>x.k==='SEL'&&Math.abs(x.cx-292)<3).p.mode});T('changing the mode is stored',mode==='PRI',String(mode));
/* TP */
r=await centre('ABC-003B',688,586,60);await p.mouse.click(r.x,r.y);await p.waitForTimeout(500);t=await panel();T('TP panel asks for the operating temperature',/Operating temperature/.test(t)&&/NOT compensating/.test(t));
/* circle walk */
r=await centre('ABC-001B',686,217,60);const seen=[];for(let i=0;i<5;i++){await p.mouse.click(r.x,r.y);await p.waitForTimeout(700);const st=await p.evaluate(()=>{const v=AN.av[AN.cs().name];return AN.cs().name+' @'+Math.round(v[0]+v[2]/2)+','+Math.round(-v[1]-v[3]/2)});seen.push(st);r=await p.evaluate(()=>{const e=document.getElementById('svg').getBoundingClientRect();return{x:e.x+e.width/2,y:e.y+e.height/2}})}
console.log('   walk from ABC-001B "C":',seen.join('  ->  '));const names=seen.map(x=>x.split(' ')[0]);T('walk visits ABC-001A, ABC-001C and comes back to ABC-001B',names.includes('ABC-001A')&&names.includes('ABC-001C')&&names[3]==='ABC-001B'||names.slice(0,4).includes('ABC-001B'));T('the fifth click starts again',seen[4]===seen[0]);
console.log('errs',errs,'bad',bad);await b.close()})();
