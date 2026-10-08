/* v1.18.x WIP: WHO CONTROLS, FORCE / SIM, ONE CLOCK (user, 2026-10-08).
   - While the HMI is open it is the controller: the sheet panel and the diagram cannot write inputs or forces (greyed, with a banner); close the HMI to use them again.
   - Every HMI widget bound to a point gets an "F" box: FORCE (logic side) / SIM (field side) holds the point at its value, like a forced point of the DCS, for analog and digital points, in RUN as well as in PAUSE.
     States of a point: free input (the operator writes it), plant (the plant model drives it: read only), computed by the logic (read only), forced (the user holds it: the plant and the logic do not change it).
   - Panel, diagram, HMI and Trend are refreshed by the same clock (the panel update) and read the same state. */
module.exports=(rep)=>{
/* one clock */
rep(String.raw`PU.forEach(f=>f());`,String.raw`PU.forEach(f=>f());for(const f of AN.tickHooks||[])try{f()}catch(e){}`);
rep(String.raw`clearInterval(hmTm);hmTm=setInterval(hmiUpd,250);hmiSync()}`,String.raw`AN.tickHooks=AN.tickHooks||[];if(!AN.tickHooks.includes(hmiUpd))AN.tickHooks.push(hmiUpd);hmiSync()}`);
rep(String.raw`clearInterval(hmTm);hmiApplyMode()}`,String.raw`AN.tickHooks=(AN.tickHooks||[]).filter(f=>f!==hmiUpd);hmiApplyMode()}`);
rep(String.raw`const tm=setInterval(()=>{if(!ov.isConnected){clearInterval(tm);return}draw()},250);draw();`,String.raw`AN.tickHooks=AN.tickHooks||[];const hk=()=>{if(!ov.isConnected){AN.tickHooks=AN.tickHooks.filter(x=>x!==hk);return}draw()};AN.tickHooks.push(hk);const tm=0;draw();`);
/* trend widget of the HMI: one sample per 250 ms, whatever the clock */
rep(String.raw`const v=hmiVal(w,a);if(v==null)return;w._buf[i].push(v);`,String.raw`const v=hmiVal(w,a);if(v==null)return;if(i===0){const t_=performance.now();w._go=t_-(w._lt||0)>=240;if(w._go)w._lt=t_}if(!w._go)return;w._buf[i].push(v);`);
/* controls that can be disabled by the state of the point */
rep(String.raw`const tr=hs$('rect',{x:x,y:y+8,width:W,height:4,fill:'#33424b',rx:2}),kn=hs$('rect',{x:x,y:y+1,width:8,height:18,fill:col,rx:2,style:'cursor:ew-resize'})`,String.raw`const tr=hs$('rect',{x:x,y:y+8,width:W,height:4,fill:'#33424b',rx:2,'data-ctl':1}),kn=hs$('rect',{x:x,y:y+1,width:8,height:18,fill:col,rx:2,style:'cursor:ew-resize','data-ctl':1})`);
rep(String.raw`const hz=hs$('rect',{x:x,y:y-4,width:W,height:28,fill:'transparent',style:'cursor:ew-resize'});`,String.raw`const hz=hs$('rect',{x:x,y:y-4,width:W,height:28,fill:'transparent',style:'cursor:ew-resize','data-ctl':1});`);
rep(String.raw`case 'button':{const r=hs$('rect',{x:0,y:0,width:W,height:H,rx:5,fill:'#26323a',stroke:'#667',style:'cursor:pointer'})`,String.raw`case 'button':{const r=hs$('rect',{x:0,y:0,width:W,height:H,rx:5,fill:'#26323a',stroke:'#667',style:'cursor:pointer','data-ctl':1})`);
rep(String.raw`r.onpointerup=()=>{if(w.mom&&r._m){r._m=0;const p=hmiPick(w);hmiWrite(w,0,!!(p&&!p.ext))}};break}`,String.raw`r.onpointerup=()=>{if(w.mom&&r._m){r._m=0;hmiWrite(w,0)}};break}`);
rep(String.raw`g.append(hit);hit.style.cursor='default';if(!AN.hmiUi.edit)hit.style.pointerEvents='none';`,String.raw`g.append(hit);hit.style.cursor='default';if(!AN.hmiUi.edit)hit.style.pointerEvents='none';hmiFBox(g,w,W,H,upd);`);
rep(String.raw`bHm.onclick=()=>{if(AN.hmiUi.open)hmiClose();else hmiOpen()};`,String.raw`bHm.onclick=()=>{if(AN.hmiUi.open)hmiClose();else hmiOpen()};
/* ===================== control ownership, FORCE / SIM ===================== */
document.head.appendChild(h$('style',{txt:'body.hmiown #anp .wr,body.hmiown #anp .wr *{pointer-events:none;opacity:.4}#anp .own{background:#2a1f0a;border-left:3px solid #ffb04d;padding:4px 6px;margin:4px 0;color:#ffd9a0;font-size:11px}'}));
const hmiForced=(S,n)=>S.rt.force[n]!==undefined&&!(S.rt.pf&&S.rt.pf[n]);
const hmiSrcBlk=(S,n)=>S.blk.find(b=>(b.k==='AI'&&!b.fb||b.k==='SIGAB')&&b.pins.some(p=>p.role==='out'&&p.n===n))||null;
const hmiPlantOwned=(S,n)=>{for(const b of S.procs||[]){const p=b.proc;if(p&&p.on&&p.mode!=='shared'&&(p.pinExt===n||(p.mode==='pin'&&p.pv===n)||(p.aiOut||[]).includes(n)))return b}if(S.plantT){if(S.plantT.ext.has(n))return{k:'PID',txt:['',S.plantT.ext.get(n)]};const src=hmiSrcBlk(S,n);if(src&&S.plantT.ai.has(src.id))return{k:'PID',txt:['',S.plantT.ai.get(src.id)]}}return null};
/* what can the user do with the point of a widget */
function hmiState(w,a){const p=hmiPick(w,a);if(!p)return null;const S=p.sh.S,n=p.n,forced=hmiForced(S,n),own=hmiPlantOwned(S,n),src=hmiSrcBlk(S,n),field=S.ext.includes(n)||!!src;
 const how=forced?'forced':own?'plant':(p.ext||src)?'input':'computed';return{p,S,n,forced,own,src,field,how}}
hmiWrite=function(w,v,rel){const st=hmiState(w);if(!st){msg('HMI: the address "'+(w.addr||('wire '+w.nn))+'" was not found on any sheet');return}const sh=st.p.sh;hmiSync();
 if(rel===true){if(st.forced)setForce(sh,st.n,undefined);return}
 if(st.how==='forced'){setForce(sh,st.n,v);return}
 if(st.how==='plant'){msg('HMI: this value is driven by the plant model. Set the SV, or press F (SIM / FORCE) to hold a value');return}
 if(st.how==='computed'){msg('HMI: this value is computed by the logic. Press F (FORCE) to hold a value');return}
 if(st.p.ext){setExt(sh,st.n,v);return}
 if(st.src){const s=sh.S.rt.st[st.src.id],r=st.src.rng,x=st.src.k==='SIGAB'?(v>.5?1:0):(r?Math.max(r.lo,Math.min(r.hi,v)):v);s.val=x;if(st.src.k==='AI')s.act=x;(sv(sh).ai=sv(sh).ai||{})[st.src.id]=x;anSave();settle()}};
function hmiToggleForce(w){const st=hmiState(w);if(!st)return;const sh=st.p.sh;if(st.forced){setForce(sh,st.n,undefined);return}let v=st.S.rt.v[st.n];if(v==null||!isFinite(v))v=0;if(st.S.nets[st.n].dig)v=v>.5?1:0;setForce(sh,st.n,v)}
function hmiFBox(g,w,W,H,upd){if(!['button','slider','num','lamp','bar','tank','valve','motor','pipe'].includes(w.type))return;if(!w.addr&&w.nn==null)return;
 const r=hs$('rect',{x:W-27,y:-3,width:27,height:13,rx:3,fill:'#1b262d',stroke:'#667',style:'cursor:pointer'}),t=ht$('F',{x:W-13.5,y:7,'text-anchor':'middle','font-size':9,fill:'#9ab',style:'pointer-events:none'}),ti=hs$('title');r.append(ti);g.append(r,t);
 r.onpointerdown=e=>{if(AN.hmiUi.edit)return;e.stopPropagation();hmiToggleForce(w)};
 upd.push(()=>{const st=hmiState(w);if(!st){r.setAttribute('stroke','#ff4d4d');t.textContent='?';return}
  const ro=st.how==='plant'||st.how==='computed';g.querySelectorAll('[data-ctl]').forEach(e=>{e.style.opacity=ro?'.35':'';e.style.pointerEvents=ro?'none':''});
  if(st.forced){r.setAttribute('fill','#ff9d2e');r.setAttribute('stroke','#ff9d2e');t.setAttribute('fill','#1b1000');t.textContent=st.field?'SIM':'FRC';ti.textContent=(st.field?'SIMULATED':'FORCED')+' at '+fmt(st.S.rt.force[st.n])+': the plant and the logic do not change it. Click to release'}
  else{r.setAttribute('fill','#1b262d');r.setAttribute('stroke',st.how==='plant'?'#4da3ff':'#667');t.setAttribute('fill',st.how==='plant'?'#4da3ff':'#9ab');t.textContent=st.how==='plant'?'P':'F';
   ti.textContent=st.how==='plant'?'Driven by the plant model (read only). Click F to simulate (hold) a value':st.how==='computed'?'Computed by the logic (read only). Click F to force (hold) a value':'Operator input. Click F to hold it as a forced / simulated point'}})}
const _am=hmiApplyMode;hmiApplyMode=function(){_am();document.body.classList.toggle('hmiown',!!AN.hmiUi.open);try{const sh=cs();if(sh&&sh.S&&AN.cat==='an'){buildPanel();panelUpd(true)}}catch(e){}};
`);
/* sheet side: banner, greyed controls, diagram click */
rep(String.raw`function buildPanel(){const sh=cs(),S=sh.S;anp.innerHTML='';`,String.raw`function wrCtl(e){try{e.querySelectorAll&&e.querySelectorAll('input,button').forEach(x=>x.classList.add('wr'))}catch(x){}return e}
function buildPanel(){const sh=cs(),S=sh.S;anp.innerHTML='';if(AN.hmiUi&&AN.hmiUi.open)anp.append(h$('div',{cls:'own',txt:'The HMI is open: it is the controller (inputs, FORCE / SIM). This panel only shows the values. Close the HMI to operate from the diagram and the panel.'}));`);
rep(String.raw`function digClick(sh,n,shift){if(AN.view)`,String.raw`function digClick(sh,n,shift){if(AN.hmiUi&&AN.hmiUi.open&&!AN.view){msg('The HMI is open: operate from the HMI (inputs and FORCE / SIM). Close it to use the diagram.');return}if(AN.view)`);
rep(String.raw`const ctl=(S,sh,n)=>{{const lb=procLock(S,n);`,String.raw`const ctl=(S,sh,n)=>wrCtl(ctl0(S,sh,n));const ctl0=(S,sh,n)=>{{const lb=procLock(S,n);`);
rep(String.raw`{const pb=procAI(S,b.id);if(pb){`,String.raw`row.querySelectorAll('input,button').forEach(e=>e.classList.add('wr'));{const pb=procAI(S,b.id);if(pb){`);
rep(String.raw`bt.onclick=()=>{st.val=st.val?0:1;(sv(sh).ai=sv(sh).ai||{})[b.id]=st.val;anSave();settle()};`,String.raw`bt.classList.add('wr');bt.onclick=()=>{st.val=st.val?0:1;(sv(sh).ai=sv(sh).ai||{})[b.id]=st.val;anSave();settle()};`);
rep(String.raw`rg.oninput=()=>setE(+rg.value);row.append(rg);PU.push(`,String.raw`rg.classList.add('wr');if(procLock(S,n))rg.disabled=true;rg.oninput=()=>setE(+rg.value);row.append(rg);PU.push(`);
rep(String.raw`hmiVb,hmiWrite,procLock,procAI,nm});`,String.raw`hmiVb,hmiWrite,procLock,procAI,nm,hmiState,hmiToggleForce,hmiPlantOwned,hmiForced,wrCtl,anPins,stepSet});`);
rep(String.raw`const row=mkRow(g,'n'+n,nm(S,n),wd.desc,ce,pos);`,String.raw`const row=mkRow(g,'n'+n,nm(S,n),wd.desc,ce,pos);row.querySelectorAll('input,button').forEach(e=>e.classList.add('wr'));{const lk_=procLock(S,n);if(lk_){row.querySelectorAll('input,button').forEach(e=>e.disabled=true);row.append(h$('small',{style:'color:#ffb04d',txt:'PV of '+((lk_.txt||[])[1]||lk_.k)+': simulated by the plant model (set the SV). FORCE it to hold a value.'}))}}`);
rep(String.raw`i.style.width='80px';rg.style.width='100%';rg.oninput=()=>set(+rg.value);`,String.raw`i.classList.add('wr');rg.classList.add('wr');i.style.width='80px';rg.style.width='100%';rg.oninput=()=>set(+rg.value);`);
rep(String.raw`ctlEl=b}`,String.raw`b.classList.add('wr');ctlEl=b}`);
rep(String.raw`ctlEl=i}}`,String.raw`i.classList.add('wr');ctlEl=i}}`);
};
