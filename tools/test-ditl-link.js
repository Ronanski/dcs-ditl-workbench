/* Link to the DITL page: every "FROM / TO DITL pp-nn" reference of the ABC sheets opens the DITL page at its sheet (from the DITL signals list and from the circle that carries the text). usage: node tools/test-ditl-link.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;const refs=new Set(),bad=[];for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;const Sx=AN.ensure(sh);for(const t of Sx.tx){const m=/DITL\s*([0-9]{2}[A-Z]?)\s*-\s*(\d+)/i.exec(t.t);if(m)refs.add('DITL '+m[1]+'-'+m[2])}}
 const names=()=>document.body.classList.contains('an');let ok=0;for(const r of refs){AN.dsGoRef(r);await new Promise(x=>setTimeout(x,5));const cat=AN.cat,nm=document.getElementById('shsel')&&document.getElementById('shsel').selectedOptions[0]&&document.getElementById('shsel').selectedOptions[0].textContent;if(cat==='dig'&&nm){ok++}else bad.push(r+' '+cat+' '+nm)}
 return{n:refs.size,ok,bad:bad.slice(0,8)}});
console.log(JSON.stringify(r));ck('every DITL reference opens a DITL sheet',r.ok===r.n,JSON.stringify(r.bad));
/* circle with a DITL text */
await p.evaluate(async()=>{document.querySelectorAll('.cat button')[1].click();await new Promise(x=>setTimeout(x,600))});
const c=await p.evaluate(async()=>{for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;const S=AN.ensure(sh);for(const cc of(S.conn||[]).concat(S.xc||[])){const t=S.tx.find(z=>/DITL\s*[0-9]{2}[A-Z]?\s*-\s*\d+/i.test(z.t)&&Math.hypot(z.x-cc.x,z.y-cc.y)<cc.r+30);if(t&&cc.nets&&cc.nets[0]!=null){AN.go(AN.sheets.indexOf(sh));await new Promise(x=>setTimeout(x,400));AN.connClick(cc);await new Promise(x=>setTimeout(x,300));return{sheet:sh.name,text:t.t,cat:AN.cat}}}}return null});
console.log(JSON.stringify(c));ck('click on a circle with "FROM / TO DITL" opens the DITL page',c&&c.cat==='dig');
ck('no page errors',errs.length===0,errs.slice(0,2).join('|'));console.log(fail?fail+' FAIL':'ALL PASS');await b.close();process.exit(fail?1:0)})();
