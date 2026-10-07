/* the Android bridge in android/www/index.html with a MOCK Capacitor: Save goes through writeFile + Share, Open through a file chooser. usage: node tools/test-android-bridge.js */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1000,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.__calls=[];window.Capacitor={Plugins:{Filesystem:{writeFile:async o=>{__calls.push(['writeFile',o.path,o.directory,o.data.length]);return{}},getUri:async o=>({uri:'file:///cache/'+o.path})},Share:{share:async o=>{__calls.push(['share',o.files[0]]);return{}}}}}});
await p.goto('file://'+path.resolve(__dirname,'../android/www/index.html'));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{const o={native:typeof window.nativeFS};[...document.querySelectorAll('button')].find(x=>/Save$/.test(x.textContent)).click();await new Promise(r=>setTimeout(r,800));o.calls=window.__calls;o.msg=(document.getElementById('msg')||{}).textContent;return o});
console.log(JSON.stringify(r),errs);await b.close()})();
