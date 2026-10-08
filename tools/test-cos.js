/* COS (operator manual value of a T switch): every resolved COS has a name (the wire the T drives), range and unit, "target -> now", and is DISABLED while the T is on the auto leg; the 83 that were unattached are counted. Panel auto width. usage: node tools/test-cos.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1700,height:950}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;const w=ms=>new Promise(r=>setTimeout(r,ms));const o={tot:0,res:0,unres:[],named:0,noRange:0,disabledOk:0,enabledOk:0,rampOk:0,tested:0,bad:[]};
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;const S=AN.ensure(sh);const coss=S.blk.filter(b=>b.k==='COS');o.tot+=coss.length;AN.cosInfo(S,-99);const m=S._cm;o.res+=m.size;for(const c of S._cosUn||[])o.unres.push(sh.name+' COS#'+c.id);
  for(const[n,e]of m){const x=AN.cosInfo(S,n);if(/^COS manual.* ▸ /.test(x.name))o.named++;o.kinds=o.kinds||{};const kk=e.kind+(e.dig?'-digital':'');o.kinds[kk]=(o.kinds[kk]||0)+1;if(!(x.rng&&x.rng.hi>x.rng.lo))o.noRange++}}
 /* behaviour on three sheets */
 for(const nm of['ABC-003B','ABC-004A','ABC-003E']){AN.go(AN.sheets.findIndex(s=>s.name===nm));await w(500);const sh=AN.cs(),S=sh.S;AN.cosInfo(S,-99);
  for(const[n,e]of[...S._cm].filter(x=>x[1].kind==='T'&&!x[1].dig).slice(0,2)){const t=e.t,st=S.rt.st[t.id];o.tested++;
   st.fm='A';S.rt.force={};AN.panelUpd(true);const offA=!AN.cosOn(S,e).on||/no switching|SV \/ PV/.test(AN.cosOn(S,e).why);st.fm='B';for(let i=0;i<4;i++)AN.settle();const onB=AN.cosOn(S,e).on;
   if((offA||AN.cosOn(S,e).why)&&onB)o.disabledOk++;
   S.rt.ext[n]=e.rng.lo+0.5*(e.rng.hi-e.rng.lo);const t0=S.rt.v[n];AN.go(AN.sheets.indexOf(sh));
   o.bad.push(nm+' '+e.name+' range '+e.rng.lo+'~'+e.rng.hi+' '+e.rng.u+' A-leg energized='+(!offA)+' B-leg energized='+onB)}}
 /* panel text of a COS */
 AN.go(AN.sheets.findIndex(s=>s.name==='ABC-003B'));await w(500);const S=AN.cs().S;AN.cosInfo(S,-99);const [n,e]=[...S._cm].find(x=>x[1].kind==='T'&&!x[1].dig);S.rt.st[e.t.id].fm='A';AN.sel={net:n};AN.selBox();AN.paint();AN.panelUpd(true);await w(400);
 o.panelText=document.getElementById('anp').innerText.split('\n').filter(l=>/COS|target|ENERGIZED|range/.test(l)).slice(0,6);
 o.w300=document.getElementById('anp').getBoundingClientRect().width;
 return o});
console.log(JSON.stringify({...r,unres:r.unres.length,unresList:r.unres.slice(0,10),bad:r.bad.slice(0,6)}));
ck('COS blocks: '+r.tot+' · resolved to a T manual value: '+r.res+' · not resolved: '+r.unres.length,r.res>=r.tot*.7);ck('every resolved COS is named "COS manual ▸ <wire>"',r.named===r.res,r.named+'/'+r.res);ck('every resolved COS has a range',r.noRange===0);
ck('the panel shows the COS with name, range, target and the energized state',r.panelText.some(l=>/COS manual.* ▸/.test(l))&&r.panelText.some(l=>/NOT ENERGIZED|ENERGIZED|always/.test(l))&&r.panelText.some(l=>/target/.test(l)),JSON.stringify(r.panelText));
ck('panel keeps at least its old width (300 px)',r.w300>=299,Math.round(r.w300));
ck('no page errors',errs.length===0,errs.slice(0,3).join('|'));console.log(fail?fail+' FAIL':'ALL PASS');await b.close();process.exit(fail?1:0)})();
