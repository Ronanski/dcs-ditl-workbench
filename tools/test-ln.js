/* FX tables: strict station + LN, LX/LY editor, own reset, project file. usage: node tools/test-ln.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);await p.evaluate(()=>{if(AN.view)document.querySelector('button[title^=\"View mode\"]').click()});
const r1=await p.evaluate(()=>{let fx=0,ok=0;const warn=[];for(const sh of AN.sheets){const S=AN.ensure(sh);for(const x of S.blk){if(x.k!=='FX'||!x.p.ln)continue;fx++;if(x.p.tbl&&!x.p.lnWarn)ok++;if(x.p.lnWarn)warn.push(sh.name+' '+x.p.ln+' stn'+sh.stn+' -> '+(x.p.tbl?x.p.tbl.key:'none')+' : '+x.p.lnWarn.slice(0,70))}}return{fx,ok,warn}});
console.log('FX',r1.fx,'strict match without warning',r1.ok,'warnings',r1.warn.length);console.log(r1.warn.join('\n'));
// find an FX of S1-LN21 on ABC-003A and click it
const pos=await p.evaluate(()=>{AN.go(AN.sheets.findIndex(s=>s.name==='ABC-003A'));const S=AN.cs().S;const x=S.blk.find(b=>b.k==='FX'&&b.p.tbl&&b.p.tbl.key==='S1-LN21');return x?{id:x.id,cx:x.cx,cy:x.cy,key:x.p.tbl.key,i:x.i[0],o:x.o[0]}:null});console.log('FX block',JSON.stringify(pos));
await p.waitForTimeout(1200);
await p.evaluate(([cx,cy])=>{AN.av['ABC-003A']=[cx-40,-cy-25,80,50];document.getElementById('svg').setAttribute('viewBox',[cx-40,-cy-25,80,50].join(' '))},[pos.cx,pos.cy]);await p.waitForTimeout(400);
const pt=await p.evaluate(([cx,cy])=>{const svg=document.getElementById('svg'),m=svg.getScreenCTM(),q=svg.createSVGPoint();q.x=cx;q.y=-cy;const r=q.matrixTransform(m);return{x:r.x,y:r.y}},[pos.cx,pos.cy]);
await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(700);
const out=async(x)=>p.evaluate(([i,o,x])=>{const S=AN.cs().S;S.rt.force[i]=x;for(let k=0;k<6;k++)AN.settle();return S.rt.v[o]},[pos.i,pos.o,x]);
const y0=await out(75);
await p.click('button:has-text("Edit table")');await p.waitForTimeout(300);
const rows=await p.locator('#anp div.r input[type=number]').count();console.log('editor inputs',rows);
// LY of row 15 (x=100%) : 120 -> 90
const lyBox=p.locator('#anp div.r input[type=number]').nth(2*14+1);console.log('row15 LY before',await lyBox.inputValue());
await lyBox.click();await lyBox.fill('90');await lyBox.press('Enter');await p.waitForTimeout(500);
const y1=await out(75);console.log('x=75 -> y before',y0.toFixed(3),'after editing LY(15)=90%',y1.toFixed(3),y1<y0?'OK (lower)':'CHECK');
// global reset must NOT clear the edit
await p.click('#anbar button:has-text("Reset")');await p.waitForTimeout(500);const y2=await out(75);console.log('after global Reset: y',y2.toFixed(3),Math.abs(y2-y1)<1e-6?'OK (edit kept)':'FAIL (edit lost)');
// project save / open keeps it
const keep=await p.evaluate(async()=>{window.__f={};window.showSaveFilePicker=async o=>({name:o.suggestedName,createWritable:async()=>({write:async t=>{window.__f.txt=t},close:async()=>{}})});[...document.querySelectorAll('button')].find(x=>/Save$/.test(x.textContent)).click();await new Promise(r=>setTimeout(r,600));const o=JSON.parse(window.__f.txt);return Object.keys(o.ln||{})});console.log('project file ln keys',keep);
// table reset (the panel was rebuilt by Reset: select the block again and open the editor)
await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(600);await p.click('button:has-text("Edit table")');await p.waitForTimeout(300);await p.click('button:has-text("Reset this table")');await p.waitForTimeout(500);const y3=await out(75);console.log('after "Reset this table": y',y3.toFixed(3),Math.abs(y3-y0)<1e-6?'OK (back to the DCS value)':'FAIL');
console.log('errs',errs);await b.close()})();
