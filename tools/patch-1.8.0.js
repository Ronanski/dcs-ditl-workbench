/* v1.7.0 -> v1.8.0 : "cannot force AO / MV": a list of signals to force (any tagged wire, AO, I/P ...), forced values always visible, AO shows its output, pause hint, several overlapping wires -> click again; not-selected T path = de-energised grey */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.7.0.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,90));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.7.0</title>','<title>DITL Logic Workbench v1.8.0</title>');
rep(`const AN_PV=9;`,`const AN_PV=9;`);
/* 1. not selected path = de-energised (same grey as an OFF wire), lit only when selected */
rep(`if(isD){c=n.dig?(on?DCc:'#3b4651'):ANC;w=n.dig?wd_:wa_;o=n.dig?.5:.68}`,`if(isD){c='#3b4651';w=n.dig?wd_:wa_;o=1}`);
/* 2. AO overlay follows its OUTPUT net (what you force) */
rep(`inp=b=>{const p=b.pins.find(q=>q.role==='in');return p?p.n:-1};`,`inp=b=>{const p=(b.k==='AO'&&b.pins.find(q=>q.role==='out'))||b.pins.find(q=>q.role==='in');return p?p.n:-1};`);
/* 3. a forced wire always shows its value, even where badges are hidden / never made */
rep(`const addB=(n,ax,ay,below)=>{if(placed.has(n)||skipB(n))return;placed.add(n);const q=place(ax,ay,6,below),t=el('text',{x:q.x,y:-(q.y+bs*.2),class:'bd'+(S.nets[n].dig?' dg':''),'text-anchor':'start'},gb);t.dataset.n=n;L.bd.push({n,t,last:null})};`,`const addB=(n,ax,ay,below)=>{if(placed.has(n))return;const sk=skipB(n);placed.add(n);const q=place(ax,ay,6,below),t=el('text',{x:q.x,y:-(q.y+bs*.2),class:'bd'+(S.nets[n].dig?' dg':''),'text-anchor':'start'},gb);t.dataset.n=n;if(sk)t.style.display='none';L.bd.push({n,t,last:null,skip:sk})};
 L.have=placed;L.mkBadge=n=>{if(placed.has(n)||!S.nets[n].segs.length)return;placed.add(n);const s=S.seg[S.nets[n].segs[0]],t=el('text',{x:(s.x1+s.x2)/2+1.2,y:-((s.y1+s.y2)/2+1.2),class:'bd'+(S.nets[n].dig?' dg':''),'text-anchor':'start'},gb);t.style.display='none';L.bd.push({n,t,last:null,skip:true})};`);
rep(`for(const b of L.bd){const q_=`,`for(const k in S.rt.force)if(L.mkBadge&&!(L.have&&L.have.has(+k)))L.mkBadge(+k);
 for(const b of L.bd){if(b.skip){const f=S.rt.force[b.n]!==undefined;if(b.fv!==f){b.fv=f;b.t.style.display=f?'':'none'}}const q_=`);
/* 4. paused: tell why a valve / timer does not move */
rep(`function settle(){const sh=cs();for(let i=0;i<6;i++)stepSet(sh,0);paint();panelUpd()}`,`function pauseHint(sh){if(AN.run||!sh||!sh.S||Date.now()-(pauseHint.t||0)<15000)return;if(sh.S.blk.some(b=>['VLV','ACT','TON','TOF','TPS','TPV','RATE','RAMPB','LAG'].includes(b.k))){pauseHint.t=Date.now();msg('Paused: the value is applied, but valves, timers and ramps only move after you press ▶ Run.')}}
function settle(){const sh=cs();for(let i=0;i<6;i++)stepSet(sh,0);paint();panelUpd();pauseHint(sh)}`);
/* 5. several wires under the click: click again for the next one */
rep(`let bn=null,bd=tol;for(const s2 of S.seg){const d=anPtSeg(x,y,s2);if(d<bd){bd=d;bn=s2.net}}
 if(bn!=null&&S.nets[bn].dig){digClick(sh,bn,e.shiftKey);return}`,`const cd=new Map();for(const s2 of S.seg){const d=anPtSeg(x,y,s2);if(d<tol){const o=cd.get(s2.net);if(o===undefined||d<o)cd.set(s2.net,d)}}
 const cl=[...cd.entries()].sort((a,b)=>a[1]-b[1]).map(q=>q[0]);let bn=cl.length?cl[0]:null,cyc=false;
 if(cl.length>1){const key=cl.join(','),pk=AN._pk;if(pk&&pk.sh===sh.name&&pk.key===key&&Math.hypot(pk.x-x,pk.y-y)<tol*.8){pk.i=(pk.i+1)%cl.length}else AN._pk={sh:sh.name,x,y,key,i:0};bn=cl[AN._pk.i];cyc=true;msg('Several wires are here ('+(AN._pk.i+1)+' of '+cl.length+'): click again for the next one.')}else AN._pk=null;
 if(bn!=null&&S.nets[bn].dig&&!cyc){digClick(sh,bn,e.shiftKey);return}`);
/* 6. panel: every tagged wire and every AO / I/P / controller / selector output can be forced from a list */
rep(`const ORDER=['Digital inputs','Analog inputs','Setpoints & constants','Timers','Controllers','From other sheets']`,`const ORDER=['Digital inputs','Analog inputs','Setpoints & constants','Timers','Controllers','Signals to force','From other sheets']`);
rep(`det.open=!(nmSec==='Setpoints & constants'||nmSec==='From other sheets');`,`det.open=!(nmSec==='Setpoints & constants'||nmSec==='From other sheets'||nmSec==='Signals to force');`);
rep(`/* signals that come from another sheet through a numbered circle */`,`/* every wire that a block drives and that has a tag, plus the outputs of AO / I/P / controllers / switches: FORCE from here (no need to hit the wire with the mouse) */
 {const KD=['AO','IP','PID','PIDV','MAN','AI','SW','AMT','SEL','HS','LS','LLIM','HLIM','FX','SUM','SUB','DEV','MUL','DIV','LAG','RATE','RAMPB','ACT'],stable=(f)=>{const n0=PU.length,e=f();for(let i=n0;i<PU.length;i++)delete PU[i]._s;return e};
  S.nets.forEach(nn=>{const n=nn.id;if(!nn.segs.length||S.ext.includes(n)||(S.xlk&&S.xlk[n]))return;const dv=S.drv[n].find(d=>d.k!=='LINK');if(!dv)return;const tagged=!!S.lab[n];if(!tagged&&!KD.includes(dv.k))return;if(dv.k==='IP'&&S.nets[n].pn&&!S.cns[n].some(c=>c.k==='VLV'))return;
   const wd=wireDesc(n),sg0=S.seg[nn.segs[0]],pos=S.lab[n]?{x:S.lab[n].x,y:S.lab[n].y}:(sg0?{x:sg0.x1,y:sg0.y1}:null),nameT=S.lab[n]?S.lab[n].t:(dv.k==='AO'?'AO output':dv.k==='IP'?'I/P output → valve':dv.k+' output');
   mkRow(grp('Signals to force',tagged?'Tagged signals':'Block outputs'),'f'+n,nameT,wd.desc||('from '+dv.k),[livev(n,nn.dig),stable(()=>forceCtl(S,sh,n))],pos)})}
 /* signals that come from another sheet through a numbered circle */`);
fs.writeFileSync('ditl-workbench-v1.8.0.html',h);console.log('written',h.length);
