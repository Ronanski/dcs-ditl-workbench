/* Real-mouse checks (user report 2026-10-08): the panel must not grow by itself; HMI buttons / sliders must work with a real click in VIEW, PAUSE and RUN; the PV driven by the process model must not look forced. usage: node tools/test-ui-real.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const E=(f,a)=>p.evaluate(f,a);
await E(async()=>{await AN.data;AN.go(AN.sheets.findIndex(s=>s.name==='ABC-017'))});await p.waitForTimeout(500);
/* panel width */
await E(()=>{if(AN.view)document.querySelector('button[title^="View mode"]').click();const S=AN.cs().S,b=S.blk.find(x=>x.k==='PID');AN.sel={blk:b};AN.selBox();AN.panelUpd(true)});
await p.click('#anbar button:has-text("Run")');const W=()=>E(()=>document.getElementById('anp').getBoundingClientRect().width);const ws=[await W()];for(let i=0;i<10;i++){await p.waitForTimeout(1200);ws.push(await W())}
ck('panel width stays the same while running with a PID selected (12 s)',Math.max(...ws)-Math.min(...ws)<4,ws.map(Math.round).join(' '));
/* the plant writes the transmitter, it forces nothing: no forced point, the transmitter slider is disabled */
const pf=await E(()=>{const S=AN.cs().S;const forced=Object.keys(S.rt.force).filter(k=>S.rt.force[k]!==undefined).length;const pr=S.procs.map(b=>b.proc.mode);return{forced,modes:pr}});
ck('the plant model forces nothing (it writes the transmitter)',pf.forced===0&&pf.modes.includes('transmitter'),JSON.stringify(pf));
await E(()=>{AN.go(AN.sheets.indexOf(AN.cs()));AN.sel=null;AN.selBox();AN.panelUpd(true)});await p.waitForTimeout(300);
const ai=await E(()=>{const r=[...document.querySelectorAll('#anp input[type=range]')].filter(x=>x.disabled).length;return{disabledSliders:r}});
ck('the transmitter slider that the plant drives is disabled',ai.disabledSliders>=1,JSON.stringify(ai));
/* HMI real clicks */
await E(()=>{AN.hmiOpen('tab');AN.hmiAuto()});await p.waitForTimeout(600);
async function trial(tag){const r=await E(()=>{const pg=AN.hmi.pages[AN.hmi.cur],o={};for(const t of['slider','button']){const w=pg.widgets.find(x=>x.type===t),g=document.querySelector('#hmicv g[data-id="'+w.id+'"]'),rc=g.getBoundingClientRect(),k=AN.hmiPick(w);o[t]={id:w.id,x:rc.x,y:rc.y,w:rc.width,h:rc.height,v:k.sh.S.rt.ext[k.n]}}return o});
 const rd=id=>E(i=>{const w=AN.hmi.pages[AN.hmi.cur].widgets.find(x=>x.id===i),k=AN.hmiPick(w);return k.sh.S.rt.ext[k.n]},id);
 await p.mouse.click(r.button.x+r.button.w/2,r.button.y+r.button.h/2);await p.waitForTimeout(300);const b1=await rd(r.button.id);
 const f=({RUN:.8,PAUSE:.35,x:.55})[tag];await p.mouse.click(r.slider.x+r.slider.w*f,r.slider.y+r.slider.h*.6);await p.waitForTimeout(300);const s1=await rd(r.slider.id);
 ck('HMI real click, '+tag+': button toggles, slider moves',b1!==r.button.v&&Math.abs(s1-r.slider.v)>1e-6,JSON.stringify({b:[r.button.v,b1],s:[r.slider.v,s1]}))}
await trial('RUN');await p.click('#anbar button:has-text("Pause")');await p.waitForTimeout(300);await trial('PAUSE');
await E(()=>{if(!AN.view)document.querySelector('button[title^="View mode"]').click()});await p.waitForTimeout(300);await trial('x');
ck('no page errors',errs.length===0,errs.slice(0,3).join('|'));console.log(fail?fail+' FAIL':'ALL PASS');await b.close();process.exit(fail?1:0)})();
