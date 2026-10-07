/* browser test: "Assumed values" list opens, block panels show the assumed / file notes, alarms use the assumed limits, no JS errors. usage: node test-defaults-ui.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+require('path').resolve(process.argv[2]));await p.waitForTimeout(2500);
await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(4500);
let bad=0,tot=0;const ok=(c,m)=>{tot++;if(!c){bad++;console.log('FAIL',m)}else console.log('ok  ',m)};
await p.click('button:has-text("Assumed values")');await p.waitForTimeout(500);
const t=await p.evaluate(()=>document.getElementById('anln').innerText);
ok(/Compensation file/.test(t)&&/FT-FA1043-A/.test(t)&&/FICCL1061A/.test(t)&&/LIBR10011/.test(t),'Assumed values list shows TP, RATE and ALM rows');
ok((t.match(/\n/g)||[]).length>100,'list is long ('+(t.match(/\n/g)||[]).length+' lines)');
const r=await p.evaluate(()=>{const o={};AN.go(AN.sheets.findIndex(s=>s.name==='ABC-010'));const S=AN.cs().S;const a=S.blk.find(b=>b.k==='ALM'&&(b.txt||[])[1]==='LIBR10011');o.alm=a&&JSON.stringify([a.p.hh,a.p.h,a.p.l,a.p.ll]);return o});
ok(r.alm==='[150,75,-75,-150]','ABC-010 drum level (1) limits '+r.alm);
console.log('ERRS',errs.length,errs.slice(0,5));await b.close();console.log('ui tests',tot,'failures',bad+errs.length);process.exit(bad+errs.length?1:0)})();
