/* Bad Signal control: OFF by default, force ON -> FORCED BAD mark on the diagram + panel, OFF -> normal again; the zero reading is not bad.  usage: node tools/test-ui-sigab.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const R=[];const ok=(n,c,x)=>{R.push((c?'PASS ':'FAIL ')+n+(x?' '+x:''));};
await p.evaluate(()=>{AN.go(AN.sheets.findIndex(s=>s.name==='ABC-002'));const bt=document.querySelector('button[title^="Run"]');});
await p.waitForTimeout(800);
const info=await p.evaluate(()=>{const S=AN.cs().S;const ai=S.blk.filter(b=>b.k==='AI'&&b.sig);return{n:ai.length,ids:ai.slice(0,2).map(a=>[a.id,a.sig.id]),allOff:ai.every(a=>!S.rt.st[a.sig.id].val)}});
ok('transmitters with a SIG.AB flag found on ABC-002',info.n>0,info.n);ok('Bad Signal is OFF by default on all of them',info.allOff);
const [aid,sid]=info.ids[0];
const marks0=await p.evaluate(()=>document.querySelectorAll('#badmarks text').length);ok('no BAD mark while OFF',marks0===0);
// the panel button of the flag
const btn=p.locator('#anp button:has-text("Bad Signal: OFF")').first();ok('panel has Bad Signal buttons',await btn.count()>0);
await btn.dispatchEvent('click');await p.waitForTimeout(600);
const st1=await p.evaluate(([s])=>({v:AN.cs().S.rt.st[s].val,m:[...document.querySelectorAll('#badmarks text')].map(t=>t.textContent),btn:[...document.querySelectorAll('#anp button')].some(x=>/FORCED BAD/.test(x.textContent))}),[sid]);
ok('force ON sets the flag',st1.v===1);ok('diagram shows FORCED BAD',st1.m.includes('FORCED BAD'),JSON.stringify(st1.m));ok('panel button shows FORCED BAD',st1.btn);
await p.locator('#anp button:has-text("FORCED BAD")').first().dispatchEvent('click');await p.waitForTimeout(600);
const st2=await p.evaluate(([s])=>({v:AN.cs().S.rt.st[s].val,m:document.querySelectorAll('#badmarks text').length}),[sid]);
ok('restore normal clears the flag',st2.v===0);ok('restore normal clears the mark',st2.m===0);
// zero reading is not bad
const z=await p.evaluate(([a,s])=>{const S=AN.cs().S;S.rt.st[a].val=0;AN.settle();return S.rt.st[s].val},[aid,sid]);ok('a zero reading does not set Bad Signal',z===0);
console.log(R.join('\n'));console.log('errs',errs);process.exitCode=R.some(x=>x.startsWith('FAIL'))||errs.length?1:0;await b.close()})();
