/* v1.1.0 -> v1.2.0 : analog inputs instant, timer animation on the drawing, control valves (colour + travel), I/P air supply is not an input, analog wires always coloured, "followed path" through T switches */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.1.0.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,80));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,80));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.1.0</title>','<title>DITL Logic Workbench v1.2.0</title>');
/* a. analog inputs jump to the value you type (the old 5%/s ramp looked like "nothing happens") */
rep(`const AN={ramp:.05,`,`const AN={ramp:0,`);
rep(`localStorage.getItem('ditl.an.ramp')`,`localStorage.getItem('ditl.an.ramp2')`);
rep(`localStorage.setItem('ditl.an.ramp',String(AN.ramp))`,`localStorage.setItem('ditl.an.ramp2',String(AN.ramp))`);
rep(`if(sRmp.value!==String(AN.ramp)){sRmp.value='0.05'}`,`if(sRmp.value!==String(AN.ramp)){sRmp.value='0'}`);
/* b. valve symbol (bowtie): its 4 diagonals + 2 sides are NOT wires */
rep(` /* digital gate bodies on CON: bar + (square | circle) */`,` /* control valve = bowtie: two triangles tip to tip (4 diagonals meeting in one point + 2 parallel sides). Not wires. */
 S.valves=[];
 {const D=SG.filter(s=>!s.use&&!isH(s)&&!isV(s)&&len(s)>3&&len(s)<30),E4=.4,ends=[];for(const s of D){ends.push([s.x1,s.y1,s]);ends.push([s.x2,s.y2,s])}
  for(const p of ends){const g=ends.filter(q=>anD(q[0],q[1],p[0],p[1])<E4);if(g.length!==4)continue;const segs=[...new Set(g.map(q=>q[2]))];if(segs.length!==4||segs.some(q=>q.use))continue;
   const far=segs.map(s=>anD(s.x1,s.y1,p[0],p[1])<E4?[s.x2,s.y2]:[s.x1,s.y1]),xs=far.map(q=>q[0]),ys=far.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
   const vx=new Set(xs.map(x=>Math.round(x/.5))).size===2,hy=new Set(ys.map(y=>Math.round(y/.5))).size===2;if(!vx&&!hy)continue;if(x1-x0<3||y1-y0<3)continue;
   const onFar=(x,y)=>far.some(q=>anD(q[0],q[1],x,y)<E4),sides=SG.filter(s=>!s.use&&(vx?isV(s):isH(s))&&onFar(s.x1,s.y1)&&onFar(s.x2,s.y2));if(sides.length<1)continue;
   segs.forEach(s=>s.use=1);sides.forEach(s=>s.use=1);
   S.valves.push({x:p[0],y:p[1],x0,y0,x1,y1,tri:vx?[[[x0,y0],[p[0],p[1]],[x0,y1]],[[x1,y0],[p[0],p[1]],[x1,y1]]]:[[[x0,y0],[p[0],p[1]],[x1,y0]],[[x0,y1],[p[0],p[1]],[x1,y1]]]})}}
 /* digital gate bodies on CON: bar + (square | circle) */`);
rep(` /* NOT / AND / OR gates found earlier */`,` /* control valves: the wire that touches the tip (stem) carries the position demand (0-100 %, or a digital 1 = open) */
 for(const v of S.valves||[]){const pins=[];for(const s of S.seg)for(const[x,y]of[[s.x1,s.y1],[s.x2,s.y2]])if(anD(x,y,v.x,v.y)<=1.3&&!pins.some(p=>p.n===s.net))pins.push({n:s.net,x,y,role:'in'});
  blk.push({id:uid++,k:'VLV',fixed:1,v,x0:v.x0,y0:v.y0,x1:v.x1,y1:v.y1,cx:(v.x0+v.x1)/2,cy:(v.y0+v.y1)/2,txt:[],p:{},pins})}
 /* NOT / AND / OR gates found earlier */`);
rep(`case 'IP':{const m=ins.find(p=>p.side==='L')||ins[0];b.i=m?[m.n,...ins.filter(p=>p!==m).map(p=>p.n)]:[];break}`,`case 'IP':{const m=ins.find(p=>p.side==='L')||ins[0];b.i=m?[m.n]:[];/* the other input pin of an I/P is its air supply, not a signal */break}`);
rep(`   case 'ACT':{b.i=ins.map(p=>p.n);P.stroke=30;`,`   case 'VLV':{b.i=ins.map(p=>p.n);P.stroke=20;break}
   case 'ACT':{b.i=ins.map(p=>p.n);P.stroke=30;`);
rep(`if(b.k==='ACT'){s.pos=null}`,`if(b.k==='ACT'||b.k==='VLV'){s.pos=null}`);
rep(`case 'ACT':{const t=Math.max(0,Math.min(100,rd(b.i[0])));`,`case 'ACT':case 'VLV':{let x0=rd(b.i[0]);if(b.k==='VLV'&&b.i.length&&nets[b.i[0]].dig)x0=x0>.5?100:0;const t=Math.max(0,Math.min(100,x0));`);
rep(`s.pos+=Math.max(-st,Math.min(st,t-s.pos));if(b.o.length)out(s.pos);break}`,`s.pos+=Math.max(-st,Math.min(st,t-s.pos));s.mv=Math.abs(t-s.pos)>.05;if(b.o.length)out(s.pos);break}`);
rep(`else if(b.k==='ACT'){pr('stroke','Full stroke time (s)');`,`else if(b.k==='ACT'||b.k==='VLV'){pr('stroke','Full stroke time (s)');`);
/* c. overlays: valve + timer */
rep(`   if((b.k==='AO'||b.k==='ACT'||b.k==='PO')&&b.sh&&b.sh.p){`,`   if(b.k==='VLV'&&b.pins.length){const e=el('path',{d:b.v.tri.map(t=>'M'+t.map(q=>q[0]+' '+-q[1]).join('L')+'Z').join(''),fill:'#fff','fill-opacity':0,stroke:'#f1f6f9','stroke-width':.8,'stroke-linejoin':'round','pointer-events':'none'},gb),t=el('text',{x:b.x1+1.2,y:-b.cy+bs*.35,class:'bd','text-anchor':'start'},gb);L.ov.push({b,k:'VLV',e,t,last:null})}
   else if(['TON','TOF','TPS','TPV'].includes(b.k)){const w=b.x1-b.x0,tk=el('rect',{x:b.x0,y:-b.y0+.5,width:w,height:.9,fill:'#1a2229','pointer-events':'none',visibility:'hidden'},gb),fl=el('rect',{x:b.x0,y:-b.y0+.5,width:0,height:.9,fill:'var(--live)','pointer-events':'none',visibility:'hidden'},gb),t=el('text',{x:b.cx,y:-b.y0+1.4+bs*1.05,class:'bd','text-anchor':'middle'},gb);L.ov.push({b,k:'TMR',tk,fl,t,w,last:null})}
   else if((b.k==='AO'||b.k==='ACT'||b.k==='PO')&&b.sh&&b.sh.p){`);
rep(`  else if(o.k==='ACT'){const pos=st.pos==null?0:st.pos;`,`  else if(o.k==='VLV'){const pos=st.pos==null?0:st.pos,mv=!!st.mv,col=mv?'#ffffff':pos<=.5?'#35e08a':pos>=99.5?'#ff4d4d':'#4da3ff';key=pos.toFixed(0)+(mv?'m':'')+col;txt=pos.toFixed(0)+'%';fill=col;op=.3;if(o.last!==key)o.e.setAttribute('stroke',col)}
  else if(o.k==='TMR'){const sec=b.k==='TPV'?(b.xin>=0?v[b.xin]:0):b.p.sec,acc=st.acc||0,SC=sec>0?sec:1;let show=0,frac=0,t_='';
   if(b.k==='TON'){if(st.out){show=1;frac=1;t_='▲ '+sec.toFixed(1)+' / '+sec.toFixed(1)+' s'}else if(acc>0){show=1;frac=Math.min(1,acc/SC);t_='▲ '+acc.toFixed(1)+' / '+sec.toFixed(1)+' s'}}
   else if(b.k==='TOF'){if(st.out&&acc>0){show=1;const r_=Math.max(0,sec-acc);frac=r_/SC;t_='▼ '+r_.toFixed(1)+' s'}}
   else if(st.run){show=1;frac=Math.min(1,acc/SC);t_='▲ '+Math.min(acc,sec).toFixed(1)+' / '+sec.toFixed(1)+' s'}
   key=(show?'1':'0')+t_;txt=t_;if(o.last!==key){const vis=show?'visible':'hidden';o.tk.setAttribute('visibility',vis);o.fl.setAttribute('visibility',vis);o.fl.setAttribute('width',(o.w*frac).toFixed(2))}}
  else if(o.k==='ACT'){const pos=st.pos==null?0:st.pos;`);
/* d. the path that is followed: a wire that only feeds an input NOT selected by a T (directly or through blocks that only feed such inputs) is faint */
const d0=h.indexOf(' const dead=new Set();{const cnt=new Map();');if(d0<0)throw new Error('dead');const d1=h.indexOf('\n',d0);
h=h.slice(0,d0)+` let dk='';for(const b of S.blk)if(b.k==='SW'||b.k==='AMT'){const q=S.rt.st[b.id];dk+=q&&q.pk==='B'?'B':'A'}if(S._dk!==dk||!S._dead){S._dk=dk;S._dead=anDead(S)}const dead=S._dead;`+h.slice(d1);
rep(`if(isD){c='#35414a';w=n.dig?.3:.55;o=.55}else if(on){c=n.dig?'var(--live)':ANC;w=n.dig?.5:.7}else{c='#4a5660';w=n.dig?.35:.7}`,`if(isD){c='#35414a';w=n.dig?.3:.55;o=.55}else if(n.dig){if(on){c='var(--live)';w=.5}else{c='#4a5660';w=.35}}else{c=ANC;w=.7}/* analog: always coloured, a value (even 0) is flowing */`);
rep(`function anColor(){`,`/* nets that nobody follows right now (feed only a T input that is not selected, or blocks whose outputs are all such nets) */
function anDead(S){const dead=new Set(),N=S.nets.length,uns=b=>{const q=S.rt.st[b.id];return q&&q.pk==='B'?b.a:b.b};
 for(let it=0;it<12;it++){let ch=0;for(let n=0;n<N;n++){if(dead.has(n))continue;const C=S.cns[n];if(!C||!C.length)continue;let live=false;
   for(const b of C){if((b.k==='SW'||b.k==='AMT')&&b.a>=0&&b.b>=0&&b.a!==b.b&&n===uns(b)&&n!==b.sel)continue;if(b.o&&b.o.length&&b.o.every(o=>dead.has(o)))continue;live=true;break}
   if(!live){dead.add(n);ch=1}}if(!ch)break}
 return dead}
function anColor(){`);
/* legend: valve colours */
rep(`T active input</i>';return s}`,`T active input</i><i><svg width="46" height="12"><circle cx="6" cy="6" r="4" fill="#35e08a"/><circle cx="22" cy="6" r="4" fill="#ff4d4d"/><circle cx="38" cy="6" r="4" fill="#fff"/></svg>valve closed / open / moving</i>';return s}`);
fs.writeFileSync('ditl-workbench-v1.2.0.html',h);console.log('written',h.length);
