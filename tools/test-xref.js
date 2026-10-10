/* v1.20.10: the cross-sheet texts (FROM DITL .. / TO DITL .. / ABC-xxx) are links.  usage: node tools/test-xref.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const R=[];const ok=(n,c,x)=>R.push((c?'PASS ':'FAIL ')+n+(x!==undefined?'  '+x:''));
const go=async n=>{await p.evaluate(n=>{if(AN.cat!=='an')document.querySelector('#catAn,[data-cat=an]');AN.go(AN.sheets.findIndex(x=>x.name===n))},n);await p.waitForTimeout(600)};
const names=await p.evaluate(()=>AN.sheets.map(s=>s.name));let tot=0,zero=[];
for(const n of names){await go(n);const c=await p.evaluate(()=>AN.dbgL.nXref||0);tot+=c;if(!c&&!/ABC-000/.test(n))zero.push(n)}
ok('links exist on the sheets (count)',tot>100,tot);
await go('ABC-003B');
const t=await p.evaluate(()=>{const g=document.querySelector('svg g.xref');return g?g.querySelectorAll('rect').length:0});ok('ABC-003B has link areas',t>=4,t);
// click a "FROM DITL" link
const r1=await p.evaluate(()=>{const S=AN.cs().S;const tx=S.tx.find(q=>/FROM DITL 02-63/.test(q.t));const rects=[...document.querySelectorAll('svg g.xref rect')];const hit=rects.find(r=>r.querySelector('title').textContent==='Go to DITL-02');if(!hit)return 'none';const r=hit.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});if(r1!=='none')await p.mouse.click(r1.x,r1.y);
await p.waitForTimeout(800);
const dg=await p.evaluate(()=>({cat:AN.cat,sel:document.getElementById('shsel').selectedOptions[0].textContent}));ok('FROM DITL 02-63 opens the digital page DITL-02',r1!=='none'&&dg.cat==='dig'&&/DITL-02$/.test(dg.sel),JSON.stringify(dg));
await p.evaluate(()=>{[...document.querySelectorAll('button')].find(x=>/Analog · ABC/.test(x.textContent)).click()});await p.waitForTimeout(1000);
// the sheet index ABC-000A links to the sheet
await go('ABC-000A');
const r2=await p.evaluate(()=>{const hit=[...document.querySelectorAll('svg g.xref rect')].find(r=>r.querySelector('title').textContent==='Go to ABC-002');if(!hit)return 'none';const r=hit.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});if(r2!=='none')await p.mouse.click(r2.x,r2.y);await p.waitForTimeout(700);
const cur=await p.evaluate(()=>AN.cs().name);ok('index ABC-000A: the text ABC-002 opens ABC-002',cur==='ABC-002',cur);
console.log(R.join('\n'));console.log('sheets without links (informational):',zero.length,'errs',errs);process.exitCode=R.some(x=>x.startsWith('FAIL'))||errs.length?1:0;await b.close()})();
