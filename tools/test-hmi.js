/* HMI view: three modes (tab / float / split), widgets bound to addresses (button -> input, lamp reads, FORCE on a computed wire, faceplate PID / MAN, slider), auto page from a sheet, saved and restored after F5. usage: node tools/test-hmi.js <html> [shot-prefix] */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const ctx=await b.newContext({viewport:{width:1700,height:950}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const E=(f,a)=>p.evaluate(f,a);
/* 1. open, modes */
await p.click('button:has-text("HMI")');await p.waitForTimeout(500);
const geo=()=>E(()=>{const r=id=>{const e=document.getElementById(id);if(!e)return null;const b=e.getBoundingClientRect();return{w:Math.round(b.width),h:Math.round(b.height),x:Math.round(b.x),y:Math.round(b.y),disp:getComputedStyle(e).display,pos:getComputedStyle(e).position}};return{hmi:r('hmi'),cv:r('cv'),mode:AN.hmi.mode}});
let g=await geo();ck('HMI opens as its own view (Tab): diagram area hidden',g.mode==='tab'&&g.hmi.w>400&&g.cv.disp==='none',JSON.stringify(g));
await E(()=>AN.hmiSetMode('float'));await p.waitForTimeout(300);g=await geo();ck('Float: window over the diagram, diagram still visible',g.hmi.pos==='fixed'&&g.cv.disp!=='none'&&g.cv.w>300&&g.hmi.w>=320,JSON.stringify(g));
await E(()=>AN.hmiSetMode('split'));await p.waitForTimeout(300);g=await geo();ck('Split: beside the diagram, both visible, nothing covered',g.hmi.disp==='flex'&&g.cv.disp!=='none'&&g.hmi.x>=g.cv.x+g.cv.w-2&&g.hmi.w>300&&g.cv.w>300,JSON.stringify(g));
/* 2. widgets bound to addresses */
const r=await E(async()=>{await AN.data;const w=ms=>new Promise(r=>setTimeout(r,ms));AN.hmiSetMode('float');AN.go(AN.sheets.findIndex(s=>s.name==='ABC-003B'));await w(400);const sh=AN.cs(),S=sh.S,ix=AN.dsIdx(sh);let ref=null,net=null;for(const[n,rs]of ix.from)if(S.ext.includes(n)&&S.nets[n].dig&&!(S.xlk&&S.xlk[n])&&S.cns[n]&&S.cns[n].length){ref=rs[0];net=n;break}
 const o={ref,found:AN.hmiFind(ref).length};
 const btn=AN.hmiAdd('button',{x:20,y:20,label:'DITL in',addr:ref,sheet:'ABC-003B'}),lamp=AN.hmiAdd('lamp',{x:160,y:20,label:'same wire',addr:ref,sheet:'ABC-003B'}),num=AN.hmiAdd('num',{x:260,y:20,label:'num',addr:ref,sheet:'ABC-003B'});
 const tag=(()=>{for(const b of S.blk)if(b.k==='PID'){const t=(b.txt||[]).find(x=>/^[A-Z][A-Z0-9\-.]{2,}$/.test(x)&&!/^(PID|PIDV)$/i.test(x)&&!/^S\d-MDL/i.test(x));if(t)return t}})();o.pidTag=tag;
 const face=AN.hmiAdd('face',{x:20,y:100,addr:tag,sheet:'ABC-003B'});
 AN.hmiOpen('float');AN.hmiRender();await w(400);
 const before=S.rt.ext[net]>.5?1:0;const r1=document.querySelector('#hmicv g[data-id="'+btn.id+'"] rect');r1.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:1}));await w(400);
 o.before=before;o.after=S.rt.ext[net]>.5?1:0;AN.hmiUpd();const lampFill=document.querySelector('#hmicv g[data-id="'+lamp.id+'"] circle').getAttribute('fill');o.lampOn=lampFill!=='#2a343b';
 o.faceNets=document.querySelectorAll('#hmicv g[data-id="'+face.id+'"] text').length;o.faceTxt=[...document.querySelectorAll('#hmicv g[data-id="'+face.id+'"] text')].map(t=>t.textContent).join('|').slice(0,80);
 /* computed wire: FORCE */
 let comp=null;for(const l of S.lab){}
 const cands=[];S.lab.forEach((l,n)=>{if(l&&/^M\.[0-9A-F]{4}$/.test(l.t)&&!S.ext.includes(n)&&S.nets[n].dig&&(S.drv[n]||[]).some(d=>d.k!=='LINK'))cands.push({t:l.t,n})});
 if(cands.length){const c=cands[0],fb=AN.hmiAdd('button',{x:20,y:300,label:'force',addr:c.t,sheet:'ABC-003B'});AN.hmiRender();await w(200);const g=document.querySelector('#hmicv g[data-id="'+fb.id+'"]'),rr=g.querySelector('rect[data-ctl]'),fx=g.querySelector('rect[width="27"]');const pd=el=>el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:1}));
  pd(rr);await w(300);o.noForceOnClick=S.rt.force[c.n]===undefined;o.forceTag=c.t;
  pd(fx);await w(300);o.forced=S.rt.force[c.n]!==undefined;const v0=S.rt.force[c.n];pd(rr);await w(300);o.toggledWhileForced=S.rt.force[c.n]!==undefined&&S.rt.force[c.n]!==v0;
  pd(fx);await w(300);o.released=S.rt.force[c.n]===undefined}
 return o});
console.log(JSON.stringify(r));
ck('address "'+r.ref+'" found on the sheets',r.found>=1);ck('button writes the input (one click)',r.before!==r.after,r.before+' -> '+r.after);ck('lamp bound to the same wire follows',r.lampOn);
ck('faceplate of PID '+r.pidTag+' shows SV / PV / MV',r.faceNets>=6,r.faceTxt);ck('button on a computed wire is read only until F (FORCE) is pressed; forced it toggles; F again releases',r.noForceOnClick&&r.forced&&r.toggledWhileForced&&r.released,JSON.stringify([r.noForceOnClick,r.forced,r.toggledWhileForced,r.released,r.forceTag]));
/* 3. the sheets bound to widgets keep running */
const act=await E(()=>{AN.hmiSync();return{sheets:AN.hmiSheets,inSet:AN.actSet(AN.cs()).map(s=>s.name).length}});ck('sheets used by widgets are in the running set',act.sheets.length>=1,JSON.stringify(act));
await p.screenshot({path:(process.argv[3]||'/tmp/hmi')+'-float.png'});
/* 4. auto page from this sheet */
const au=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));AN.go(AN.sheets.findIndex(s=>s.name==='ABC-050'));await w(400);const n0=AN.hmi.pages.length;AN.hmiAuto();await w(300);const pg=AN.hmi.pages[AN.hmi.cur];return{pages:AN.hmi.pages.length-n0,name:pg.name,types:pg.widgets.reduce((a,x)=>(a[x.type]=(a[x.type]||0)+1,a),{})}});
ck('Auto page from the sheet: faceplates + DITL buttons / sliders',au.pages===1&&(au.types.face||0)>=1&&((au.types.button||0)+(au.types.slider||0))>=1,JSON.stringify(au));
await E(()=>AN.hmiSetMode('split'));await p.waitForTimeout(400);await p.screenshot({path:(process.argv[3]||'/tmp/hmi')+'-split.png'});
/* 5. saved + restored after F5 */
const saved=await E(()=>{return AN.hmi.pages.reduce((n,x)=>n+x.widgets.length,0)});await p.waitForTimeout(600);
await p.reload();await p.waitForTimeout(3000);if(await E(()=>AN.cat!=='an'))await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(4000);
const aft=await E(()=>({n:AN.hmi.pages.reduce((n,x)=>n+x.widgets.length,0),pages:AN.hmi.pages.length,mode:AN.hmi.mode}));ck('layout restored after F5',aft.n===saved&&aft.pages>=2,JSON.stringify({saved,aft}));
ck('no page errors',errs.length===0,errs.slice(0,3).join('|'));console.log(fail?fail+' FAIL':'ALL PASS');await b.close();process.exit(fail?1:0)})();
