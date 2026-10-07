/* Worst case PC: localStorage blocked, IndexedDB blocked, window.name used by someone else. Only the address bar can keep the settings. usage: node test-storage2.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const ctx=await b.newContext({viewport:{width:1920,height:1000}});
 await ctx.addInitScript(()=>{const t=()=>{throw new DOMException('blocked','SecurityError')};try{Object.defineProperty(window,'localStorage',{get:t})}catch(e){}try{Object.defineProperty(window,'indexedDB',{get:t})}catch(e){}if(!window.name)window.name='someone-else'});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(process.argv[2]));await p.waitForTimeout(3000);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(4000);await p.evaluate(()=>{if(AN.view)document.querySelector('button[title^=\"View mode\"]').click()});
 await p.evaluate(()=>AN.go(AN.sheets.findIndex(s=>s.name==='ABC-050')));
 await p.click('text=Legend & style');await p.evaluate(()=>{const ss=[...document.querySelectorAll('#anlg select')];ss[0].value='yellow';ss[0].dispatchEvent(new Event('change'));ss[3].value='cyan';ss[3].dispatchEvent(new Event('change'))});
 const pos=await p.evaluate(()=>{const S=AN.cs().S,nm=AN.cs().name;const n=S.nets.find(n=>n.segs.length&&!n.dig&&!S.ext.includes(n.id)&&S.drv[n.id].some(d=>d.k==='AMT'||d.k==='SW')).id;window._n=n;const sg=S.seg[S.nets[n].segs[0]];const x=(sg.x1+sg.x2)/2,y=(sg.y1+sg.y2)/2;const svg=document.getElementById('svg');const w=40,r=svg.getBoundingClientRect(),h=w*r.height/r.width;AN.av[nm]=[x-w/2,-y-h/2,w,h];svg.setAttribute('viewBox',AN.av[nm].join(' '));const q=svg.createSVGPoint();q.x=x;q.y=-y;const m=q.matrixTransform(svg.getScreenCTM());return{x:m.x,y:m.y}});
 await p.mouse.click(pos.x,pos.y);await p.waitForTimeout(300);
 await p.evaluate(()=>{const d=document.getElementById('ansel');d.querySelector('input[type=number]').value=42;[...d.querySelectorAll('button')].find(x=>x.textContent==='✓').click()});await p.waitForTimeout(800);
 console.log('url hash set:',await p.evaluate(()=>location.hash.slice(0,30)+'... ('+location.hash.length+' chars)'));
 await p.reload();await p.waitForTimeout(3500);await p.waitForTimeout(4000);
 console.log('after F5:',JSON.stringify(await p.evaluate(()=>{const sh=AN.cs();return {cat:AN.cat,src:AN._src,dc:AN.ws.dc,ac:AN.ws.ac,sheet:sh&&sh.name,force:sh&&sh.S?JSON.stringify(sh.S.rt.force):'noS'}})),'errs',errs.length);
 await b.close()})();
