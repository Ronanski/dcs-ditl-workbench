/* v1.20.10: global search (tag / address / description) with sheet list and "point to the place".  usage: node tools/test-search.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1700,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const R=[];const ok=(n,c,x)=>R.push((c?'PASS ':'FAIL ')+n+(x!==undefined?'  '+x:''));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const q=async t=>{await p.fill('#sidefl',t);await p.waitForFunction(()=>!/searching/.test((document.querySelector('#anhits .fh')||{}).textContent||'searching'),null,{timeout:60000});return p.evaluate(()=>({head:document.querySelector('#anhits .fh').textContent,btn:[...document.querySelectorAll('#anhits button')].map(x=>x.innerText.replace(/\n/g,' | '))}))};
let r=await q('AI0273');ok('an address is found with its description',r.btn.length>=1&&r.btn.some(x=>/AI0273/.test(x))&&r.btn.some(x=>/flue gas O2/i.test(x)),JSON.stringify(r.btn));
r=await q('flue gas o2');ok('search by DESCRIPTION finds the address',r.btn.some(x=>/AI0273|AI0433/.test(x)),r.btn.length+' hits');
r=await q('SI0054');ok('SI0054 is found on ABC-002',r.btn.length>=1,r.head);
await p.locator('#anhits button').first().dispatchEvent('click');await p.waitForTimeout(1200);
const st=await p.evaluate(()=>{const sh=AN.cs();const vb=document.getElementById('svg').getAttribute('viewBox').split(' ').map(Number);return{name:sh.name,w:vb[2],ring:!!document.querySelector('#svg circle[stroke-dasharray="3 2"]')}});
ok('a click opens the sheet, zooms to the place and shows a ring',/ABC-/.test(st.name)&&st.w<120&&st.ring,JSON.stringify(st));
r=await q('zzzqqq');ok('no result is reported honestly',/nothing/.test(r.head),r.head);
console.log(R.join('\n'));console.log('errs',errs);process.exitCode=R.some(x=>x.startsWith('FAIL'))||errs.length?1:0;await b.close()})();
