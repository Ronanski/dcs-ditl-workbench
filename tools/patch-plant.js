/* v1.20.0 WIP: PLANT WINDOW (user 2026-10-08: "plant graphics na mismo, tapos pop out nalang na new window ... sariling app, pero ico-call mo lng"). Replaces the HMI button.
   - the window is the same engine: every number is read from the sheets (never a copy); F box (FORCE / SIM) and the ownership rule of the HMI are kept (plant window open = the sheets and the panel only show).
   - system 1 = REHEATER (screen 005): HP bypass, LP bypass, reheater inlet spray, hot reheat pressure control (drawn from the DCS snapshot 5.png, addresses from the IO list).
   - values belong to the ADDRESS: a transmitter is found by its IO tag (PT-MS1006-1 ...), not by a wire. (Found by test: no IO address is drawn as an AI block on two sheets; the other sheets get it through circles / links, which carry the value.)
   - the window opens as a real pop-out window; where the browser / webview blocks pop-ups it opens as a floating window inside the app (same content). */
module.exports=(rep)=>{
/* sheets of the window keep running */
rep(String.raw`for(const nm of AN.hmiSheets||[]){const p=AN.sheets.find(s=>s.name===nm)`,String.raw`for(const nm of (AN.hmiSheets||[]).concat(AN.plantSheets||[])){const p=AN.sheets.find(s=>s.name===nm)`);
/* ownership rule: the plant window is a controller like the HMI was */
rep(String.raw`if(AN.hmiUi&&AN.hmiUi.open)anp.append(h$('div',{cls:'own',txt:'The HMI is open: it is the controller (inputs, FORCE / SIM). This panel only shows the values. Close the HMI to operate from the diagram and the panel.'}));`,String.raw`if(AN.plantUi&&AN.plantUi.open)anp.append(h$('div',{cls:'own',txt:'The Plant window is open: it is the controller (inputs, FORCE / SIM). This panel only shows the values. Close the Plant window to operate from the diagram and the panel.'}));else if(AN.hmiUi&&AN.hmiUi.open)anp.append(h$('div',{cls:'own',txt:'The HMI is open: it is the controller (inputs, FORCE / SIM). This panel only shows the values. Close the HMI to operate from the diagram and the panel.'}));`);
rep(String.raw`if(AN.hmiUi&&AN.hmiUi.open&&!AN.view){msg('The HMI is open: operate from the HMI (inputs and FORCE / SIM). Close it to use the diagram.');return}`,String.raw`if(((AN.hmiUi&&AN.hmiUi.open)||(AN.plantUi&&AN.plantUi.open))&&!AN.view){msg('The Plant window (or HMI) is open: operate from there (inputs and FORCE / SIM). Close it to use the diagram.');return}`);
rep(String.raw`document.body.classList.toggle('hmiown',!!AN.hmiUi.open);`,String.raw`document.body.classList.toggle('hmiown',!!(AN.hmiUi.open||(AN.plantUi&&AN.plantUi.open)));`);
/* the button: Plant replaces HMI in the toolbar (the HMI code stays as the widget library of the window; no HMI button, no HMI editor for the user) */
rep(String.raw`bHm=h$('button',{txt:'HMI',title:'HMI graphics view: buttons, lamps, numbers, faceplates connected to addresses (Tab / Float / Split)'}),`,String.raw`bHm=h$('button',{txt:'HMI',style:'display:none'}),bPl=h$('button',{txt:'Plant',title:'Plant window: plant graphics of a system (pop-out window), live values of the addresses, F box (FORCE / SIM)'}),`);
rep(String.raw`bAs,bIm,bDs,bHm,bPn,`,String.raw`bAs,bIm,bDs,bPl,bPn,`);
rep(String.raw`function wrCtl(e){`,String.raw`/* ===================== PLANT WINDOW ===================== */
AN.plantUi={open:false,page:'reheater',sheets:[]};AN.plantSheets=[];
const plNorm=t=>String(t||'').trim();
/* ---- address registry: one IO address (AI) = one value on every sheet ---- */
function plAIs(){const sig=AN.sheets.filter(s=>s.S).length;if(AN._plAI&&AN._plAI.n===sig)return AN._plAI.m;const m=new Map();
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name)||!sh.S)continue;for(const b of sh.S.blk){if(b.k!=='AI'||b.fb||!b.tagAI)continue;let k=null;try{const a=AN.adesFind(sh,b.tagAI);k=a&&a.rec&&a.rec.tag}catch(e){}if(!k)continue;const o=b.pins.find(p=>p.role==='out');if(!o)continue;const L=m.get(k)||[];L.push({sh,S:sh.S,b,id:b.id,n:o.n});m.set(k,L)}}
 AN._plAI={n:sig,m};return m}
/* ---- one value of the window: resolves to (sheet, wire) so that the HMI ownership code (state, F box, write) is reused ---- */
function plRes(o){if(o.ai){const L=plAIs().get(o.ai);if(!L||!L.length)return null;const x=L.find(q=>procAI(q.S,q.id))||L[0];return{sheet:x.sh.name,nn:x.n,rng:x.b.rng}}
 if(o.pid){const bb=hmiBlk({addr:o.pid});if(!bb)return null;const q=hmiNets(bb.sh,bb.b).find(z=>z.name===o.pin);if(!q)return null;const P=bb.b.p||{};return{sheet:bb.sh.name,nn:q.n,rng:(o.pin==='MV')?{lo:0,hi:100}:{lo:+P.rlo,hi:+P.rhi}}}return null}
const plVal=(r)=>{if(!r)return null;const sh=AN.sheets.find(s=>s.name===r.sheet);if(!sh||!sh.S||!sh.S.rt||!sh.S.rt.v)return null;const v=sh.S.rt.v[r.nn];return v==null||!isFinite(v)?null:v};
const PL_SV='http://www.w3.org/2000/svg';
const PL_C={steam:'#e0242b',steamOff:'#4a1a1d',water:'#23bfe3',waterOff:'#17414b',txt:'#e6edf3',val:'#2fe3f5',dim:'#7f8d96',ok:'#35e08a',bad:'#ff4d4d'};
function plBuild(root,page,upd,sheetsNeeded){const W=1500,H=940,svg=hs$('svg',{viewBox:'0 0 '+W+' '+H,preserveAspectRatio:'xMidYMid meet',style:'width:100%;height:100%;background:#000;display:block'});
 const ow=()=>(root.ownerDocument.defaultView)||window,at=(x,y,s,o)=>{const t=ht$(s,Object.assign({x,y,fill:PL_C.txt,'font-size':12,'font-family':'Georgia,serif'},o||{}));svg.append(t);return t};
 const need=r=>{if(r&&sheetsNeeded.indexOf(r.sheet)<0)sheetsNeeded.push(r.sheet)};
 /* pipe: steam / water, dims while the valve it hangs on is closed */
 const pipe=(pts,k)=>{const o={g:null},l=hs$('polyline',{points:pts.map(p=>p.join(',')).join(' '),fill:'none','stroke-width':3,'stroke-linejoin':'round',stroke:k==='w'?PL_C.water:PL_C.steam});svg.append(l);upd.push(()=>{const v=o.g?o.g():null,on=!o.g||v==null||v>1;l.setAttribute('stroke',on?(k==='w'?PL_C.water:PL_C.steam):(k==='w'?PL_C.waterOff:PL_C.steamOff))});return o};
 const box=(x,y,w,h,s,fill)=>{svg.append(hs$('rect',{x,y,width:w,height:h,rx:3,fill:fill||'#c9ced2',stroke:'#667'}));if(s)at(x+w/2,y+h/2+4,s,{'text-anchor':'middle',fill:'#222','font-family':'Arial,sans-serif','font-size':12})};
 /* F box + click-to-set on one value */
 const fbox=(g,x,y,r)=>{const w={sheet:r.sheet,nn:r.nn},b=hs$('rect',{x,y,width:17,height:12,rx:3,fill:'#1b262d',stroke:'#667',style:'cursor:pointer'}),t=ht$('F',{x:x+8.5,y:y+9.5,'text-anchor':'middle','font-size':9,fill:'#9ab',style:'pointer-events:none'}),ti=hs$('title');b.append(ti);g.append(b,t);
  b.onpointerdown=e=>{e.stopPropagation();hmiToggleForce(w);plUpd()};
  upd.push(()=>{const s=hmiState(w);if(!s){b.setAttribute('stroke',PL_C.bad);t.textContent='?';return}
   if(s.forced){b.setAttribute('fill','#ff9d2e');b.setAttribute('stroke','#ff9d2e');t.setAttribute('fill','#1b1000');t.textContent=s.field?'SIM':'FRC';ti.textContent=(s.field?'SIMULATED':'FORCED')+' at '+fmt(s.S.rt.force[s.n])+'. Click to release'}
   else{b.setAttribute('fill','#1b262d');b.setAttribute('stroke',s.how==='plant'?'#4da3ff':'#667');t.setAttribute('fill',s.how==='plant'?'#4da3ff':'#9ab');t.textContent=s.how==='plant'?'P':'F';ti.textContent=s.how==='plant'?'Driven by the plant model (read only). Click F to simulate (hold) a value':s.how==='computed'?'Computed by the logic (read only). Click F to force (hold) a value':'Operator input. Click F to hold it as a simulated point'}})};
 const setv=(r,lab)=>{const s=hmiState({sheet:r.sheet,nn:r.nn});if(!s)return;if(s.how==='plant'||s.how==='computed'){msg('Plant window: '+(s.how==='plant'?'driven by the plant model. Press F to simulate (hold) a value, or change the SV / the field input of the loop':'computed by the logic. Press F to force (hold) a value'));return}
  const t=ow().prompt(lab+' - new value',fmt(plVal(r)));if(t===null)return;const n=parseFloat(t);if(isFinite(n)){hmiWrite({sheet:r.sheet,nn:r.nn},n);plUpd()}};
 /* number with tag: tag (serif white), value (cyan), unit */
 const num=(x,y,tag,o)=>{const g=hs$('g',{transform:'translate('+x+','+y+')'});svg.append(g);const r=plRes(o);g.append(ht$(tag,{x:0,y:0,fill:PL_C.txt,'font-size':11,'font-family':'Georgia,serif'}));const vt=ht$('--',{x:0,y:16,fill:PL_C.val,'font-size':14,'font-weight':'bold','font-family':'Consolas,monospace',style:'cursor:pointer'}),ut=ht$(o.u||'',{x:24,y:16,fill:PL_C.dim,'font-size':10}),ti=hs$('title');vt.append(ti);g.append(vt,ut);
  if(!r){ti.textContent=tag+': address '+(o.ai||o.pid)+' is not on any ABC sheet (not simulated)';vt.setAttribute('fill','#556');return}need(r);fbox(g,tag.length*6.4+4,-10,r);vt.onclick=()=>setv(r,tag);
  upd.push(()=>{const v=plVal(r),w=hmiState({sheet:r.sheet,nn:r.nn});vt.textContent=v==null?'--':v.toFixed(o.d==null?1:o.d);ut.setAttribute('x',(vt.textContent.length*8.4+4));vt.setAttribute('fill',w&&w.forced?'#ffb04d':PL_C.val);ti.textContent=tag+' = '+(o.ai||o.pid+'.'+o.pin)+' on '+r.sheet+(o.ai?' (IO '+o.ai+')':'')+'. Click the value to set it'})};
 /* control valve: bow tie, red closed / green open, position under it */
 const valve=(x,y,tag,o)=>{const g=hs$('g',{transform:'translate('+x+','+y+')'});svg.append(g);const a=hs$('polygon',{points:'-11,-8 0,0 -11,8',stroke:'#aab','stroke-width':1.5}),b=hs$('polygon',{points:'11,-8 0,0 11,8',stroke:'#aab','stroke-width':1.5});g.append(a,b);if(o.act)g.append(hs$('path',{d:'M-7,-9 A7,6 0 0 1 7,-9 M0,-9 L0,0',fill:'none',stroke:'#aab','stroke-width':1.5,transform:'translate(0,-6)'}));
  g.append(ht$(tag,{x:o.tx==null?16:o.tx,y:o.ty==null?-8:o.ty,fill:PL_C.txt,'font-size':11,'font-family':'Georgia,serif'}));const r=o.pid?plRes({pid:o.pid,pin:'MV'}):null,vt=ht$('',{x:o.tx==null?16:o.tx,y:o.ty==null?7:o.ty+15,fill:PL_C.val,'font-size':13,'font-weight':'bold','font-family':'Consolas,monospace'}),ti=hs$('title');vt.append(ti);g.append(vt);
  if(!r){const c=o.fixed==null?'#5a636a':(o.fixed?PL_C.ok:PL_C.bad);a.setAttribute('fill',c);b.setAttribute('fill',c);vt.textContent=o.note||'';ti.textContent=tag+': no logic on the ABC sheets for this valve (not simulated)';vt.setAttribute('fill',PL_C.dim);vt.setAttribute('font-size',10);return}
  need(r);if(o.pid)fbox(g,(o.tx==null?16:o.tx)+tag.length*6.2+4,-18,r);
  upd.push(()=>{const v=plVal(r),c=v==null?'#5a636a':(v<=2?PL_C.bad:PL_C.ok);a.setAttribute('fill',c);b.setAttribute('fill',c);vt.textContent=v==null?'-- %':v.toFixed(1)+' %';ti.textContent=tag+' opening = the output (MV) of '+o.pid+' on '+r.sheet+' (valve position feedback is not modelled)'});return()=>plVal(r)};
 /* controller box: PV / SV / MV of a PID tag; SV and the F boxes work */
 const ctl=(x,y,title,tag)=>{const g=hs$('g',{transform:'translate('+x+','+y+')'});svg.append(g);g.append(hs$('rect',{x:0,y:0,width:215,height:92,rx:3,fill:'#0c1216',stroke:'#4a5a64'}),hs$('rect',{x:0,y:0,width:215,height:17,fill:'#6b747a'}),ht$(title,{x:5,y:13,fill:'#fff','font-size':11,'font-family':'Arial,sans-serif','font-weight':'bold'}),ht$(tag,{x:210,y:13,'text-anchor':'end',fill:'#dde','font-size':10,'font-family':'Arial,sans-serif'}));
  ['PV','SV','MV'].forEach((pin,i)=>{const yy=36+i*24;g.append(ht$(pin,{x:8,y:yy,fill:'#e6edf3','font-size':13,'font-family':'Georgia,serif'}));const r=plRes({pid:tag,pin});const vt=ht$('--',{x:140,y:yy,'text-anchor':'end',fill:PL_C.val,'font-size':15,'font-weight':'bold','font-family':'Consolas,monospace',style:'cursor:pointer'}),ti=hs$('title');vt.append(ti);g.append(vt);
   if(!r){ti.textContent=tag+' not found on any sheet';vt.setAttribute('fill','#556');return}need(r);const gg=hs$('g',{});g.append(gg);fbox(gg,150,yy-12,r);vt.onclick=()=>setv(r,tag+'.'+pin);
   upd.push(()=>{const v=plVal(r);vt.textContent=v==null?'--':v.toFixed(1);ti.textContent=tag+'.'+pin+' on '+r.sheet+'. Click to set (SV: the setpoint; PV / MV: press F first)'})})};
 /* ================= the screen: 005 REHEATER STEAM SYSTEM ================= */
 at(14,26,'005 REHEATER STEAM SYSTEM',{'font-size':18,'font-family':'Arial,sans-serif','font-weight':'bold',fill:'#fff'});at(14,44,'Plant window - system 1 of the plant simulator. Values are the addresses of the ABC sheets (same engine). Not connected to the real plant.',{'font-size':10,fill:PL_C.dim,'font-family':'Arial,sans-serif'});
 svg.append(hs$('rect',{x:640,y:6,width:640,height:36,fill:'#e69ad0'}));[['MSP','PT-MS1006-1',0,'K'],['MST','TT-MS1007',0,'C'],['MSF','FT-MS1031',1,'T/H'],['RHP','PT-HR1001',1,'K'],['RHT','TT-HR1002-1',0,'C']].forEach((q,i)=>{const x=648+i*127,g=hs$('g',{transform:'translate('+x+',0)'});svg.append(g);g.append(ht$(q[0],{x:0,y:30,fill:'#1a3cff','font-size':15,'font-family':'Arial,sans-serif'}));const r=plRes({ai:q[1]}),vt=ht$('--',{x:40,y:30,fill:'#2fe3f5','font-size':15,'font-weight':'bold','font-family':'Consolas,monospace'});g.append(vt);if(r){need(r);upd.push(()=>{const v=plVal(r);vt.textContent=v==null?'--':v.toFixed(q[2])})}});
 /* main steam */
 box(14,152,150,30,'BOILER OUTLET');pipe([[164,167],[1110,167]],'s');
 num(190,122,'FIQMS1031',{ai:'FT-MS1031',u:'T/H'});num(320,122,'PIMS10061',{ai:'PT-MS1006-1',u:'kg/cm2'});num(450,122,'PIMS10062',{ai:'PT-MS1006-2',u:'kg/cm2'});num(580,122,'TIMS1007',{ai:'TT-MS1007',u:'C',d:0});
 valve(740,167,'MVMS1391',{ty:34,tx:-30,note:'n/a',act:0});
 box(1110,120,100,95,'HP TURBINE','#b9bec2');
 /* HP bypass */
 pipe([[880,167],[880,260]],'s');const pp1=pipe([[880,260],[880,470]],'s');
 const pcv=valve(880,260,'PCVMS1020',{pid:'PICMS1006',act:1,tx:16,ty:-14});pp1.g=pcv;at(900,226,'(HP TURBINE BYPASS)',{'font-size':10,fill:PL_C.dim});
 num(905,300,'PIMS1021',{ai:'PT-MS1021',u:'kg/cm2'});
 pipe([[20,380],[520,380]],'w');const pp2=pipe([[520,380],[880,380]],'w');box(14,360,150,24,'BFP EXTRACTION');
 valve(300,380,'XVFW1061',{ty:-14,tx:-26,note:''});const tcvA=valve(520,380,'TCVFW1060',{pid:'TICMS1022',act:1,tx:16,ty:-30});pp2.g=tcvA;
 num(60,336,'FIQFW1059',{ai:'FT-FW1059',u:'T/H'});at(730,372,'de-superheater',{'font-size':10,fill:PL_C.dim});
 num(905,355,'TIMS10221',{ai:'TT-MS1022-1',u:'C',d:0});num(905,395,'TIMS10222',{ai:'TT-MS1022-2',u:'C',d:0});
 /* cold reheat */
 pipe([[1160,215],[1160,470],[520,470]],'s');at(1020,462,'COLD REHEAT',{'font-size':10,fill:PL_C.dim});
 num(690,426,'PICR1003',{ai:'PT-CR1003',u:'kg/cm2'});num(790,426,'TICR1004',{ai:'TT-CR1004',u:'C',d:0});
 /* reheater inlet spray */
 pipe([[20,580],[600,580],[600,470]],'w');box(14,560,150,24,'BFP EXTRACTION');num(60,536,'FIQFW1149',{ai:'FT-FW1149',u:'T/H'});
 valve(240,580,'XVFW1151',{ty:-14,tx:-26,note:''});valve(400,580,'TCVFW1150',{ty:28,tx:-30,note:'n/a'});
 num(615,525,'TICR10051',{ai:'TT-CR1005-1',u:'C',d:0});num(715,525,'TICR10052',{ai:'TT-CR1005-2',u:'C',d:0});
 /* reheater header */
 svg.append(hs$('rect',{x:400,y:440,width:120,height:70,fill:'#d6c13a',stroke:'#665',opacity:.9}));at(460,480,'REHEATER',{'text-anchor':'middle','font-size':11,fill:'#111','font-family':'Arial,sans-serif'});
 num(290,470,'PICR1006',{ai:'PT-CR1006',u:'kg/cm2'});
 /* hot reheat */
 pipe([[460,510],[460,650],[1110,650]],'s');at(300,672,'HOT REHEAT',{'font-size':10,fill:PL_C.dim});
 [['PIHR1001','PT-HR1001','kg/cm2',1],['TIHR10021','TT-HR1002-1','C',0],['TIHR10022','TT-HR1002-2','C',0],['PIHR10031','PT-HR1003-1','kg/cm2',1],['PIHR10032','PT-HR1003-2','kg/cm2',1],['TIHR1004','TT-HR1004','C',0]].forEach((q,i)=>num(480+i*85,606,q[0],{ai:q[1],u:q[2],d:q[3]}));
 box(1110,600,100,95,'IP / LP TURBINE','#b9bec2');
 /* hot R/H steam pressure control (silencer valve) */
 pipe([[460,650],[460,720],[300,720]],'s');valve(380,720,'MVHR1391',{pid:'PICHR1391',tx:-30,ty:-26});at(250,740,'SILENCER',{'font-size':10,fill:PL_C.dim});
 /* LP bypass */
 pipe([[1000,650],[1000,730]],'s');const pp3=pipe([[1000,730],[1000,900]],'s');const lpv=valve(1000,730,'PCVHR1010',{pid:'PICHR1003',act:1,tx:16,ty:-14});pp3.g=lpv;at(1020,700,'(LP TURBINE BYPASS)',{'font-size':10,fill:PL_C.dim});
 num(1025,752,'TIHR1010',{ai:'TT-HR1010',u:'C',d:0});num(1025,800,'PIHR1011',{ai:'PT-HR1011',u:'kg/cm2'});
 pipe([[1420,830],[1130,830]],'w');const pp4=pipe([[1130,830],[1000,830]],'w');box(1330,812,100,24,'CONDENSATE');valve(1250,830,'XVCD1114',{ty:-12,tx:-26,note:''});pp4.g=valve(1130,830,'TCVCD1115',{pid:'TICHR1012',act:1,tx:-10,ty:26});
 num(1210,784,'FIQCD1115',{ai:'FT-CD1115',u:'T/H'});at(1010,918,'CONDENSER',{'font-size':12,fill:PL_C.txt,'font-family':'Arial,sans-serif'});
 num(1025,846,'TIHR10121',{ai:'TT-HR1012-1',u:'C',d:0});num(1025,886,'TIHR10122',{ai:'TT-HR1012-2',u:'C',d:0});
 /* controllers */
 ctl(1270,60,'HP-BYPASS (PCV)','PICMS1006');ctl(1270,162,'HP-BYPASS (TCV)','TICMS1022');ctl(1270,264,'LP-BYPASS (PCV)','PICHR1003');ctl(1270,366,'LP-BYPASS (TCV)','TICHR1012');ctl(1270,468,'HOT R/H STM PRESS CTL','PICHR1391');ctl(1270,570,'S/H PANEL #2 INLET','HICBR1391');
 [['Pipes dim while their valve is closed.'],['F box: FORCE / SIM (orange).'],['P (blue) = driven by the plant model.'],['-- = address not on any ABC sheet.']].forEach((q,i)=>at(1270,690+i*14,q[0],{'font-size':10,fill:PL_C.dim,'font-family':'Arial,sans-serif'}));
 return svg}
/* ---- operating point = the values of the DCS snapshot 5.png (a running plant at one moment). Free transmitters start there (only if nobody has set them); a modelled loop gets an offset of its plant so that its PV sits there at mid output ---- */
const PL_INIT={'FT-MS1031':482.2,'PT-MS1006-1':121.1,'PT-MS1006-2':121.1,'TT-MS1007':538,'PT-MS1021':35.7,'TT-MS1022-1':362,'TT-MS1022-2':358,'FT-FW1059':1.8,'PT-CR1003':35.3,'TT-CR1004':370,'TT-CR1005-1':331,'TT-CR1005-2':327,'FT-FW1149':14.8,'PT-CR1006':34.9,'PT-HR1001':35,'TT-HR1002-1':540,'TT-HR1002-2':540,'PT-HR1003-1':34.3,'PT-HR1003-2':34.4,'TT-HR1004':540,'TT-HR1010':228,'PT-HR1011':0,'TT-HR1012-1':137,'TT-HR1012-2':135,'FT-CD1115':0};
const PL_OP={PICMS1006:121.1,TICMS1022:360,PICHR1003:34.4,TICHR1012:136,TICHR1002:540};
function plStart(){if(AN._plInit)return;AN._plInit=1;const done=[];
 for(const k in PL_INIT){const L=plAIs().get(k)||[];for(const x of L){if(procAI(x.S,x.id))continue;const s=x.S.rt.st[x.id],sv0=(AN.sv[x.sh.name]&&AN.sv[x.sh.name].ai)||{};if(!s||sv0[x.id]!==undefined)continue;const lo=x.b.rng?x.b.rng.lo:0,hi=x.b.rng?x.b.rng.hi:1e9;if(Math.abs(s.val-lo)>1e-9&&s.val!==0)continue;const v=Math.max(lo,Math.min(hi,PL_INIT[k]));s.val=s.act=v;done.push(k)}}
 for(const t in PL_OP){const bb=hmiBlk({addr:t});if(!bb||!bb.b.proc)continue;const P=bb.b.p,span=P.span>0?P.span:100,lo=P.rlo!=null?P.rlo:0;bb.b.proc.op=PL_OP[t]-(lo+span/2);if(bb.sh.S.rt.pm)delete bb.sh.S.rt.pm[bb.b.id];done.push(t)}
 AN._plInit=done.length}
/* ---- the window ---- */
let plRoot=null,plWin=null,plUpdL=[],plChk=null;
function plUpd(){for(const f of plUpdL)try{f()}catch(e){}}
function plTick(){if(!AN.plantUi.open)return;if(plWin&&plWin.closed){plClose();return}plUpd()}
function plOpen(){if(AN.plantUi.open){try{plWin&&plWin.focus()}catch(e){}return}
 AN.sheets.forEach(sh=>{try{ensure(sh)}catch(e){}});AN._plAI=null;try{plStart()}catch(e){console.error('plant start',e)}
 const root=h$('div',{id:'plantroot',style:'position:relative;width:100%;height:100%;background:#000'});plUpdL=[];const need=[];root.append(plBuild(root,'reheater',plUpdL,need));
 let host=null;try{plWin=window.open('','logicsim_plant','width=1400,height=900,resizable=yes,scrollbars=no')}catch(e){plWin=null}
 if(plWin&&plWin.document){try{plWin.document.open();plWin.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Logic Sim - Plant window</title><style>html,body{margin:0;height:100%;background:#000;overflow:hidden}</style></head><body></body></html>');plWin.document.close();plWin.document.body.appendChild(root);host='window';plWin.addEventListener('beforeunload',()=>{if(AN.plantUi.open)plClose(true)})}catch(e){try{plWin.close()}catch(x){}plWin=null}}
 if(!host){const f=h$('div',{id:'plantfloat',style:'position:fixed;left:40px;top:60px;width:min(1200px,92vw);height:min(820px,88vh);z-index:9000;border:1px solid var(--acc);box-shadow:0 6px 28px #000c;background:#000;resize:both;overflow:hidden;display:flex;flex-direction:column'});const bar=h$('div',{style:'display:flex;gap:8px;align-items:center;padding:4px 8px;background:var(--panel);border-bottom:1px solid var(--line);color:var(--tx);font:12px sans-serif'},[h$('b',{txt:'Plant window',style:'color:var(--acc)'}),h$('span',{style:'flex:1'}),h$('button',{txt:'✕',title:'Close the plant window',onclick:()=>plClose()})]);root.style.flex='1';root.style.minHeight='0';f.append(bar,root);document.body.appendChild(f);host='float'}
 AN.plantUi.open=true;AN.plantUi.host=host;AN.plantSheets=need.slice();bPl.classList.add('on');
 AN.tickHooks=AN.tickHooks||[];if(!AN.tickHooks.includes(plTick))AN.tickHooks.push(plTick);clearInterval(plChk);plChk=setInterval(()=>{if(!AN.plantUi.open){clearInterval(plChk);return}if(plWin&&plWin.closed)plClose();else plUpd()},500);plRoot=root;plUpd();hmiApplyMode();msg('Plant window open ('+host+'). The sheets and the panel only show values while it is open; operate from the plant window.')}
function plClose(fromWin){if(!AN.plantUi.open)return;AN.plantUi.open=false;clearInterval(plChk);AN.plantSheets=[];bPl.classList.remove('on');AN.tickHooks=(AN.tickHooks||[]).filter(f=>f!==plTick);try{if(plWin&&!plWin.closed&&!fromWin)plWin.close()}catch(e){}plWin=null;const f=document.getElementById('plantfloat');if(f)f.remove();plRoot=null;plUpdL=[];try{hmiApplyMode()}catch(e){}}
bPl.onclick=()=>{if(AN.plantUi.open)plClose();else plOpen()};
function wrCtl(e){`);
rep(String.raw`hmiState,hmiToggleForce,hmiPlantOwned,hmiForced,wrCtl,anPins,stepSet});`,String.raw`hmiState,hmiToggleForce,hmiPlantOwned,hmiForced,wrCtl,anPins,stepSet,plOpen,plClose,plAIs,plRes,plVal});`);
};
