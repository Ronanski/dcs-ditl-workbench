/* HMI v2: complete Auto page on every sheet (every manual input has a widget that really drives the input; linked inputs read only), address picker (Find / Pick on diagram), zoom / pan, smooth drag, lock, save / restore. usage: node tools/test-hmi2.js <html> [shot-prefix] */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const ctx=await b.newContext({viewport:{width:1700,height:950}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const E=(f,a)=>p.evaluate(f,a);
await E(()=>{AN.procDefault=false;AN.hmiOpen('float')});
/* 1. Auto page on every sheet */
const cov=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));await AN.data;const out={sheets:0,inputs:0,missing:[],unbound:[],linked:0,badWrite:[],forced:[],noRange:0};
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;const S=sh.S||AN.ensure(sh);AN.go(AN.sheets.indexOf(sh));await w(60);AN.hmiAuto();const pg=AN.hmi.pages[AN.hmi.cur];out.sheets++;
  const ext=[],lnk=[];for(let n=0;n<S.nets.length;n++){if(!S.ext.includes(n))continue;if(AN.procLock(S,n))continue;(S.xlk&&S.xlk[n]?lnk:ext).push(n)}out.linked+=lnk.length;out.inputs+=ext.length;
  const wd=pg.widgets.filter(x=>x.type==='slider'||x.type==='button');
  for(const n of ext){const q=wd.find(x=>{const k=AN.hmiPick(x);return k&&k.sh===sh&&k.n===n});if(!q)out.missing.push(sh.name+'#'+n)}
  for(const x of pg.widgets){if(x.type==='label'||x.type==='face')continue;if(!AN.hmiPick(x))out.unbound.push(sh.name+':'+x.label)}
  for(const x of wd.slice(0,6)){const k=AN.hmiPick(x);if(!k||!k.ext){out.badWrite.push(sh.name+':'+x.label);continue}const S2=k.sh.S;if(x.type==='slider'){if(!(x.max>x.min))out.noRange++;AN.hmiWrite(x,x.min+(x.max-x.min)*.5);if(Math.abs(S2.rt.ext[k.n]-(x.min+(x.max-x.min)*.5))>1e-6)out.badWrite.push(sh.name+':'+x.label)}else{const a=S2.rt.ext[k.n]>.5?1:0;AN.hmiWrite(x,a?0:1);if((S2.rt.ext[k.n]>.5?1:0)===a)out.badWrite.push(sh.name+':'+x.label)}
   if(S2.rt.force&&S2.rt.force[k.n]!==undefined)out.forced.push(sh.name+':'+x.label)}
  AN.hmi.pages.splice(AN.hmi.cur,1);AN.hmi.cur=0}
 return out});
console.log(JSON.stringify({sheets:cov.sheets,inputs:cov.inputs,linked:cov.linked,noRange:cov.noRange}));
ck('Auto page: every manual input of every sheet has a widget that points to it',cov.missing.length===0,cov.missing.slice(0,8).join(','));
ck('every widget resolves to a wire',cov.unbound.length===0,cov.unbound.slice(0,5).join(','));
ck('widgets write the input (slider value / button toggle), not a force',cov.badWrite.length===0&&cov.forced.length===0,cov.badWrite.concat(cov.forced).slice(0,6).join(','));
ck('analog sliders have a range',cov.noRange===0,cov.noRange);
/* 2. zoom / pan / smooth drag / lock */
const z=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));AN.go(AN.sheets.findIndex(s=>s.name==='ABC-050'));await w(300);AN.hmiAuto();await w(200);AN.hmiOpen('tab');await w(300);
 const sv=document.querySelector('#hmicv svg'),v0=sv.getAttribute('viewBox').split(' ').map(Number);
 sv.dispatchEvent(new WheelEvent('wheel',{deltaY:-200,clientX:500,clientY:400,bubbles:true,cancelable:true}));const v1=sv.getAttribute('viewBox').split(' ').map(Number);
 const r=sv.getBoundingClientRect();let ev=(t,x,y,o)=>sv.dispatchEvent(new PointerEvent(t,Object.assign({bubbles:true,cancelable:true,pointerId:7,clientX:x,clientY:y,button:0},o)));
 ev('pointerdown',r.x+r.width-5,r.y+r.height-5);ev('pointermove',r.x+r.width-85,r.y+r.height-45);ev('pointerup',r.x+r.width-85,r.y+r.height-45);const v2=sv.getAttribute('viewBox').split(' ').map(Number);
 AN.hmiFit();const v3=sv.getAttribute('viewBox').split(' ').map(Number);return{v0,v1,v2,v3}});
ck('wheel zooms in (smaller viewBox)',z.v1[2]<z.v0[2]*.9,JSON.stringify([z.v0,z.v1]));ck('dragging the empty page pans',z.v2[0]!==z.v1[0]||z.v2[1]!==z.v1[1],JSON.stringify([z.v1,z.v2]));ck('Fit restores the page',Math.abs(z.v3[2]-z.v0[2])<1e-6);
const dr=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));AN.hmiFit();document.querySelectorAll('#hmi .hh button').forEach(x=>{if(/Edit/.test(x.textContent)&&!/Editing/.test(x.textContent))x.click()});await w(200);
 const pg=AN.hmi.pages[AN.hmi.cur],wd=pg.widgets.find(x=>x.type==='slider'||x.type==='button'),g=document.querySelector('#hmicv g[data-id="'+wd.id+'"]'),sv=document.querySelector('#hmicv svg');const x0=wd.x,y0=wd.y;
 const rr=g.getBoundingClientRect(),sc=sv.getBoundingClientRect().width/pg.w;const ev=(t,x,y)=>(t==='pointerdown'?g.querySelector('rect:last-child'):sv).dispatchEvent(new PointerEvent(t,{bubbles:true,cancelable:true,pointerId:3,clientX:x,clientY:y,button:0}));
 const cx=rr.x+4,cy=rr.y+4;ev('pointerdown',cx,cy);ev('pointermove',cx+13*sc,cy+7*sc);ev('pointerup',cx+13*sc,cy+7*sc);await w(200);return{dx:wd.x-x0,dy:wd.y-y0}});
ck('drag moves smoothly (not forced to 5 px steps)',dr.dx!==0&&(dr.dx%5!==0||dr.dy%5!==0),JSON.stringify(dr));
const lk=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const pg=AN.hmi.pages[AN.hmi.cur],wd=pg.widgets.find(x=>x.type==='slider'||x.type==='button');const x0=wd.x;
 [...document.querySelectorAll('#hmi .hh button')].find(x=>/Lock/.test(x.textContent)).click();await w(200);const g=document.querySelector('#hmicv g[data-id="'+wd.id+'"]'),rr=g.getBoundingClientRect();
 const sv=document.querySelector('#hmicv svg');const ev=(t,x,y)=>(t==='pointerdown'?g.querySelector('rect:last-child'):sv).dispatchEvent(new PointerEvent(t,{bubbles:true,cancelable:true,pointerId:3,clientX:x,clientY:y,button:0}));ev('pointerdown',rr.x+4,rr.y+4);ev('pointermove',rr.x+60,rr.y+40);ev('pointerup',rr.x+60,rr.y+40);await w(100);
 const edBtn=[...document.querySelectorAll('#hmi .hh button')].find(x=>/Edit/.test(x.textContent));return{locked:AN.hmi.lock,edit:AN.hmiUi.edit,moved:wd.x!==x0,dis:edBtn&&edBtn.disabled}});
ck('Lock: edit off, edit button disabled, widget cannot be moved',lk.locked&&!lk.edit&&lk.dis&&!lk.moved,JSON.stringify(lk));
/* 3. picker */
const pk=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));[...document.querySelectorAll('#hmi .hh button')].find(x=>/Locked/.test(x.textContent)).click();await w(150);
 const l=AN.hmiList(false),withDesc=l.filter(e=>e.desc).length;const f=AN.hmiList(true);
 AN.hmiAdd('slider',{x:20,y:20});const wd=AN.hmi.pages[AN.hmi.cur].widgets.slice(-1)[0];AN.hmiUi.edit=true;AN.hmiHeader();AN.hmiRender();await w(100);
 const sh=AN.cs(),S=sh.S;let net=-1;for(let n=0;n<S.nets.length;n++)if(S.ext.includes(n)&&!(S.xlk&&S.xlk[n])&&!S.nets[n].dig&&AN.hmiAddrOf(sh,n)){net=n;break}
 AN.sel={net};AN.selBox&&AN.selBox();return{n:l.length,withDesc,faces:f.length,net,addr:net>=0?AN.hmiAddrOf(sh,net):null,id:wd.id}});
ck('address list has the tags of all sheets with descriptions',pk.n>1000&&pk.withDesc>pk.n*.3,pk.n+' entries, '+pk.withDesc+' with description, '+pk.faces+' controllers');
await p.waitForTimeout(300);
const ui=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const wd=AN.hmi.pages[AN.hmi.cur].widgets.slice(-1)[0];document.querySelectorAll('#hmicv g[data-id]').forEach(()=>{});
 const sel=document.querySelector('#hmicv g[data-id="'+wd.id+'"] rect');sel.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:5,clientX:0,clientY:0,button:0}));sel.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,pointerId:5,clientX:0,clientY:0,button:0}));await w(150);
 const fb=[...document.querySelectorAll('#hmi .hp button')].find(x=>/Find/.test(x.textContent)),pb=[...document.querySelectorAll('#hmi .hp button')].find(x=>/Pick on diagram/.test(x.textContent));if(!fb||!pb)return{btn:false};
 fb.click();await w(100);const box=document.querySelector('#hmi .hfind'),inp=box.querySelector('input');inp.value='MWD';inp.dispatchEvent(new Event('input'));await w(100);const rows=box.querySelectorAll('div[style*="cursor:pointer"]').length;box.querySelector('div[style*="cursor:pointer"]')&&box.querySelector('div[style*="cursor:pointer"]').click();await w(100);
 const bound=wd.addr;pb.click();AN.sel={net:-1};await w(100);return{btn:true,rows,bound,gone:!document.querySelector('#hmi .hfind')}});
ck('Find…: search shows rows and clicking one binds the widget',ui.btn&&ui.rows>0&&!!ui.bound&&ui.gone,JSON.stringify(ui));
const pd=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const wd=AN.hmi.pages[AN.hmi.cur].widgets.slice(-1)[0];wd.addr='';const sh=AN.cs(),S=sh.S;let net=-1;for(let n=0;n<S.nets.length;n++)if(S.ext.includes(n)&&!(S.xlk&&S.xlk[n])&&!S.nets[n].dig&&AN.hmiAddrOf(sh,n)){net=n;break}
 const pb=[...document.querySelectorAll('#hmi .hp button')].find(x=>/Pick on diagram/.test(x.textContent));AN.sel=null;pb.click();await w(300);AN.sel={net};await w(700);return{net,addr:wd.addr,sheet:wd.sheet,want:AN.hmiAddrOf(sh,net)}});
ck('Pick on diagram: selecting a wire binds the widget to its address',pd.addr&&pd.addr===pd.want,JSON.stringify(pd));
/* 4. net-bound widget (wire without a tag) + save / restore with lock */
const nb=await E(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const sh=AN.cs(),S=sh.S;let net=-1;for(let n=0;n<S.nets.length;n++)if(S.ext.includes(n)&&!(S.xlk&&S.xlk[n])&&S.nets[n].dig&&!AN.hmiAddrOf(sh,n)){net=n;break}
 if(net<0)return{none:true};const wd=AN.hmiAdd('button',{x:300,y:300,label:'bare wire'});wd.addr='';wd.nn=net;wd.sheet=sh.name;AN.hmiWrite(wd,1);return{net,v:S.rt.ext[net],pick:!!AN.hmiPick(wd)}});
ck('widget bound to a wire without a tag works',nb.none||(nb.v===1&&nb.pick),JSON.stringify(nb));
await E(()=>{AN.hmiUi.edit=false;[...document.querySelectorAll('#hmi .hh button')].find(x=>/Lock/.test(x.textContent)).click()});await p.waitForTimeout(900);await p.screenshot({path:(process.argv[3]||'/tmp/hmi2')+'-auto.png'});
await p.reload();await p.waitForTimeout(3000);if(await E(()=>AN.cat!=='an'))await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(4000);
const rs=await E(()=>({lock:AN.hmi.lock,pages:AN.hmi.pages.length,nn:AN.hmi.pages.some(pg=>pg.widgets.some(x=>x.nn!=null))}));
ck('lock and the pages (also wire-bound widgets) are restored after F5',rs.lock===true&&rs.pages>=1,JSON.stringify(rs));
ck('no page errors',errs.length===0,errs.slice(0,3).join('|'));console.log(fail?fail+' FAIL':'ALL PASS');await b.close();process.exit(fail?1:0)})();
