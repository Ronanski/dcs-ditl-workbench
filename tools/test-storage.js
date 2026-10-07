/* Simulates the user's PC: localStorage FULL. Settings + force must still survive F5 (IndexedDB), and also when IndexedDB is blocked too (window.name). usage: node test-storage.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');
const run=async(mode)=>{const b=await chromium.launch({args:['--no-sandbox']});const ctx=await b.newContext({viewport:{width:1920,height:1000}});
 await ctx.addInitScript((mode)=>{ // fill localStorage to the limit before the app starts, once per tab session
  try{if(!sessionStorage.getItem('filled')){let s='x'.repeat(1024*1024),i=0;try{while(i<12){localStorage.setItem('ditl.fill'+i,s);i++}}catch(e){}let c='x'.repeat(2000),j=0;try{while(j<5000){localStorage.setItem('ditl.pad'+j,c);j++}}catch(e){}try{let t='y'.repeat(20),q=0;while(q<20000){localStorage.setItem('ditl.z'+q,t);q++}}catch(e){}sessionStorage.setItem('filled','1')}}catch(e){}
  if(mode==='noidb'){try{Object.defineProperty(window,'indexedDB',{get(){throw new Error('blocked')}})}catch(e){}}},mode);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(process.argv[2]));await p.waitForTimeout(3000);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(4000);await p.evaluate(()=>{if(AN.view)document.querySelector('button[title^=\"View mode\"]').click()});
 const ls=await p.evaluate(()=>{try{localStorage.setItem('probe_x','1');localStorage.removeItem('probe_x');return 'ls writable'}catch(e){return 'ls FULL/blocked'}});
 await p.evaluate(()=>AN.go(AN.sheets.findIndex(s=>s.name==='ABC-050')));
 // change a setting + force an analog value
 await p.evaluate(()=>{AN.ws.dc='yellow';AN.ws.vc='cyan';AN.ws.vs=1.25});await p.evaluate(()=>{const S=AN.cs().S;const n=S.nets.find(n=>n.segs.length&&!n.dig&&!S.ext.includes(n.id)&&S.drv[n.id].some(d=>d.k==='AMT'||d.k==='SW')).id;window._n=n;S.rt.force[n]=42;});
 // use the real UI path so the save functions run: open style card and change one select, then force by button
 await p.click('text=Legend & style');await p.evaluate(()=>{const ss=[...document.querySelectorAll('#anlg select')];if(ss[0]){ss[0].value='yellow';ss[0].dispatchEvent(new Event('change'))}});
 const pos=await p.evaluate(()=>{const S=AN.cs().S,nm=AN.cs().name,n=window._n;const sg=S.seg[S.nets[n].segs[0]];const x=(sg.x1+sg.x2)/2,y=(sg.y1+sg.y2)/2;const svg=document.getElementById('svg');const w=40,r=svg.getBoundingClientRect(),h=w*r.height/r.width;AN.av[nm]=[x-w/2,-y-h/2,w,h];svg.setAttribute('viewBox',AN.av[nm].join(' '));const q=svg.createSVGPoint();q.x=x;q.y=-y;const m=q.matrixTransform(svg.getScreenCTM());delete S.rt.force[n];return{x:m.x,y:m.y}});
 await p.mouse.click(pos.x,pos.y);await p.waitForTimeout(300);
 await p.evaluate(()=>{const d=document.getElementById('ansel');d.querySelector('input[type=number]').value=42;[...d.querySelectorAll('button')].find(x=>x.textContent==='✓').click()});await p.waitForTimeout(500);
 const status=await p.evaluate(()=>document.querySelector('#anlg div[style*="line-height"]')?.textContent||'');
 await p.reload();await p.waitForTimeout(3500);await p.waitForTimeout(4000);
 const after=await p.evaluate(()=>{const sh=AN.cs();return {cat:AN.cat,run:AN.run,ws:AN.ws.dc,sheet:sh&&sh.name,force:sh&&sh.S?JSON.stringify(sh.S.rt.force):'noS'}});
 console.log(mode,'|',ls,'| status:',status.slice(0,170),'\n   after F5:',JSON.stringify(after),'errs',errs.length);await b.close()};
(async()=>{await run('idb');await run('noidb')})();
