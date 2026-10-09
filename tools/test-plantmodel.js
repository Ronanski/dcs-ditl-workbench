/* Plant model switch (v1.20.7): OFF by default; the button "Plant model" turns the process model of every sheet on / off; OFF = no PV is written by the model, transmitters stay what the user typed. usage: node tools/test-plantmodel.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));let bad=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)bad++};
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const btn=()=>p.evaluate(()=>[...document.querySelectorAll('#anbar button')].find(x=>/^Plant model/.test(x.textContent)).textContent);
ok(/OFF/.test(await btn()),'button says "'+await btn()+'" at start');
const cnt=()=>p.evaluate(async()=>{await AN.data;let on=0,all=0;for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;const S=AN.ensure(sh);for(const x of S.procs||[]){all++;if(x.proc.on)on++}}return{on,all,flag:AN.plantOn}});
let c=await cnt();ok(c.on===0&&c.all>0&&c.flag===false,'default: 0 of '+c.all+' process models on');
/* PID loop sheet: with the model OFF the PV (transmitter) does not move by itself */
const pv=async()=>p.evaluate(async()=>{const sh=AN.sheets.find(s=>s.name==='ABC-017');AN.go(AN.sheets.indexOf(sh));await new Promise(r=>setTimeout(r,700));if(AN.view)document.querySelector('button[title^="View mode"]').click();const S=sh.S;const ai=S.blk.find(q=>q.k==='AI'&&!q.fb);const st=S.rt.st[ai.id];st.val=st.act=30;const bt=[...document.querySelectorAll('#anbar button')].find(x=>/Run/.test(x.textContent));bt&&bt.click();await new Promise(r=>setTimeout(r,4000));return{act:st.act,val:st.val,on:(S.procs||[]).filter(x=>x.proc.on).length}});
let r=await pv();ok(r.on===0&&Math.abs(r.act-30)<1e-6,'plant OFF: transmitter stays 30 ('+r.act+')');
await p.evaluate(()=>[...document.querySelectorAll('#anbar button')].find(x=>/^Plant model/.test(x.textContent)).click());await p.waitForTimeout(400);
ok(/ON/.test(await btn()),'button says "'+await btn()+'" after a click');c=await cnt();ok(c.on>0&&c.flag===true,'ON: '+c.on+' of '+c.all+' process models on');
await p.evaluate(()=>[...document.querySelectorAll('#anbar button')].find(x=>/^Plant model/.test(x.textContent)).click());await p.waitForTimeout(400);
c=await cnt();ok(c.on===0&&c.flag===false,'OFF again: '+c.on+' on');
ok(errs.length===0,'no page errors '+errs.join('|'));console.log(bad?'FAIL':'ALL PASS');await b.close();process.exit(bad?1:0)})();
