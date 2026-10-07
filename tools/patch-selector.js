/* v1.15 WIP: G-10 the 4-way selector with a text table: "(1) IF A-ASH COOLER AUTO ( M.021A )  SELECT to "a"" ... "(4) IF D-... ( M.021D ) SELECT TO "d"" (ABC-009A ash coolers, ABC-003E burner oil flow control). The conditions are memory flags that are NOT wires of the sheet (they are made in the DITL), so they are inputs in the block panel; the first true one (1 -> 4) picks its leg, none true: the last choice stays (first start: leg of (1)). Called by tools/patch-1.15.0.js after patch-signals.js. */
module.exports=(rep)=>{
rep(String.raw` const posOrder=(a,b)=>(b.y-a.y)||(a.x-b.x);`,
String.raw` /* G-10: 4-way selector table */
 {const IFL=TX.filter(t=>/^\(\d\)\s*IF\b/.test(t.t.trim()));
  if(IFL.length>=2){const cx=IFL.reduce((a,t)=>a+t.x,0)/IFL.length,cy=IFL.reduce((a,t)=>a+t.y,0)/IFL.length;
   const sw=blk.filter(b=>b.k==='SW'&&b.pins.filter(p=>p.role==='in').length>=5).sort((p,q)=>anD(p.cx,p.cy,cx,cy)-anD(q.cx,q.cy,cx,cy))[0];
   if(sw&&anD(sw.cx,sw.cy,cx,cy)<150){
    const ins=sw.pins.filter(p=>p.role==='in'),leg={a:-1,b:-1,c:-1,d:-1};
    for(const p of ins){const l=(p.lab||'').trim().toLowerCase();if(l==='a'||l==='b')leg[l]=p.n}
    for(const L of ['c','d']){let best=-1,bd=10;for(const t of TX){if(t.t.trim()!==L||anD(t.x,t.y,sw.cx,sw.cy)>45)continue;for(const p of ins){if(Object.values(leg).includes(p.n))continue;for(const i of nets[p.n].segs){const d=anPtSeg(t.x,t.y,S.seg[i]);if(d<bd){bd=d;best=p.n}}}}leg[L]=best}
    const cond=IFL.map(t=>{const m=/^\((\d)\)\s*IF\s+(.*?)\s*\(\s*([A-Z]\.[0-9A-F]{3,5}[A-Z]?)\s*\)/i.exec(t.t.trim());
     const se=TX.filter(q=>/SELECT\s*(TO)?\s*"?[a-d]"?\s*$/i.test(q.t.trim())&&Math.abs(q.y-t.y)<14&&q.x>t.x-12).sort((p,q)=>anD(p.x,p.y,t.x,t.y)-anD(q.x,q.y,t.x,t.y))[0];
     const lg=se&&/"?([a-d])"?\s*$/i.exec(se.t.trim());return m&&lg?{n:+m[1],txt:m[2],tag:m[3],leg:lg[1].toLowerCase()}:null}).filter(Boolean).sort((p,q)=>p.n-q.n);
    if(cond.length>=2&&cond.every(c=>leg[c.leg]>=0))sw.q4pre={leg,cond}}}}
 const posOrder=(a,b)=>(b.y-a.y)||(a.x-b.x);`);
rep(String.raw`b.i=[...dg.map(q=>q.n),b.a,b.b].filter(x=>x>=0);break}`,
String.raw`b.i=[...dg.map(q=>q.n),b.a,b.b].filter(x=>x>=0);if(b.q4pre){b.q4=b.q4pre;b.i=[...new Set([...b.i,...Object.values(b.q4.leg).filter(x=>x>=0)])];b.q4.cond.forEach((c,i)=>{if(P['c'+(i+1)]===undefined)P['c'+(i+1)]=0})}break}`);
rep(String.raw`case 'SW':case 'AMT':{const sel=b.sel>=0?B(rd(b.sel)):0;`,
String.raw`case 'SW':case 'AMT':{if(b.q4){const q=b.q4;let k=-1;for(let i=0;i<q.cond.length;i++)if(P['c'+(i+1)]>.5){k=i;break}if(k>=0)s.q4k=k;const lg=q.cond[s.q4k==null?0:s.q4k].leg;s.pk=lg.toUpperCase();s.q4l=lg;if(b.o.length)out(q.leg[lg]>=0?rd(q.leg[lg]):0);break}const sel=b.sel>=0?B(rd(b.sel)):0;`);
rep(String.raw`else if(b.k==='AMT'||b.k==='SW'||b.k==='COS'){`,
String.raw`else if(b.q4){const st=S.rt.st[b.id];b.q4.cond.forEach((c,i)=>{const k='c'+(i+1),cb=h$('input',{type:'checkbox'});cb.checked=P[k]>.5;cb.onchange=()=>pSet(sh,b,k,cb.checked?1:0);d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'('+c.n+') IF '+c.txt+' ('+c.tag+') → leg '+c.leg}),cb]))});
  const e=h$('span',{cls:'v'});const f=()=>{e.textContent=st.q4l?'leg '+st.q4l+' is in use':'-'};f._s=1;PU.push(f);f();d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'Selector'}),e]),h$('small',{txt:'4-way selector of the drawing: the conditions are memory flags ('+b.q4.cond.map(c=>c.tag).join(', ')+') made outside this sheet, so you set them here. The first true condition (1 to 4) picks its leg; none true: the last choice stays.'}))}
 else if(b.k==='AMT'||b.k==='SW'||b.k==='COS'){`);
};
