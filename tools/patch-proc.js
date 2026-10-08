/* v1.16.1 WIP: PROCESS MODEL (optional, per controller, ON by default in the app). The simulator has no plant: the PV of a controller is an input (an AI). With the model ON the PV is the output of a simple process:
   PV = bottom of the range + span * (0.5 + sign * K * (actuator command - 50) / 100) + load disturbance, delayed by the dead time L and smoothed by the time constant T (first order).
   The command = the output of the controller (it follows the selector behind it when that is on manual, because the controller tracks it); the sign follows the action of the PID (reverse: more output raises PV), so the loop is always a negative feedback as the engineers designed it. The valve stroke time is not included.
   Only SV (and the load disturbance) are set by the user; MV and PV move by themselves. The AI sliders that feed that PV are disabled with a note. Defaults by loop type: flow T 6 s, pressure 25, temperature 60, level 90, analysis 40.
   NOT the real plant: gain, time constant and dead time are guesses; change them in the controller panel. */
module.exports=(rep)=>{
rep(String.raw`function anStep(S,dt){`,String.raw`/* PLANT LAYER (v1.18.x): the plant answers at the INPUT of the sheet, where the field writes: the transmitter (AI block) or the input wire of the PV. The blocks between the transmitter and the PID (selection, average, square root, deviation alarm...) keep running as drawn.
   The value to write is found by feedback (secant): the PV that the PID really sees is read back and the transmitter value is corrected until it equals the plant value; this also works through scaling / square root / selectors. A value that the USER forces (the PV wire, or a transmitter) is never overwritten: the plant keeps evolving underneath, the forced value stays (like a forced point in the DCS). */
/* WHICH input of the deviation block is the PV? The drawing says it: the text "PV" / "SV" written beside the pin (nearest pin wins). Without text: reverse action -> PV on the minus pin, direct action -> PV on the plus pin (67 of 68 loops agree with their drawing). v1.18.x: before this the minus pin was always taken as PV, which is WRONG for direct-acting loops (the SV was driven as if it were the PV). */
function anPins(S,b){if(b._pins!==undefined)return b._pins;let r=null;try{if((b.k==='PID'||b.k==='PIDV')&&b.in0>=0){const d=(S.drv[b.in0]||[]).map(x=>S.blk.find(q=>q.id===x.id)).find(q=>q&&q.k==='DEV'&&q.ip&&q.ip.length>=2);
  if(d){const ins=d.pins.filter(q=>q.role==='in');let psg=null,by=0;for(const t of S.tx||[]){const tt=t.t.trim();if(!/^(PV|SV)$/i.test(tt)||Math.hypot(t.x-d.cx,t.y-d.cy)>30)continue;const pn=ins.slice().sort((x,y)=>Math.hypot(x.x-t.x,x.y-t.y)-Math.hypot(y.x-t.x,y.y-t.y))[0],ip=pn&&d.ip.find(x=>x.n===pn.n);if(!ip)continue;psg=/^PV$/i.test(tt)?ip.sg:-ip.sg;by=1}
   if(psg==null)psg=b.p.act<0?-1:1;const pv=d.ip.find(q=>q.sg===psg)||d.ip[0],sv=d.ip.find(q=>q!==pv);r={dev:d,pv:pv.n,sv:sv?sv.n:-1,pvSg:psg,byLabel:by}}}}catch(e){r=null}return b._pins=r}
function anProcEst(b){const P=b.p,lt=P.lt||'general',TAU={flow:6,pressure:25,temperature:60,level:90,analysis:40,speed:15,general:30},kp=P.kp>0?P.kp:1;
 /* a tuned loop: Ti is about the process time constant, Kp x K is about 0.6; dead time from Td, otherwise a tenth of T */
 const T=P.ti>0?Math.min(600,Math.max(3,P.ti)):(TAU[lt]||30),K=Math.min(3,Math.max(.2,.6/kp)),L=P.td>0?Math.min(T/3,Math.max(.5,P.td*2)):(lt==='flow'?1:Math.min(15,Math.max(1,T/12)));return{K:+K.toFixed(2),T:+T.toFixed(1),L:+L.toFixed(1)}}
/* Which transmitters (AI blocks) of the PV chain carry the measurement? Redundant transmitters of one variable all matter; compensation inputs (pressure, temperature) matter much less. The chain is probed on a COPY of the state: each AI is moved by 10 % of its range and the PV pin is read back. */
function anRtCopy(rt){return structuredClone(rt)}
function anRtBack(rt,sn){for(const k in sn){const a=rt[k],b=sn[k];if(Array.isArray(b)&&Array.isArray(a)){a.length=0;for(const x of b)a.push(x)}else if(b&&typeof b==='object'&&a&&typeof a==='object'&&!Array.isArray(b)){for(const q in a)if(!(q in b))delete a[q];for(const q in b)a[q]=b[q]}else rt[k]=b}}
function anProbe(S,pr){const rt=S.rt,sn=anRtCopy(rt),res=[];try{
  const ev=()=>{for(let i=0;i<4;i++)anStep(S,0);return rt.v[pr.pv]};
  for(const id of pr.ai){const a=S.blk.find(x=>x.id===id),s=rt.st[id],r=a.rng||{lo:0,hi:100};const sp=Math.max(1e-9,r.hi-r.lo);
   for(const b2 of pr.ai){const x=S.blk.find(q=>q.id===b2),q=rt.st[b2],rr=x.rng||{lo:0,hi:100};q.val=q.act=rr.lo+.4*(rr.hi-rr.lo)}
   const p1=ev();s.val=s.act=r.lo+.5*sp;const p2=ev();res.push({id,sens:(p2-p1)/(.1*sp)*sp})}}catch(e){}anRtBack(rt,sn);return res}
function anProcList(S){S.procs=[];const out=[];for(const b of S.blk){if(b.k!=='PID'&&b.k!=='PIDV')continue;if(b.in0==null||b.in0<0)continue;const pn=anPins(S,b);if(!pn)continue;const mi={n:pn.pv};
  const ais=[],seen=new Set(),walk=(n,dp)=>{if(dp>8||seen.has(n))return;seen.add(n);for(const dr of S.drv[n]||[]){const x=S.blk.find(q=>q.id===dr.id);if(!x)continue;if(x.k==='AI'){if(!x.fb&&!ais.includes(x.id))ais.push(x.id);continue}if(x.k==='PID'||x.k==='PIDV'||x.k==='MAN')continue;for(const q of x.i||[])walk(q,dp+1)}};walk(mi.n,0);
  const pinExt=S.ext.includes(mi.n)&&!(S.xlk&&S.xlk[mi.n]);if(!ais.length&&!pinExt)continue;
  let act=-1;{const seen2=new Set();let fr=(b.o||[]).slice(),g=0;while(fr.length&&act<0&&g++<10){const nx=[];for(const n of fr){if(seen2.has(n))continue;seen2.add(n);for(const x of S.cns[n]||[]){if(x.k==='AO'||x.k==='IP'||x.k==='ACT'||x.k==='VLV'){const i0=(x.i||[])[0];if(i0!=null){act=i0;break}}for(const m of x.o||[])nx.push(m)}if(act>=0)break}fr=nx}}
  const e=anProcEst(b);b.proc=b.proc||{on:false,K:e.K,T:e.T,L:e.L,dist:0,est:1};const pr=b.proc;pr.pv=mi.n;pr.act=act;pr.sg=-(b.p.act<0?1:-1)*pn.pvSg;pr.svn=pn.sv;pr.pinExt=pinExt?mi.n:null;pr.allAI=ais.slice();pr.ai=ais.slice();pr.mode=pinExt?'input':'transmitter';
  if(!pinExt){const sn=anProbe(S,{pv:mi.n,ai:ais}),mx=Math.max(0,...sn.map(q=>Math.abs(q.sens)));pr.sens=sn;
   if(mx<1e-6){pr.mode='pin';pr.ai=[]}else pr.ai=sn.filter(q=>Math.abs(q.sens)>=.3*mx).map(q=>q.id)}
  pr.aiOut=pr.ai.flatMap(id=>{const a=S.blk.find(q=>q.id===id);return a?a.pins.filter(p=>p.role==='out').map(p=>p.n):[]});out.push(b)}
  /* two controllers on the SAME measurement (two valves on one level): ONE plant variable. The first controller carries the plant model, the others follow the same measurement (their own output is not part of the model). */
  {const byPv={};for(const b of out){const pr=b.proc,k=pr.pv;if(byPv[k]){pr.mode='shared';pr.of=(byPv[k].txt||[])[1]||byPv[k].k;pr.ai=[];pr.aiOut=[];pr.pinExt=null}else byPv[k]=b}}
  S.procs=out;return out}
function anProcStep(S,dt){const rt=S.rt,v=rt.v,F=rt.force,pm=rt.pm||(rt.pm={}),pf=rt.pf||(rt.pf={});
 for(const b of S.procs){const pr=b.proc;if(!pr||pr.mode==='shared')continue;let q=pm[b.id];
  if(!pr.on){if(q)delete pm[b.id];if(pf[pr.pv]){delete F[pr.pv];delete pf[pr.pv]}continue}
  const st=rt.st[b.id]||{},u=st.out==null?0:st.out,span=b.p.span>0?b.p.span:100,lo=b.p.rlo!=null?b.p.rlo:0,um=((b.p.lo==null?0:b.p.lo)+(b.p.hi==null?100:b.p.hi))/2;
  /* plant: steady state PV = bottom of the range + span * (0.5 + sign * K * (command - middle) / 100) + disturbance; dead time, then first order; it cannot leave the range of the instrument */
  const ss=c=>lo+span*(.5+pr.sg*pr.K*(c-um)/100)+(pr.dist||0)/100*span;
  if(!q)q=pm[b.id]={y:ss(u),h:[],u:null};
  if(dt>0){q.h.push([rt.t,u]);while(q.h.length>2&&q.h[1][0]<=rt.t-pr.L)q.h.shift();const tgt=ss(q.h[0][1]);q.y+=(1-Math.exp(-dt/Math.max(pr.T,.05)))*(tgt-q.y);q.y=Math.max(lo,Math.min(lo+span,q.y))}
  if(dt<=0&&q.u!=null)continue;
  const y=q.y;
  if(pr.mode==='pin'){if(F[pr.pv]===undefined||pf[pr.pv]){F[pr.pv]=y;pf[pr.pv]=1}continue}
  /* where the plant writes: this sheet, or (v1.18.x) the sheet where the signal really starts (PV that comes through a circle from another sheet) */
  const R=pr.remote,T=R?R.S:S,tr=T.rt,tv=tr.v,tF=tr.force,tpin=R?R.pin:pr.pv,tai=R?R.ai:pr.ai,taiOut=R?R.aiOut:pr.aiOut,text=R?R.ext:(pr.mode==='input'?pr.pv:null);
  if(text!=null){if(tF[text]===undefined){tr.ext[text]=y;(tr.ev||(tr.ev={}))[text]=y;if(R&&F[pr.pv]===undefined){rt.ext[pr.pv]=y;(rt.ev||(rt.ev={}))[pr.pv]=y}}continue}
  /* transmitters: write the AI blocks of this measurement */
  const pinF=F[pr.pv]!==undefined||tF[tpin]!==undefined,aiF=taiOut.some(n=>tF[n]!==undefined);let w;
  if(q.u==null){w=y;q.g=1;/* compensation inputs of the chain (pressure, temperature...) that are not driven: start at the middle of their range, not at the bottom (a chain divided by a compensation of 0 gives nothing) */for(const id of (R?R.allAI:pr.allAI)||[]){if(tai.includes(id))continue;const a=T.blk.find(x=>x.id===id),s_=tr.st[id],r=a&&a.rng;if(s_&&r&&Math.abs(s_.val-r.lo)<1e-9){s_.val=s_.act=r.lo+.5*(r.hi-r.lo)}}}
  else if(!pinF&&!aiF){const p=tv[tpin];if(q.up!=null&&Math.abs(q.u-q.up)>1e-6*span){const gg=(p-q.pp)/(q.u-q.up);if(isFinite(gg)&&Math.abs(gg)>.02&&Math.abs(gg)<50)q.g=gg}q.pp=p;q.up=q.u;w=q.u+.7*(y-p)/(q.g||1)}
  else w=(q.up!=null?q.up:q.u)+(y-(q.pp!=null?q.pp:y))/(q.g||1);
  {let rl=1e30,rh=-1e30;for(const id of tai){const a=T.blk.find(x=>x.id===id),r=a&&a.rng;if(r){rl=Math.min(rl,r.lo);rh=Math.max(rh,r.hi)}}
   if(rl<rh){const hit=w<rl||w>rh;w=Math.max(rl,Math.min(rh,w));const p=tv[tpin];q.bad=(hit&&!pinF&&!aiF&&Math.abs(y-p)>.05*span)?(q.bad||0)+1:0;if(q.bad>=30){pr.mode='pin';pr.fell=1;pr.ai=[];pr.aiOut=[];pr.remote=null;continue}}}
  q.u=w;
  for(const id of tai){const a=T.blk.find(x=>x.id===id),s=tr.st[id];if(!a||!s)continue;const on_=a.pins.filter(p=>p.role==='out').map(p=>p.n);if(on_.some(n=>tF[n]!==undefined))continue;const r=a.rng,x=r?Math.max(r.lo,Math.min(r.hi,w)):w;s.val=x;s.act=x}}}
function anStep(S,dt){`);
rep(String.raw` const F=rt.force,rmp=rt.ramp==null?.05:rt.ramp;`,String.raw` const F=rt.force,rmp=rt.ramp==null?.05:rt.ramp;if(S.procs===undefined)S.procs=anProcList(S);if(S.procs.length)anProcStep(S,dt);`);
rep(String.raw`anInit,anFX,anStep,anSettle};`,String.raw`anInit,anFX,anStep,anSettle,anProcList,anPins};`);
/* deviation block: the "PV" / "SV" text belongs to the NEAREST pin (before, the last pin within 12 units that saw the text won: on 19 of 68 loops the PV of the DCMP deviation alarms was taken on the wrong pin) */
rep(String.raw`const devPV=d=>{let r=null;for(const p of d.pins.filter(q=>q.role==='in')){const t=TX.filter(q=>/^(PV|SV)$/i.test(q.t.trim())&&anD(q.x,q.y,p.x,p.y)<=12).sort((a,c)=>anD(a.x,a.y,p.x,p.y)-anD(c.x,c.y,p.x,p.y))[0];if(t&&/^PV$/i.test(t.t.trim())){const ip=d.ip&&d.ip.find(x=>x.n===p.n);r=ip?ip.sg:null}}return r};`,String.raw`const devPV=d=>{let r=null;const ins=d.pins.filter(q=>q.role==='in');for(const t of TX.filter(q=>/^(PV|SV)$/i.test(q.t.trim())&&anD(q.x,q.y,d.cx,d.cy)<=30)){const p=ins.slice().sort((a,c)=>anD(a.x,a.y,t.x,t.y)-anD(c.x,c.y,t.x,t.y))[0],ip=p&&d.ip&&d.ip.find(x=>x.n===p.n);if(ip){if(/^PV$/i.test(t.t.trim()))r=ip.sg;else if(r==null)r=-ip.sg}}return r};`);
/* app: default ON, saved with the sheet */
rep(String.raw`function ensure(sh){if(sh.S)return sh.S;const S=anWire(anModel(anNets(anBuild(sh.R,sh.name))));anCompile(S);anInit(S);`,String.raw`function ensure(sh){if(sh.S)return sh.S;const S=anWire(anModel(anNets(anBuild(sh.R,sh.name))));anCompile(S);anInit(S);S.procs=anProcList(S);if(AN.procDefault!==false)for(const b of S.procs)b.proc.on=true;`);
rep(String.raw` for(const id in v.man||{}){const s=S.rt.st[id];if(s)s.val=v.man[id]}`,String.raw` for(const id in v.man||{}){const s=S.rt.st[id];if(s)s.val=v.man[id]}
 for(const id in v.proc||{}){const b=S.blk.find(q=>String(q.id)===String(id));if(b&&b.proc){const q=v.proc[id];if(q.ver===2)Object.assign(b.proc,q);else{b.proc.on=q.on;b.proc.dist=q.dist||0}}}`);
rep(String.raw`ks=Object.keys(S.rt.force);d.innerHTML='';`,String.raw`ks=Object.keys(S.rt.force).filter(k=>!(S.rt.pf&&S.rt.pf[k]));d.innerHTML='';`);
/* the process model drives the PV through a force, but that is the PLANT, not the user: no forced look, no forced badge */
rep(String.raw`const fo=!AN.view&&S.rt.force[n.id]!==undefined;`,String.raw`const fo=!AN.view&&S.rt.force[n.id]!==undefined&&!(S.rt.pf&&S.rt.pf[n.id]);`);
rep(String.raw`for(const k in S.rt.force)if(L.mkBadge&&!(L.have&&L.have.has(+k)))L.mkBadge(+k);`,String.raw`for(const k in S.rt.force)if(!(S.rt.pf&&S.rt.pf[k])&&L.mkBadge&&!(L.have&&L.have.has(+k)))L.mkBadge(+k);`);
rep(String.raw`const f=S.rt.force[b.n]!==undefined;if(b.fv!==f)`,String.raw`const f=S.rt.force[b.n]!==undefined&&!(S.rt.pf&&S.rt.pf[b.n]);if(b.fv!==f)`);
rep(String.raw`function setForce(sh,n,x){const S=sh.S,o=sv(sh);o.force=o.force||{};if(x===undefined){delete S.rt.force[n];delete o.force[n]}else{S.rt.force[n]=x;o.force[n]=x}`,String.raw`function setForce(sh,n,x){const S=sh.S,o=sv(sh);o.force=o.force||{};if(S.rt.pf)delete S.rt.pf[n];if(x===undefined){delete S.rt.force[n];delete o.force[n]}else{S.rt.force[n]=x;o.force[n]=x}`);
/* panel of the PID */
rep(String.raw`pr('lo','Output low');pr('hi','Output high');d.append(h$('small',{txt:'The input is the DEVIATION`,String.raw`pr('lo','Output low');pr('hi','Output high');try{procPanel(d,b,sh)}catch(x){}d.append(h$('small',{txt:'The input is the DEVIATION`);
rep(String.raw`function whyTxt(S,b){`,String.raw`function procSave(sh,b){const o=sv(sh);o.proc=o.proc||{};const p=b.proc;o.proc[b.id]=Object.assign({ver:2,on:p.on,dist:p.dist,est:p.est?1:0},p.est?{}:{K:p.K,T:p.T,L:p.L});anSave()}
function procPanel(d,b,sh){const p=b.proc;if(p&&p.mode==='shared'){d.append(h$('h4',{txt:'Process model'}),h$('small',{txt:'This controller measures the SAME process variable as '+p.of+'. The plant model of that variable is on '+p.of+' (one variable, one model).'}));return}if(!p){d.append(h$('small',{txt:'Process model: not available here (the PV of this controller is not a field signal, or it has no SV / PV difference block).'}));return}const S=sh.S,pvn=nm(S,p.pv);
 d.append(h$('h4',{txt:'Process model (closed loop, simulation only)'}));
 const on=h$('input',{type:'checkbox'});on.checked=!!p.on;on.onchange=()=>{p.on=on.checked;if(!p.on){delete S.rt.pm[b.id]}procSave(sh,b);S.procs=S.procs;settle();buildPanel();panelUpd(true)};d.append(h$('div',{cls:'r'},[h$('label',{title:'The PV follows the valve through a simple process. Only SV is set by you.'},[on,document.createTextNode(' PV is simulated: follows the controller output')])]));
 const f=(k,t,tt)=>{const i=anEdit(h$('input',{type:'number',step:'any',value:p[k]}));i.style.width='64px';i.onchange=()=>{const v=parseFloat(i.value);if(isFinite(v)){p[k]=v;p.est=0;if(S.rt.pm)delete S.rt.pm[b.id];procSave(sh,b);settle()}};return h$('div',{cls:'r',title:tt},[h$('span',{cls:'n',txt:t}),i])};
 d.append(f('K','Process gain K (% of span per 100 % output)','1 = the whole output swing moves the whole span'),f('T','Time constant T (s)','how slowly the PV answers'),f('L','Dead time (s)','delay between the valve and the PV'));
 const ds=h$('input',{type:'range',min:-30,max:30,step:.5,value:p.dist||0}),dv=h$('span',{cls:'v',txt:(p.dist||0)+' %'});ds.oninput=()=>{p.dist=+ds.value;dv.textContent=p.dist+' %';procSave(sh,b)};d.append(h$('div',{cls:'r',title:'A load disturbance pushes the PV: the controller must bring it back'},[h$('span',{cls:'n',txt:'Load disturbance (% of span)'}),dv]),ds);
 d.append(h$('small',{txt:'PV = '+pvn+' · process input = the controller output'+' · '+(b.p.act<0?'reverse':'direct')+' action. The plant writes the '+(p.mode==='transmitter'?'transmitter (AI) value':'input wire')+' of this PV, the blocks of the sheet between it and the PID keep running; that value is read only while the model is ON (FORCE it to hold a value, the plant keeps running underneath). '+(p.est?'Gain, time constant and dead time are ESTIMATED from the tuning of this controller (Ti ~ T, Kp x K ~ 0.6, dead time from Td): not measured on the plant.':'Gain, time constant and dead time were edited by you.')+' Loop type '+(b.p.lt||'general')+'.'}))}
function procLock(S,n){for(const b of S.procs||[]){const p=b.proc;if(p&&p.on&&(p.pinExt===n||(p.mode==='pin'&&p.pv===n)))return b}if(S.plantT&&S.plantT.ext.has(n))return{k:'PID',txt:['',S.plantT.ext.get(n)]};return null}
function procAI(S,id){for(const b of S.procs||[]){const p=b.proc;if(p&&p.on&&p.ai&&p.ai.includes(id))return b}if(S.plantT&&S.plantT.ai.has(id))return{k:'PID',txt:['',S.plantT.ai.get(id)]};return null}
/* the PV of a controller can come through a circle from another sheet (8 loops): the plant must write where the signal STARTS (the transmitter / input wire of the source sheet), so that every sheet that reads that signal sees the same value */
function procRemote(x){const S=x.S;if(!S||S._rem===1)return;S._rem=1;for(const b of S.procs||[]){const pr=b.proc;if(!pr||pr.mode==='shared'||pr.mode==='pin'||pr.mode==='transmitter')continue;const l=S.xlk&&S.xlk[pr.pv];if(!l||!l.from||!l.from.S)continue;
  const FS=l.from.S,sn=l.fromNets.find(n=>FS.drv[n].length)??l.fromNets[0];if(sn==null)continue;const tag=(b.txt||[])[1]||b.k;
  const ais=[],seen=new Set(),walk=(n,dp)=>{if(dp>8||seen.has(n))return;seen.add(n);for(const dr of FS.drv[n]||[]){const y=FS.blk.find(q=>q.id===dr.id);if(!y)continue;if(y.k==='AI'){if(!y.fb&&!ais.includes(y.id))ais.push(y.id);continue}if(y.k==='PID'||y.k==='PIDV'||y.k==='MAN')continue;for(const q of y.i||[])walk(q,dp+1)}};walk(sn,0);
  const ext=FS.ext.includes(sn)&&!(FS.xlk&&FS.xlk[sn])?sn:null;FS.plantT=FS.plantT||{ai:new Map(),ext:new Map()};
  const own=(FS.procs||[]).some(p=>p.proc&&p.proc.mode!=='shared'&&((p.proc.ai||[]).some(id=>ais.includes(id))||p.proc.pinExt===sn));
  if(!ais.length&&ext==null){pr.mode='pin';pr.ai=[];pr.aiOut=[];continue}
  if(own||ais.some(id=>FS.plantT.ai.has(id))||(ext!=null&&FS.plantT.ext.has(ext))){pr.mode='shared';pr.of='the controller that owns this measurement in '+l.from.name;continue}
  let ai=ais.slice();if(ais.length){const pb=anProbe(FS,{pv:sn,ai:ais}),mx=Math.max(0,...pb.map(q=>Math.abs(q.sens)));if(mx<1e-6){pr.mode='pin';pr.ai=[];pr.aiOut=[];continue}ai=pb.filter(q=>Math.abs(q.sens)>=.3*mx).map(q=>q.id)}
  const aiOut=ai.flatMap(id=>{const a=FS.blk.find(q=>q.id===id);return a?a.pins.filter(p=>p.role==='out').map(p=>p.n):[]});
  pr.remote={S:FS,pin:sn,ai,aiOut,ext,allAI:ais};pr.mode='remote';pr.pinExt=null;pr.ai=[];pr.aiOut=[];ai.forEach(id=>FS.plantT.ai.set(id,tag));if(ext!=null)FS.plantT.ext.set(ext,tag)}}
function whyTxt(S,b){`);
rep(String.raw`const ctl=(S,sh,n)=>{const e=cosInfo(S,n);`,String.raw`const ctl=(S,sh,n)=>{{const lb=procLock(S,n);if(lb)return h$('small',{style:'color:#ffb04d',txt:'PV of '+((lb.txt||[])[1]||lb.k)+' is simulated by its process model: set the SV instead (or turn the model off in the controller panel).'})}const e=cosInfo(S,n);`);
rep(String.raw`for(const x of set)anStep(x.S,dt)}`,String.raw`for(const x of set)try{procRemote(x)}catch(e){}for(const x of set)anStep(x.S,dt)}`);
rep(String.raw`trMap,trGoCrumb,cosInfo,cosOn,cosFill,`,String.raw`trMap,trGoCrumb,cosInfo,cosOn,cosFill,procLock,procAI,procRemote,`);
/* the transmitter (AI) that the plant drives: slider and number box disabled with the reason */
rep(String.raw`if(b.fb){inp.disabled=true;rg.disabled=true}`,String.raw`if(b.fb){inp.disabled=true;rg.disabled=true}{const pb=procAI(S,b.id);if(pb){inp.disabled=true;rg.disabled=true;row.append(h$('small',{style:'color:#ffb04d',txt:'Simulated by the plant model of '+((pb.txt||[])[1]||pb.k)+': set the SV; FORCE the point to hold a value.'}))}}`);
};
