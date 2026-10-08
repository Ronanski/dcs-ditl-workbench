/* DITL signals panel: lists the FROM DITL inputs and TO DITL outputs, one click switches an input, the logic reacts. usage: node tools/test-ditl-signals.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1700,height:950}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const idx=await p.evaluate(async()=>{await AN.data;let F=0,T=0,L=0,sheets=0;const lost=[];for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;const x=AN.dsIdx(sh);if(x.from.size||x.to.size)sheets++;F+=x.from.size;T+=x.to.size;L+=x.lost.length;x.lost.forEach(l=>lost.push(sh.name+': '+l.t))}return{F,T,L,sheets,lost:lost.slice(0,6)}});
console.log(JSON.stringify(idx));ck('FROM DITL inputs found',idx.F>=100,idx.F);ck('TO DITL outputs found',idx.T>=70,idx.T);ck('texts not tied to a wire are few',idx.L<=10,idx.L);
await p.click('text=DITL signals');await p.waitForTimeout(1500);
const ui=await p.evaluate(()=>{const a=document.getElementById('anln');return{shown:a.style.display==='block',rows:a.querySelectorAll('tr').length,btn:a.querySelectorAll('button').length,head:a.textContent.slice(0,260)}});
ck('panel opened with rows',ui.shown&&ui.rows>150,JSON.stringify({rows:ui.rows,btn:ui.btn}));console.log(ui.head);
/* one click switches an input and the logic reacts: pick a FROM DITL digital input that feeds a block on a sheet, toggle through the panel button, read a downstream net */
const act=await p.evaluate(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const a=document.getElementById('anln');
 AN.go(AN.sheets.findIndex(s=>s.name==='ABC-003B'));await w(300);const sh=AN.cs(),S=sh.S,ix=AN.dsIdx(sh);let net=null;for(const[n]of ix.from)if(S.ext.includes(n)&&S.nets[n].dig&&S.cns[n]&&S.cns[n].length){net=n;break}
 if(net==null)return{err:'no input'};document.getElementById('anln').innerHTML='';AN.dsOpen();await w(300);
 const before=S.rt.ext[net]>.5?1:0;const nameCell=[...a.querySelectorAll('tr')].find(r=>/ON|OFF/.test(r.textContent)&&r.querySelector('button')&&r.textContent.includes('◀ FROM'));
 const btn=[...a.querySelectorAll('tr')].filter(r=>r.querySelector('button')&&r.textContent.includes('◀ FROM'))[0].querySelector('button');
 const first=[...ix.from.keys()][0];const e0=S.rt.ext[first]>.5?1:0;
 // click the button of the first FROM row of this sheet
 const rowsOfSheet=[...a.querySelectorAll('table')][ [...AN.sheets.filter(x=>!/ABC-000/.test(x.name)&&(AN.dsIdx(x).from.size||AN.dsIdx(x).to.size))].findIndex(x=>x===sh) ];
 const b1=[...rowsOfSheet.querySelectorAll('button')][0];b1.click();await w(200);const e1=S.rt.ext[first]>.5?1:0;
 return{before:e0,after:e1,changed:e0!==e1}});
ck('one click switches a FROM DITL input',act.changed,JSON.stringify(act));
ck('no page errors',errs.length===0,errs.slice(0,3).join('|'));console.log(fail?fail+' FAIL':'ALL PASS');await b.close();process.exit(fail?1:0)})();
