/* descriptions on hover, on selected blocks (SIG.AB), on wires. usage: node tools/test-addr-ui.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
await p.evaluate(()=>AN.go(AN.sheets.findIndex(s=>s.name==='ABC-052')));await p.waitForTimeout(1000);
let bad=0;const T=(k,ok,x)=>{if(!ok)bad++;console.log((ok?'OK  ':'FAIL')+' '+k+(x!==undefined?'  '+x:''))};
const at=async tag=>{const pos=await p.evaluate(tag=>{const S=AN.cs().S;const t=S.tx.find(q=>q.t.trim()===tag);if(!t)return null;const w=90,h=w*.55;const v=[t.x-w/2,-t.y-h/2,w,h];AN.av['ABC-052']=v;document.getElementById('svg').setAttribute('viewBox',v.join(' '));return{x:t.x,y:t.y,h:t.h||2.6,n:t.t.trim().length}},tag);if(!pos)return null;await p.waitForTimeout(250);return p.evaluate(({x,y,h,n})=>{const m=document.getElementById('svg').getScreenCTM();return{x:m.a*(x+n*h*.3)+m.e,y:m.d*(-(y+h*.4))+m.f}},pos)};
const card=id=>p.evaluate(id=>{const c=document.getElementById(id);return c&&getComputedStyle(c).display!=='none'?c.innerText:null},id);
for(const tag of ['SI0254','B.1070','I.0937','M.072B','O.0001']){const pt=await at(tag);if(!pt){console.log('   (no text '+tag+' on this sheet)');continue}await p.mouse.move(pt.x,pt.y);await p.waitForTimeout(250);const c=await card('anhov');T('hover '+tag+' shows a description',!!c,c&&c.replace(/\n/g,' | ').slice(0,110));await p.mouse.move(5,5)}
// select the SIG.AB block
const pt=await at('B.1070');await p.mouse.click(pt.x-15,pt.y+8);await p.waitForTimeout(400);
const sel=await p.evaluate(()=>AN.sel&&AN.sel.blk&&AN.sel.blk.k);const c=await card('antag');T('selected block '+sel+' shows the card',!!c,c&&c.replace(/\n/g,' | ').slice(0,110));
console.log('errs',errs,'bad',bad);await b.close()})();
