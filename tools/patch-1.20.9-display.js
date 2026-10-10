/* v1.20.9 display / input fixes from the user's manual tests (2026-10-10) */
module.exports=(rep,repAll)=>{
/* MT-02/03: a value typed (FORCE) on the AI output net updated the ALM but not the AI address: the address read the AI's own value (act), not the net. Now: a forced net shows the net value. */
rep(`(b.ai!=null&&S.rt.st[b.ai]?fmt(S.rt.st[b.ai].act):S.nets[b.n].dig?`,`(b.ai!=null&&S.rt.st[b.ai]&&S.rt.force[b.n]===undefined?fmt(S.rt.st[b.ai].act):S.nets[b.n].dig?`);
/* user: no value beside the ALM (its address is inside the ALM box) and none beside the instrument tag of a transmitter: the AI address is enough. L.addrN = nets that already have an address value. */
rep(`for(const a of S.addr||[]){const n=a.n,s=a.t;if(!S.nets[n]||(S.nets[n].dig&&a.ai==null))continue;`,`const an_=L.addrN=new Set();
  for(const a of S.addr||[]){const n=a.n,s=a.t;if(!S.nets[n]||(S.nets[n].dig&&a.ai==null))continue;if(/tag -> AI block/.test(a.how)||S.blk.some(q=>q.k==='ALM'&&a.x>=q.x0-.5&&a.x<=q.x1+.5&&a.y>=q.y0-.5&&a.y<=q.y1+.5))continue;an_.add(n);if(a.eng!=null)an_.add(a.eng);`);
/* WIRE VALUES back (user rules 6 - 8, "Wire values" toggle): a number on every ANALOG wire / net that has no address text. Default ON. */
rep(`bFit,bVal,sLv`,`bFit,bVal,bWv,sLv`);
rep(`bWv.onclick=()=>{AN.wireVals=!AN.wireVals;bWv.classList.toggle('on',AN.wireVals);paint()};`,`bWv.onclick=()=>{AN.wireVals=!AN.wireVals;bWv.classList.toggle('on',AN.wireVals);try{localStorage.setItem('ls-wirevals',AN.wireVals?'1':'0')}catch(e){}paint()};{let v=null;try{v=localStorage.getItem('ls-wirevals')}catch(e){}AN.wireVals=v!=='0';bWv.classList.toggle('on',AN.wireVals)}`);
rep(`bWv=h$('button',{txt:'Wire values',title:'Also show numbers on bare wires and block outputs that have no address (off: values are shown only beside an address)'})`,`bWv=h$('button',{txt:'Wire values',title:'Show the number on analog wires that have NO address text (a wire with an address shows its value beside the address only). Computed by the blocks. On / off.'})`);
rep(`if(b.wire&&!b.skip){const sw='none';`,`if(b.wire&&!b.skip){const sw=AN.wireVals&&!(L.addrN&&L.addrN.has(b.n))&&!S.nets[b.n].dig?'':'none';`);
/* MT-03: the wire from the SIG.AB junction into the SELECT CIRCUIT is the analog signal of the transmitter (with its status): lit like an analog wire; grey only when the transmitter is flagged BAD (that input is excluded from the average) */
rep(`function anSelIn(S,blk,n){const g=(S.sigab||[]).find(q=>q.net===n);if(!g||!g.d2)return n;let best=null,bd=60;for(const a of blk){if(a.k!=='AI')continue;const d=Math.hypot(a.cx-g.d2.x,a.cy-g.d2.y);if(d<bd){bd=d;best=a}}const o=best&&best.pins.find(p=>p.role==='out');return o?o.n:n}`,`function anSelIn(S,blk,n){/* v1.20.9: by CONNECTION (the transmitter whose output wire is the trunk wire of the SIG.AB box), never by distance */const g=(S.sigab||[]).find(q=>q.net===n);if(!g||!g.L)return n;const ai=blk.find(a=>a.k==='AI'&&a.pins.some(p=>p.role==='out'&&p.n===g.L.net));const o=ai&&ai.pins.find(p=>p.role==='out');return o?o.n:n}`);
rep(`const s2=ins.slice().sort((p,q)=>p.x-q.x);b.i=s2.map(p=>anSelIn(S,blk,p.n));`,`const s2=ins.slice().sort((p,q)=>p.x-q.x);b.i=s2.map(p=>{const m=anSelIn(S,blk,p.n);if(m!==p.n)(S.selw=S.selw||{})[p.n]=m;return m});`);
rep(`const lk=(S.look||{})[n.id];if(lk&&!AN.view){if(lk.c&&COLS[lk.c]&&!isD)c=COLS[lk.c];if(lk.w)w*=lk.w}`,`if(S.selw&&S.selw[n.id]!=null&&!AN.view){c=v[n.id]>.5?'#3b4651':ANC;w=wa_;o=1}
  const lk=(S.look||{})[n.id];if(lk&&!AN.view){if(lk.c&&COLS[lk.c]&&!isD)c=COLS[lk.c];if(lk.w)w*=lk.w}`);
/* MT-03: typed values must stay inside the range written on the drawing (FORCE box of a net, field inputs): limited, with a message. A net without a written range is not limited. */
rep(`function anFXs(P,x){`,`function anNetRange(S,n){const d=(S.drv[n]||[])[0],bl=d&&(d.i===undefined&&d.id!==undefined?S.blk.find(z=>z.id===d.id):d);if(!bl)return null;if(bl.k==='AI'&&bl.rng&&bl.rng.hi>bl.rng.lo)return{lo:bl.rng.lo,hi:bl.rng.hi,u:bl.rng.u||''};if(bl.k==='MAN'&&bl.p&&bl.p.hi>bl.p.lo)return{lo:bl.p.lo,hi:bl.p.hi,u:bl.p.u||''};if((bl.k==='PID'||bl.k==='PIDV')&&bl.p&&bl.p.hi>bl.p.lo)return{lo:bl.p.lo,hi:bl.p.hi,u:'%'};return null}
function anExtRange(S,n){const sg0=S.seg[S.nets[n].segs[0]],r=anRange(S,{cx:sg0?sg0.x1:0,cy:sg0?sg0.y1:0},45);return r&&r.hi>r.lo?r:null}
function anClamp(r,x){if(!r||!(r.hi>r.lo))return{x,cut:false};const y=Math.max(r.lo,Math.min(r.hi,x));return{x:y,cut:y!==x}}
function anFXs(P,x){`);
repAll(`setE=x=>{S.rt.ext[n]=x;(sv(sh).ext=sv(sh).ext||{})[n]=x;anSave();settle()}`,`setE=x=>{if(!S.nets[n].dig){const c_=anClamp(anExtRange(S,n),x);if(c_.cut){const r_=anExtRange(S,n);msg('Limited to the range written on the drawing: '+r_.lo+' ~ '+r_.hi+' '+r_.u)}x=c_.x}S.rt.ext[n]=x;(sv(sh).ext=sv(sh).ext||{})[n]=x;anSave();settle()}`,2);
rep(`const acc=()=>{const v=parseFloat(i.value);if(isFinite(v)){i._clr();setForce(sh,n,v)}else msg('Type a number first, then press ✓')}`,`const acc=()=>{let v=parseFloat(i.value);if(isFinite(v)){i._clr();const r_=anNetRange(S,n)||(S.ext.includes(n)?anExtRange(S,n):null),c_=anClamp(r_,v);if(c_.cut)msg('Limited to the range written on the drawing: '+r_.lo+' ~ '+r_.hi+' '+r_.u);setForce(sh,n,c_.x)}else msg('Type a number first, then press ✓')}`);
/* user: no value on ALM wires (neither its input nor its output stub) */
rep(`const PASS=['IP','AO','PO','TP','FIELD','VLV','ACT'],`,`const PASS=['IP','AO','PO','TP','FIELD','VLV','ACT','ALM'],`);
/* an old badge that no address adopted is a WIRE value; it keeps its own skip flag (valve / AO / ALM chain stays hidden) */
rep(`for(const q of oldB)if(!used.has(q)&&!q.circ){q.wire=true;q.skip=false}`,`for(const q of oldB)if(!used.has(q)&&!q.circ){q.wire=true}`);
/* user (MT-04): the output wire of a constant has a value too */
rep(`(D.length&&D.every(d=>PASS.includes(d.k)||d.k==='CONST'))`,`(D.length&&D.every(d=>PASS.includes(d.k)))`);
/* High / low selector: the leg of the NOT selected input (from its pin to the first junction) is dimmed like the unselected leg of a T switch, also when the wire is shared with another block (then only that branch is dimmed) */
rep(`for(const b of S.blk){if(!(b.k==='SW'||b.k==='AMT')||b.a<0||b.b<0||b.a===b.b)continue;
   for(const side of['a','b']){const n=b[side],net=S.nets[n]`,`for(const b of S.blk){const hl=(b.k==='HS'||b.k==='LS')&&b.i.length>1&&new Set(b.i).size===b.i.length;if(!hl&&(!(b.k==='SW'||b.k==='AMT')||b.a<0||b.b<0||b.a===b.b))continue;
   for(const side of(hl?b.i.map((_,k)=>'h'+k):['a','b'])){const n=hl?b.i[+side.slice(1)]:b[side],net=S.nets[n]`);
rep(`const q=S.rt.st[g.b.id],pk=q&&q.pk==='B'?'B':'A',dim=!AN.view&&(g.side==='a')===(pk==='B'),ne=L.nets[g.n];`,`const q=S.rt.st[g.b.id],pk=q&&q.pk==='B'?'B':'A',dim=!AN.view&&(g.side[0]==='h'?g.n!==anHL(S,g.b):(g.side==='a')===(pk==='B')),ne=L.nets[g.n];`);
/* Group B: unresolved things are shown ON the drawing (amber dashed box + short text): unknown shape, block with a missing pin, F(X) without a table / with a warning, RATE / ramp whose span could not be found. Button "Review marks" (default ON). They are NEEDS REVIEW: the result there is not verified. */
rep(`bWv=h$('button',{txt:'Wire values',`,`bRv=h$('button',{txt:'Review marks',title:'Amber dashed boxes on the drawing where the reader could not recognise a shape, a pin is missing, an F(X) has no table or a RATE has no span: the result there is NOT verified (NEEDS REVIEW).'}),bWv=h$('button',{txt:'Wire values',`);
rep(`bFit,bVal,bWv,sLv`,`bFit,bVal,bWv,bRv,sLv`);
rep(`bWv.onclick=()=>{AN.wireVals=`,`bRv.onclick=()=>{AN.rv=!AN.rv;bRv.classList.toggle('on',AN.rv);try{localStorage.setItem('ls-reviewmarks',AN.rv?'1':'0')}catch(e){}paint()};{let v=null;try{v=localStorage.getItem('ls-reviewmarks')}catch(e){}AN.rv=v!=='0';bRv.classList.toggle('on',AN.rv)}
 bWv.onclick=()=>{AN.wireVals=`);
rep(`function badMarks(){`,`function reviewMarks(){const sh=cs();if(!sh||!sh.S||!L||!L.gb||!L.gb.parentNode)return;const S=sh.S;let g=L.rvg;if(!g||!g.isConnected){g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('pointer-events','none');g.setAttribute('id','reviewmarks');L.gb.parentNode.insertBefore(g,L.gb);L.rvg=g;g._k=null}
 if(!AN.rv){if(g._k!=='off'){g._k='off';g.textContent=''}return}
 if(g._k===sh.name+'|on')return;
 const m=[];const used=new Set(S.blk.map(b=>b.sh));
 for(const s of S.shp)if(!used.has(s)&&s.w>2.5&&s.h>2.5&&s.w<30&&s.h<30&&!(S.gate||[]).some(q=>q.box===s))m.push([s.x0,s.y0,s.x1,s.y1,'?']);
 const E_={AI:[0,1],AO:[1,0],PID:[1,1],PIDV:[1,1],MAN:[1,1],AMT:[2,1],SW:[2,1],SUM:[1,1],DEV:[2,1],SUB:[2,1],DIV:[2,1],HC:[1,1],LC:[1,1],CMPK:[1,1],FX:[1,1],LAG:[1,1],RATE:[1,1],AND:[1,1],OR:[1,1],NOT:[1,1],FF:[1,1],TON:[1,1],TOF:[1,1],TPS:[1,1],SQRT:[1,1],HS:[1,1],LS:[1,1],HLIM:[1,1],LLIM:[1,1],CONST:[0,1],SIGAB:[0,1]};
 for(const b of S.blk){const e=b.k==='MAN'?null:E_[b.k];if(e){const i=b.pins.filter(p=>p.role==='in').length,o=b.pins.filter(p=>p.role==='out').length;if(i<e[0]||(e[1]&&!o&&b.k!=='AO'))m.push([b.x0,b.y0,b.x1,b.y1,'pin?'])}
  if(b.k==='FX'&&!(b.p.tbl&&(b.p.tbl.p2||b.p.tbl.pts))&&!(window.ANLN&&window.ANLN[b.p.ln]))m.push([b.x0,b.y0,b.x1,b.y1,'no table']);
  if((b.k==='RATE'||b.k==='RAMPB')&&b.p.spanUnres)m.push([b.x0,b.y0,b.x1,b.y1,'span?'])}
 g._k=sh.name+'|on';g.textContent='';
 for(const q of m){const r=document.createElementNS('http://www.w3.org/2000/svg','rect');r.setAttribute('x',q[0]-1);r.setAttribute('y',-q[3]-1);r.setAttribute('width',q[2]-q[0]+2);r.setAttribute('height',q[3]-q[1]+2);r.setAttribute('fill','none');r.setAttribute('stroke','#ffb24a');r.setAttribute('stroke-width','.5');r.setAttribute('stroke-dasharray','1.4 1');g.appendChild(r);const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',q[0]-1);t.setAttribute('y',-q[3]-1.6);t.setAttribute('font-size','2.6');t.setAttribute('fill','#ffb24a');t.setAttribute('stroke','#000');t.setAttribute('stroke-width','.4');t.setAttribute('paint-order','stroke');t.textContent=q[4];g.appendChild(t)}}
function badMarks(){`);
rep(`try{badMarks()}catch(e){}`,`try{badMarks()}catch(e){}try{reviewMarks()}catch(e){}`);
};
