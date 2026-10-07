/* project file: save -> change -> open restores; Ctrl+S; fallback download. usage: node test-project.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);await p.evaluate(()=>{if(AN.view)document.querySelector('button[title^=\"View mode\"]').click()});
const r=await p.evaluate(async()=>{const out={};window.__f={};
 window.showSaveFilePicker=async o=>({name:o.suggestedName,createWritable:async()=>({write:async t=>{window.__f.txt=t},close:async()=>{}})});
 AN.go(AN.sheets.findIndex(s=>s.name==='ABC-050'));const S=AN.cs().S;const n=S.ext.find(n=>!S.nets[n].dig);S.rt.force[n]=42;{const o=AN.sv['ABC-050']&&AN.sv['ABC-050'].pv?AN.sv['ABC-050']:(AN.sv['ABC-050']={pv:12});o.force={[n]:42}}AN.settle();
 const sv=[...document.querySelectorAll('button')].find(x=>/Save$/.test(x.textContent));sv.click();await new Promise(r=>setTimeout(r,500));
 out.saved=!!window.__f.txt;const o=JSON.parse(window.__f.txt);out.keys=Object.keys(o).join(',');out.hasForce=JSON.stringify(o.sv['ABC-050']||{}).includes('42');
 // change state then open
 delete S.rt.force[n];S.rt.ext[n]=7;AN.settle();
 window.showOpenFilePicker=async()=>[{name:'x.json',getFile:async()=>({text:async()=>window.__f.txt}),createWritable:async()=>({write:async t=>{window.__f.txt=t},close:async()=>{}})}];
 [...document.querySelectorAll('button')].find(x=>/Open$/.test(x.textContent)).click();await new Promise(r=>setTimeout(r,1500));
 const S2=AN.cs().S;out.sheet=AN.cs().name;out.forceBack=S2.rt.force[n];out.label=[...document.querySelectorAll('#anbar span')].map(x=>x.textContent).find(t=>/x.json/.test(t));
 // Ctrl+S
 window.__f.txt=null;document.dispatchEvent(new KeyboardEvent('keydown',{key:'s',ctrlKey:true,bubbles:true}));await new Promise(r=>setTimeout(r,400));out.ctrlS=!!window.__f.txt;
 return out});
console.log(JSON.stringify(r),'errs',errs);await b.close()})();
