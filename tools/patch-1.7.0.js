/* v1.6.1 -> v1.7.0 : pneumatic (air) lines own colour + blink while the valve travels, actuator head symbol (state colour + blink), hatch marks are symbols, no value on constants, brighter analog */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.6.1.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,90));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.6.1</title>','<title>DITL Logic Workbench v1.7.0</title>');
rep(`const AN_PV=8;`,`const AN_PV=9;`);
/* ---- reader: hatch marks and actuator heads ---- */
rep(` /* digital gate bodies on CON: bar + (square | circle) */`,` /* hatch marks of a pneumatic line: two tiny parallel diagonals across a longer wire = symbol, not wires */
 S.hatch=[];
 {const T=SG.filter(s=>!s.use&&!isH(s)&&!isV(s)&&len(s)<3.6),LW=SG.filter(s=>!s.use&&len(s)>=6&&(isH(s)||isV(s)));
  for(const a of T){if(a.use)continue;const mx=(a.x1+a.x2)/2,my=(a.y1+a.y2)/2;const w=LW.find(l=>anPtSeg(mx,my,l)<.9);if(!w)continue;
   const b=T.find(q=>q!==a&&!q.use&&Math.abs((q.x1+q.x2)/2-mx)<1.8&&Math.abs((q.y1+q.y2)/2-my)<1.8&&anPtSeg((q.x1+q.x2)/2,(q.y1+q.y2)/2,w)<.9);
   if(b){a.use=1;b.use=1;a.hatch=1;b.hatch=1}}}
 /* actuator head of a valve: half disc (arc 180 degrees, not on the timer layer) + its straight chord */
 S.heads=[];
 for(const a of R.ar){if(Math.abs(((a.a1-a.a0+360)%360)-180)>8||a.r<3||a.r>10||/^CON$/i.test(a.l))continue;const up=(a.a0<8||a.a0>352)&&Math.abs(a.a1-180)<8,dn=Math.abs(a.a0-180)<8&&(a.a1>352||a.a1<8);if(!up&&!dn)continue;
  const ch=SG.find(s=>!s.use&&isH(s)&&Math.abs(s.y1-a.y)<.4&&Math.abs(len(s)-2*a.r)<1.2&&Math.abs((s.x1+s.x2)/2-a.x)<.8);if(!ch)continue;ch.use=1;S.heads.push({x:a.x,y:a.y,r:a.r,up})}
 /* digital gate bodies on CON: bar + (square | circle) */`);
rep(` for(const p of S.pills||[])blk.push(`,` for(const hd of S.heads||[]){const v=blk.find(b=>b.k==='VLV'&&Math.abs(b.cx-hd.x)<30&&Math.abs(b.cy-hd.y)<90);blk.push({id:uid++,k:'ACH',fixed:1,hd,vlv:v?v.id:-1,x0:hd.x-hd.r,x1:hd.x+hd.r,y0:hd.up?hd.y:hd.y-hd.r,y1:hd.up?hd.y+hd.r:hd.y,cx:hd.x,cy:hd.y,txt:[],p:{},pins:[]})}
 for(const p of S.pills||[])blk.push(`);
rep(`const AN_KC={TXD:'#e8c9a0',`,`const AN_KC={ACH:'#e8c9a0',TXD:'#e8c9a0',`);
/* ---- engine: pneumatic nets ---- */
rep(`case 'IP':{const m=ins.find(p=>p.side==='L')||ins[0];b.i=m?[m.n]:[];`,`case 'IP':{const m=ins.find(p=>p.side==='L')||ins[0];b.i=m?[m.n]:[];ins.forEach(p=>{if(p!==m)nets[p.n].pn=1});outs.forEach(p=>{nets[p.n].pn=1});`);
rep(`  S._tr={};for(const b of blk){`,`  for(const b of blk)if(b.k==='VLV'){const ip=b.pins[0]&&S.drv[b.pins[0].n].find(d=>d.k==='IP');b.pnl=ip?[...new Set(ip.pins.map(p=>p.n).filter(n=>nets[n].pn))]:[]}
  S._tr={};for(const b of blk){`);
/* ---- colours: pneumatic, brighter amber, thicker visible amber in the tube ---- */
rep(`const COLS={red:'#ff4d4d',`,`const COLS={sky:'#5cc8ff',red:'#ff4d4d',`);
rep(`orange:'#ff8a3d',amber:'#ffb020'},VCS=`,`orange:'#ff8a3d',amber:'#ffc233'},VCS=`);
rep(`const ANCS={amber:'#ffb020',`,`const ANCS={amber:'#ffc233',`);
rep(`dc:'live',ds:'solid',fc:'white',`,`dc:'live',ds:'solid',fc:'white',pc:'sky',`);
rep(`?'#35d0ff':'#ffb020'}`,`?'#35d0ff':'#ffc233'}`);
rep(`const wd_=(dTube?.95:.8)*dW,wa_=(tube?.95:.8)*aW;if(isD){`,`const wd_=(dTube?.95:.8)*dW,wa_=(tube?.95:.8)*aW,PNC=COLS[AN.ws.pc]||COLS.sky;document.documentElement.style.setProperty('--pnc',PNC);if(n.pn){c='var(--pnc)';w=.8*aW}else if(isD){`);
rep(`k.style.display=(n.dig?dTube:tube)?'':'none';k.setAttribute('stroke-width',w*.32);`,`k.style.display=(n.pn?false:(n.dig?dTube:tube))?'':'none';k.setAttribute('stroke-width',w*.22);`);
rep(`c=n.dig?(on?DCc:'#3b4651'):ANC;w=n.dig?wd_:wa_;o=.4}`,`c=n.dig?(on?DCc:'#3b4651'):ANC;w=n.dig?wd_:wa_;o=n.dig?.5:.68}`);
/* blink while the valve travels (pneumatic lines + actuator head) */
rep(`.lg{display:inline-flex;`,`@keyframes anblink{0%,100%{opacity:1}50%{opacity:.18}}.blink{animation:anblink .7s steps(2,jump-none) infinite}
.lg{display:inline-flex;`);
rep(`for(const k in S.pre||{}){`,`for(const k in S.pre||{}){`,true);
/* paint: toggle blink on the nets of every valve that moves */
rep(`document.documentElement.style.setProperty('--alv',anLite(ANC));`,`document.documentElement.style.setProperty('--alv',anLite(ANC));
 for(const b of S.blk)if(b.k==='VLV'&&b.pnl){const q=S.rt.st[b.id],mvb=!!(q&&q.mv);for(const id of b.pnl){const e=L.nets[id];if(e)e.classList.toggle('blink',mvb);const k=L.core&&L.core[id];if(k)k.classList.toggle('blink',mvb);for(const a of (L.arw&&L.arw[id])||[])a.classList.toggle('blink',mvb)}}`);
/* overlays: actuator head */
rep(`   else if(b.k==='COS'&&b.used&&b.sh&&b.sh.p){`,`   else if(b.k==='ACH'){const r=b.hd.r,e=el('path',{d:'M'+(b.hd.x-r)+' '+-b.hd.y+'A'+r+' '+r+' 0 0 '+(b.hd.up?1:0)+' '+(b.hd.x+r)+' '+-b.hd.y+'Z',fill:'none','stroke-width':.9,'stroke-linejoin':'round','stroke-linecap':'round','pointer-events':'none'},gp),t=el('text',{},gb);L.ov.push({b,k:'ACH',e,t,last:null})}
   else if(b.k==='COS'&&b.used&&b.sh&&b.sh.p){`);
rep(`  else if(o.k==='COS'){`,`  else if(o.k==='ACH'){const vq=S.blk.find(q=>q.id===b.vlv),vs=vq&&S.rt.st[vq.id],pos=vs&&vs.pos!=null?vs.pos:0,mv=!!(vs&&vs.mv),col=!vq?'#e8c9a0':mv?'#ffffff':pos<=.5?'#35e08a':pos>=99.5?'#ff4d4d':'#4da3ff';key=col+(mv?'m':'');txt='';fill=col;op=.22;o.e.classList.toggle('blink',mv);if(o.last!==key)o.e.setAttribute('stroke',col)}
  else if(o.k==='COS'){`);
/* hatch marks drawn in the pneumatic colour */
rep("const ln=q=>el('path',{d:`M${q.x1} ${-q.y1}L${q.x2} ${-q.y2}`,stroke:symC((q.x1+q.x2)/2,(q.y1+q.y2)/2)},gfg);","const ln=q=>el('path',{d:`M${q.x1} ${-q.y1}L${q.x2} ${-q.y2}`,stroke:q.hatch?'var(--pnc,#5cc8ff)':symC((q.x1+q.x2)/2,(q.y1+q.y2)/2)},gfg);");
/* values: none on constants (their number is written on the drawing) */
rep(`return(D.length&&D.every(d=>PASS.includes(d.k)))||`,`return(D.length&&D.every(d=>PASS.includes(d.k)||d.k==='CONST'))||`);
/* style card: pneumatic colour + legend line */
rep(`h$('b',{txt:'Forced wires (dashed)'})`,`h$('b',{txt:'Pneumatic (air) lines'}),sel('Colour','pc',[['sky','Sky blue'],['cyan','Cyan'],['white','White'],['green','Green'],['orange','Orange'],['magenta','Magenta']]),h$('b',{txt:'Forced wires (dashed)'})`);
rep(`<div class="it"><svg width="24" height="13"><line x1="0" y1="6" x2="24" y2="6" stroke="#35414a" stroke-width="2" opacity=".6"/></svg>faint: nobody follows it (T input not selected)</div>`,`<div class="it"><svg width="24" height="13"><line x1="0" y1="6" x2="24" y2="6" stroke="#35414a" stroke-width="2" opacity=".6"/></svg>faint: nobody follows it (T input not selected)</div><div class="it"><svg width="24" height="13"><line x1="0" y1="6" x2="24" y2="6" stroke="var(--pnc,#5cc8ff)" stroke-width="2.2"/></svg>pneumatic (air) line and actuator head: blink while the valve travels</div>`);
/* a value that belongs to a tagged wire (SI0166 ...) is put right under its tag */
rep(`const place=(ax,ay,chars)=>{`,`const place=(ax,ay,chars,below)=>{`);
rep(`const dirs=[[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1],[1,0],[-1,0]];`,`const dirs=below?[[0,-1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[1,1],[-1,1]]:[[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1],[1,0],[-1,0]];`);
rep(`const addB=(n,ax,ay)=>{if(placed.has(n)||skipB(n))return;placed.add(n);const q=place(ax,ay,6)`,`const addB=(n,ax,ay,below)=>{if(placed.has(n)||skipB(n))return;placed.add(n);const q=place(ax,ay,6,below)`);
rep(`S.lab.forEach((l,n)=>{if(l&&!S.nets[n].dig)addB(n,l.x,l.y+(l.h||3))});`,`S.lab.forEach((l,n)=>{if(l&&!S.nets[n].dig)addB(n,l.x+l.t.length*(l.h||3)*.3,l.y-.3,true)});`);
fs.writeFileSync('ditl-workbench-v1.7.0.html',h);console.log('written',h.length);
