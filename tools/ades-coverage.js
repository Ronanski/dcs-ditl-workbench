/* which address-like labels on the sheets have NO description, by prefix. usage: node tools/ades-coverage.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.adesLoad();const RX=/^(S\d\s*)?([A-Za-z]{1,3})\.?(\d{3,5})([A-Za-z])?$/;const hit={},miss={},ex={};
 for(let i=0;i<AN.sheets.length;i++){AN.go(i);const sh=AN.cs();if(!sh||!sh.S)continue;const seen=new Set();for(const t of sh.S.tx){const s=t.t.trim();if(seen.has(s))continue;seen.add(s);const m=RX.exec(s);if(!m)continue;const pre=m[2].toUpperCase();if(!['SI','TR','DI','I','O','B','M','AI','AO','PTN','FP','WM','WB'].includes(pre))continue;const f=AN.adesFind(sh,s);if(f)hit[pre]=(hit[pre]||0)+1;else{miss[pre]=(miss[pre]||0)+1;(ex[pre]=ex[pre]||[]).length<8&&ex[pre].push(sh.name+' '+s)}}}
 return{hit,miss,ex}});console.log(JSON.stringify(r,null,1));await b.close()})();
