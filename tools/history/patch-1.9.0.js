/* v1.8.1 -> v1.9.0 : smarter links (tag + "FROM ABC-xxx" text), selected T path always coloured, engineering theme, value placement that avoids text/lines/symbols. DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.8.1.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,90));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.8.1</title>','<title>DITL Logic Workbench v1.9.0</title>');
/* ---- reader: tags + FROM/TO text next to a circle ---- */
rep(`  if(nl.size)(tgt?S.xc:S.conn).push({num,tgt,x:c.x,y:c.y,r:c.r,nets:[...nl],sink})}`,`  const tags=TX.filter(q=>/^(S\\d\\s*)?[MB]\\.[0-9A-F]{3,5}[A-Z]?$|^(S\\d\\s*)?(AI|S[IO])\\d{3,5}$|^[A-Z0-9]{3,}[A-Z0-9-]*\\.(MV|PV|SV|REM|LOC|OUT|SIG)$/.test(q.t.trim())&&anD(q.x,q.y,c.x,c.y)<=c.r+24).sort((a,b)=>anD(a.x,a.y,c.x,c.y)-anD(b.x,b.y,c.x,c.y)).slice(0,4).map(q=>q.t.trim());
  let ref=null,rd=c.r+28;for(const q of TX){const m=/(FROM|TO)\\s+ABC[-\\s]?(\\d{3}[A-Z]?)/i.exec(q.t);if(m){const d=anD(q.x,q.y,c.x,c.y);if(d<rd){rd=d;ref={dir:m[1].toUpperCase(),code:m[2].toUpperCase()}}}}
  if(nl.size)(tgt?S.xc:S.conn).push({num,tgt,x:c.x,y:c.y,r:c.r,nets:[...nl],sink,tags,ref})}`);
/* ---- links ---- */
rep(`function addLink(out,sh,c,p,pc){const[a,b]=pairRoles(sh,c,p,pc);`,`function addLink(out,sh,c,p,pc,hint){let[a,b]=pairRoles(sh,c,p,pc);if(hint&&(a===null||b===null||a===b)){a=hint==='out';b=!a}`);
rep(` /* v1.0.1: a signal tag that is an OUTPUT on one sheet`,` /* v1.9.0: single circles that say "( FROM ABC-003A )" / "TO ABC-xxx": go to that drawing, match number + the M.xxxx tag written next to the circle */
 {const linked=new Set(out.map(l=>l.at.c));
  for(const c of S.conn){if(linked.has(c)||!c.ref)continue;const rc=role(sh,c);
   if(S.conn.some(q=>q!==c&&q.num===c.num&&role(sh,q)!==null&&rc!==null&&role(sh,q)!==rc))continue;
   let best=null;for(const p of AN.sheets){if(p===sh||!(codeOf(p.name)===c.ref.code||(!hasL(c.ref.code)&&famOf(p.name)===parseInt(c.ref.code,10))))continue;let PS;try{PS=ensure(p)}catch(e){continue}
    for(const q of PS.conn.filter(z=>z.num===c.num)){const[a,b]=pairRoles(sh,c,p,q),sc=(c.tags||[]).filter(t=>(q.tags||[]).includes(t)).length*4+(q.ref&&(q.ref.code===codeOf(sh.name)||(!hasL(q.ref.code)&&+q.ref.code===my))?2:0)+(a!==null&&b!==null&&a!==b?1:0);if(!best||sc>best.sc)best={sc,p,q}}}
   if(best&&best.sc>=1)addLink(out,sh,c,best.p,best.q,c.ref.dir==='FROM'?'in':'out')}}
 /* v1.0.1: a signal tag that is an OUTPUT on one sheet`);
rep(`  for(const n of S.ext){if(done.has(n))continue;const lb=S.lab[n];if(!lb||!TAGX.test(lb.t))continue;ix=ix||tagIndex();
   const c=(ix.get(lb.t)||[]).filter(q=>q.sh!==sh).find(q=>q.sh.S.nets[q.n].dig===S.nets[n].dig);if(!c)continue;`,`  for(const n of S.ext){if(done.has(n))continue;let lb=S.lab[n];
   /* v1.9.0: tag a bit further from the wire, and the "( FROM ABC-xxx )" text next to it, are used too */
   const near=(rx,mx)=>{let b=null,bd=mx;for(const t of S.tx){if(!rx.test(t.t.trim()))continue;for(const i of S.nets[n].segs){const d=anPtSeg(t.x,t.y,S.seg[i]);if(d<bd){bd=d;b=t}}}return b};
   if(!lb||!TAGX.test(lb.t)){const t=near(TAGX,9);if(!t)continue;lb={t:t.t.trim(),x:t.x,y:t.y}}
   const fr=near(/FROM\\s+ABC[-\\s]?\\d{3}/i,14),fm=fr&&/FROM\\s+ABC[-\\s]?(\\d{3}[A-Z]?)/i.exec(fr.t),rcode=fm&&fm[1].toUpperCase(),rs=rcode?AN.sheets.filter(p=>codeOf(p.name)===rcode||(!hasL(rcode)&&famOf(p.name)===parseInt(rcode,10))):[];
   ix=ix||tagIndex();let cl=(ix.get(lb.t)||[]).filter(q=>q.sh!==sh&&q.sh.S.nets[q.n].dig===S.nets[n].dig);
   if(rs.length){const pr=cl.filter(q=>rs.includes(q.sh));if(pr.length)cl=pr;else for(const p of rs){let PS;try{PS=ensure(p)}catch(e){continue}for(const q of PS.tagN||[])if(q.t===lb.t&&PS.drv[q.n].some(d=>d.k!=='LINK')&&PS.nets[q.n].dig===S.nets[n].dig&&p!==sh)cl.push({sh:p,n:q.n})}}
   const c=cl[0];if(!c)continue;`);
/* ---- T path colouring ---- */
rep(`if(b.o&&b.o.length&&b.o.every(o=>dead.has(o)))continue;live=true;break}`,`if((b.k==='SW'||b.k==='AMT')&&b.a>=0&&b.b>=0&&b.a!==b.b&&n===(uns(b)===b.a?b.b:b.a)){live=true;break}if(b.o&&b.o.length&&b.o.every(o=>dead.has(o)))continue;live=true;break}`);
/* ---- engineering theme ---- */
rep(`const AN={ws:{ac:'auto',`,`const AN={ws:{th:'color',ac:'auto',`);
rep(`const symC=(x,y)=>{const b=blkAt(x,y,.6);if(b)return anKcol(b.k);`,`const ENG=AN.ws.th==='eng',symC=(x,y)=>{const b=blkAt(x,y,.6);if(b)return ENG?'#f1f5f8':anKcol(b.k);`);
rep(`const tcol=t=>{const b=blkAt(t.x,t.y,0);return b?anKcol(b.k):'#d5dde3'};`,`const tcol=t=>{const b=blkAt(t.x,t.y,0);return ENG?'#f1f5f8':b?anKcol(b.k):'#d5dde3'};`);
rep(`t.style.fill='#d8c4ff';L.ov.push({b,k:'TMR'`,`t.style.fill=ENG?'#f1f5f8':'#d8c4ff';L.ov.push({b,k:'TMR'`);
rep(`const sRmp=h$('select',`,`const sTh=h$('select',{title:'Drawing theme: Colour = symbols coloured by type · Engineering = white symbols and text, only the wires, live values and valves are coloured'},[['color','Theme: Colour'],['eng','Theme: Engineering']].map(([v,t])=>h$('option',{value:v,txt:t})));
sTh.onchange=()=>setTheme(sTh.value);
function setTheme(v){AN.ws.th=v;if(v==='eng'&&AN.ws.vc==='green')AN.ws.vc='white';else if(v!=='eng'&&AN.ws.vc==='white')AN.ws.vc='green';wsSave();AN.wsr++;AN.key=null;try{render()}catch(e){}}
const sRmp=h$('select',`);
rep(`bar.append(catB[1],bRun,sSpd,bRst,bFit,bVal,sLv,`,`bar.append(catB[1],bRun,sSpd,bRst,bFit,bVal,sLv,sTh,`);
rep(`function anRender(){const svg=$('svg'),sh=cs();anSide();`,`function anRender(){const svg=$('svg'),sh=cs();anSide();sTh.value=AN.ws.th||'color';`);
rep(`s.onchange=()=>{AN.ws[key]=/^[0-9.]+$/`,`s.onchange=()=>{if(key==='th'){setTheme(s.value);sTh.value=s.value;return}AN.ws[key]=/^[0-9.]+$/`);
rep(`d.append(h$('b',{txt:'Digital wires (saved)'})`,`d.append(h$('b',{txt:'Theme'}),sel('Drawing','th',[['color','Colour (symbols by type)'],['eng','Engineering (white symbols and text)']]),h$('b',{txt:'Digital wires (saved)'})`);
/* ---- value placement ---- */
const a=h.indexOf(' const place=(ax,ay,chars,below)=>'),b=h.indexOf(' const PASS=[\'IP\'');if(a<0||b<0)throw new Error('place block');
h=h.slice(0,a)+` const sc0=(bx,tb,bb,wb,pb)=>{let s=0;for(const t of tb)s+=ovl(bx,t)*30;for(const q of bb)s+=ovl(bx,q)*20;for(const q of pb)s+=ovl(bx,q)*40;for(const q of wb)s+=ovl(bx,q)*8;return s};
 const place=(ax,ay,chars,below,nopush)=>{const w=chars*bs*.62,h=bs*.95,R2=26,nr=A=>A.filter(q=>q[2]>ax-R2&&q[0]<ax+R2&&q[3]>ay-R2&&q[1]<ay+R2),tb=nr(TB),bb=nr(BB),wb=nr(WB),pb=nr(PB);let best=null;const dirs=below?[[0,-1],[1,-1],[-1,-1],[0,1],[1,1],[-1,1],[1,0],[-1,0]]:[[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1],[1,0],[-1,0]];
  for(const r of [1.4,2.4,3.6,5.2,7.5,10]){for(const[hx,hy]of dirs){const x0=hx>0?ax+r:hx<0?ax-r-w:ax-w/2,y0=hy>0?ay+r*.4:hy<0?ay-r*.4-h:ay-h/2,bx=[x0,y0,x0+w,y0+h],ov=sc0(bx,tb,bb,wb,pb),sc=ov+r*.5;if(!best||sc<best.sc)best={sc,ov,x:x0,y:y0,bx}}
   if(best&&best.ov<.01)break}
  if(!nopush)PB.push(best.bx);return best};
 /* no address text: walk along the 3 longest wire pieces of the net and sit just above / below (or beside a vertical one), clear of everything else */
 const placeAny=(n,chars)=>{const w=chars*bs*.62,h=bs*.95,own=new Set(S.nets[n].segs),ss=S.nets[n].segs.map(i=>S.seg[i]).map(s=>({s,L:Math.hypot(s.x2-s.x1,s.y2-s.y1)})).sort((u,v)=>v.L-u.L).slice(0,3);let best=null;
  for(const{s}of ss){const hz=Math.abs(s.y1-s.y2)<.06,vz=Math.abs(s.x1-s.x2)<.06;for(const t of[.5,.3,.7]){const x=s.x1+(s.x2-s.x1)*t,y=s.y1+(s.y2-s.y1)*t,R2=26,nr=A=>A.filter(q=>q[2]>x-R2&&q[0]<x+R2&&q[3]>y-R2&&q[1]<y+R2),tb=nr(TB),bb=nr(BB),pb=nr(PB),wb=WB.filter((q,i)=>!(own.has(i)&&(hz||vz))&&q[2]>x-R2&&q[0]<x+R2&&q[3]>y-R2&&q[1]<y+R2);
    const c=hz?[[x-w/2,y+.5],[x-w/2,y-.5-h]]:vz?[[x+.7,y-h/2],[x-.7-w,y-h/2]]:[[x+.7,y+.5],[x+.7,y-.5-h],[x-.7-w,y+.5],[x-.7-w,y-.5-h]];
    for(const[x0,y0]of c){const bx=[x0,y0,x0+w,y0+h],ov=sc0(bx,tb,bb,wb,pb),sc=ov+Math.abs(t-.5)*2;if(!best||sc<best.sc)best={sc,ov,x:x0,y:y0,bx}}}}
  return best};
`+h.slice(b);
rep(`const addB=(n,ax,ay,below)=>{if(placed.has(n))return;const sk=skipB(n);placed.add(n);const q=place(ax,ay,6,below),t=`,`const addB=(n,ax,ay,below)=>{if(placed.has(n))return;const sk=skipB(n);placed.add(n);let q=place(ax,ay,6,below,true);if(q.ov>.01){const r=placeAny(n,6);if(r&&r.ov<q.ov-.01)q=r}PB.push(q.bx);const t=`);
fs.writeFileSync('ditl-workbench-v1.9.0.html',h);console.log('ok',h.length);
