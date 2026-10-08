/* v1.16.1 WIP: PROCESS MODEL (optional, per controller, ON by default in the app). The simulator has no plant: the PV of a controller is an input (an AI). With the model ON the PV is the output of a simple process:
   PV = bottom of the range + span * (0.5 + sign * K * (actuator command - 50) / 100) + load disturbance, delayed by the dead time L and smoothed by the time constant T (first order).
   The command = the output of the controller (it follows the selector behind it when that is on manual, because the controller tracks it); the sign follows the action of the PID (reverse: more output raises PV), so the loop is always a negative feedback as the engineers designed it. The valve stroke time is not included.
   Only SV (and the load disturbance) are set by the user; MV and PV move by themselves. The AI sliders that feed that PV are disabled with a note. Defaults by loop type: flow T 6 s, pressure 25, temperature 60, level 90, analysis 40.
   NOT the real plant: gain, time constant and dead time are guesses; change them in the controller panel. */
module.exports=(rep)=>{
rep(String.raw`function anStep(S,dt){`,String.raw`function anProcList(S){const out=[];for(const b of S.blk){if(b.k!=='PID'&&b.k!=='PIDV')continue;if(b.in0==null||b.in0<0)continue;const d=(S.drv[b.in0]||[]).map(x=>S.blk.find(q=>q.id===x.id)).find(q=>q&&q.k==='DEV'&&q.ip&&q.ip.length>=2);if(!d)continue;const mi=d.ip.find(q=>q.sg<0);if(!mi)continue;
  let ai=false;const ext=new Set(),seen=new Set(),walk=(n,dp)=>{if(dp>8||seen.has(n))return;seen.add(n);if(S.ext.includes(n)&&!(S.xlk&&S.xlk[n]))ext.add(n);for(const dr of S.drv[n]||[]){const x=S.blk.find(q=>q.id===dr.id);if(!x)continue;if(x.k==='AI'){ai=true;for(const q of x.i||[])if(S.ext.includes(q))ext.add(q);continue}if(x.k==='PID'||x.k==='PIDV'||x.k==='MAN')continue;for(const q of x.i||[])walk(q,dp+1)}};walk(mi.n,0);
  if(!ai&&!S.ext.includes(mi.n))continue;
  let act=-1;{const seen2=new Set();let fr=(b.o||[]).slice(),g=0;while(fr.length&&act<0&&g++<10){const nx=[];for(const n of fr){if(seen2.has(n))continue;seen2.add(n);for(const x of S.cns[n]||[]){if(x.k==='AO'||x.k==='IP'||x.k==='ACT'||x.k==='VLV'){const i0=(x.i||[])[0];if(i0!=null){act=i0;break}}for(const m of x.o||[])nx.push(m)}if(act>=0)break}fr=nx}}
  const TAU={flow:6,pressure:25,temperature:60,level:90,analysis:40,speed:15,general:30},lt=b.p.lt||'general';
  b.proc=b.proc||{on:false,K:1,T:TAU[lt]||30,L:lt==='flow'?1:(lt==='temperature'?5:2),dist:0};b.proc.pv=mi.n;b.proc.act=act;b.proc.sg=b.p.act<0?1:-1;b.proc.pvExt=ext;out.push(b)}return out}
function anProcStep(S,dt){const rt=S.rt,v=rt.v,F=rt.force,pm=rt.pm||(rt.pm={}),pf=rt.pf||(rt.pf={});
 for(const b of S.procs){const pr=b.proc;if(!pr)continue;let q=pm[b.id];
  if(!pr.on){if(q){if(pf[pr.pv])delete F[pr.pv];delete pf[pr.pv];delete pm[b.id]}continue}
  const st=rt.st[b.id]||{},u=st.out==null?0:st.out,span=b.p.span>0?b.p.span:100,lo=b.p.rlo!=null?b.p.rlo:0,um=((b.p.lo==null?0:b.p.lo)+(b.p.hi==null?100:b.p.hi))/2;
  /* steady state of the process: PV = bottom of the range + span * (0.5 + sign * K * (command - middle) / 100) + disturbance */
  const ss=c=>lo+span*(.5+pr.sg*pr.K*(c-um)/100)+(pr.dist||0)/100*span;
  if(!q)q=pm[b.id]={y:ss(u),h:[]};
  q.h.push([rt.t,u]);while(q.h.length>2&&q.h[1][0]<=rt.t-pr.L)q.h.shift();const tgt=ss(q.h[0][1]);
  if(dt>0)q.y+=(1-Math.exp(-dt/Math.max(pr.T,.05)))*(tgt-q.y);
  F[pr.pv]=q.y;pf[pr.pv]=1}}
function anStep(S,dt){`);
rep(String.raw` const F=rt.force,rmp=rt.ramp==null?.05:rt.ramp;`,String.raw` const F=rt.force,rmp=rt.ramp==null?.05:rt.ramp;if(S.procs===undefined)S.procs=anProcList(S);if(S.procs.length)anProcStep(S,dt);`);
rep(String.raw`anInit,anFX,anStep,anSettle};`,String.raw`anInit,anFX,anStep,anSettle,anProcList};`);
/* app: default ON, saved with the sheet */
rep(String.raw`function ensure(sh){if(sh.S)return sh.S;const S=anWire(anModel(anNets(anBuild(sh.R,sh.name))));anCompile(S);anInit(S);`,String.raw`function ensure(sh){if(sh.S)return sh.S;const S=anWire(anModel(anNets(anBuild(sh.R,sh.name))));anCompile(S);anInit(S);S.procs=anProcList(S);if(AN.procDefault!==false)for(const b of S.procs)b.proc.on=true;`);
rep(String.raw` for(const id in v.man||{}){const s=S.rt.st[id];if(s)s.val=v.man[id]}`,String.raw` for(const id in v.man||{}){const s=S.rt.st[id];if(s)s.val=v.man[id]}
 for(const id in v.proc||{}){const b=S.blk.find(q=>String(q.id)===String(id));if(b&&b.proc)Object.assign(b.proc,v.proc[id])}`);
rep(String.raw`ks=Object.keys(S.rt.force);d.innerHTML='';`,String.raw`ks=Object.keys(S.rt.force).filter(k=>!(S.rt.pf&&S.rt.pf[k]));d.innerHTML='';`);
/* the process model drives the PV through a force, but that is the PLANT, not the user: no forced look, no forced badge */
rep(String.raw`const fo=!AN.view&&S.rt.force[n.id]!==undefined;`,String.raw`const fo=!AN.view&&S.rt.force[n.id]!==undefined&&!(S.rt.pf&&S.rt.pf[n.id]);`);
rep(String.raw`for(const k in S.rt.force)if(L.mkBadge&&!(L.have&&L.have.has(+k)))L.mkBadge(+k);`,String.raw`for(const k in S.rt.force)if(!(S.rt.pf&&S.rt.pf[k])&&L.mkBadge&&!(L.have&&L.have.has(+k)))L.mkBadge(+k);`);
rep(String.raw`const f=S.rt.force[b.n]!==undefined;if(b.fv!==f)`,String.raw`const f=S.rt.force[b.n]!==undefined&&!(S.rt.pf&&S.rt.pf[b.n]);if(b.fv!==f)`);
/* panel of the PID */
rep(String.raw`pr('lo','Output low');pr('hi','Output high');d.append(h$('small',{txt:'The input is the DEVIATION`,String.raw`pr('lo','Output low');pr('hi','Output high');try{procPanel(d,b,sh)}catch(x){}d.append(h$('small',{txt:'The input is the DEVIATION`);
rep(String.raw`function whyTxt(S,b){`,String.raw`function procSave(sh,b){const o=sv(sh);o.proc=o.proc||{};const p=b.proc;o.proc[b.id]={on:p.on,K:p.K,T:p.T,L:p.L,dist:p.dist};anSave()}
function procPanel(d,b,sh){const p=b.proc;if(!p){d.append(h$('small',{txt:'Process model: not available here (the PV of this controller is not a field signal, or it has no SV / PV difference block).'}));return}const S=sh.S,pvn=nm(S,p.pv);
 d.append(h$('h4',{txt:'Process model (closed loop, simulation only)'}));
 const on=h$('input',{type:'checkbox'});on.checked=!!p.on;on.onchange=()=>{p.on=on.checked;if(!p.on){delete S.rt.pm[b.id]}procSave(sh,b);S.procs=S.procs;settle();buildPanel();panelUpd(true)};d.append(h$('div',{cls:'r'},[h$('label',{title:'The PV follows the valve through a simple process. Only SV is set by you.'},[on,document.createTextNode(' PV is simulated: follows the controller output')])]));
 const f=(k,t,tt)=>{const i=anEdit(h$('input',{type:'number',step:'any',value:p[k]}));i.style.width='64px';i.onchange=()=>{const v=parseFloat(i.value);if(isFinite(v)){p[k]=v;if(S.rt.pm)delete S.rt.pm[b.id];procSave(sh,b);settle()}};return h$('div',{cls:'r',title:tt},[h$('span',{cls:'n',txt:t}),i])};
 d.append(f('K','Process gain K (% of span per 100 % output)','1 = the whole output swing moves the whole span'),f('T','Time constant T (s)','how slowly the PV answers'),f('L','Dead time (s)','delay between the valve and the PV'));
 const ds=h$('input',{type:'range',min:-30,max:30,step:.5,value:p.dist||0}),dv=h$('span',{cls:'v',txt:(p.dist||0)+' %'});ds.oninput=()=>{p.dist=+ds.value;dv.textContent=p.dist+' %';procSave(sh,b)};d.append(h$('div',{cls:'r',title:'A load disturbance pushes the PV: the controller must bring it back'},[h$('span',{cls:'n',txt:'Load disturbance (% of span)'}),dv]),ds);
 d.append(h$('small',{txt:'PV = '+pvn+' · process input = the controller output'+' · '+(p.sg>0?'reverse':'direct')+' action. The AI sliders that feed this PV are disabled while the model is ON. This is NOT the real plant: the gain, time constant and dead time are guesses by loop type ('+(b.p.lt||'general')+').'}))}
function procLock(S,n){for(const b of S.procs||[]){const p=b.proc;if(p&&p.on&&p.pvExt&&p.pvExt.has(n))return b}return null}
function whyTxt(S,b){`);
rep(String.raw`const ctl=(S,sh,n)=>{const e=cosInfo(S,n);`,String.raw`const ctl=(S,sh,n)=>{{const lb=procLock(S,n);if(lb)return h$('small',{style:'color:#ffb04d',txt:'PV of '+((lb.txt||[])[1]||lb.k)+' is simulated by its process model: set the SV instead (or turn the model off in the controller panel).'})}const e=cosInfo(S,n);`);
rep(String.raw`trMap,trGoCrumb,cosInfo,cosOn,cosFill,`,String.raw`trMap,trGoCrumb,cosInfo,cosOn,cosFill,procLock,`);
};
