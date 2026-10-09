/* THE ADDRESS TABLE (v1.20.6): one table  address text -> (sheet, net, how it was tied, gap, alternatives)  built ONCE per sheet.
   The engine (same address on several wires = one signal) and the display (one value beside each address text) both read S.addr; nothing else decides which net an address names.
   This file is the source of function anAddr(S); tools/patch-1.20.6.js inserts it into the analog script (above function anWire), the tests load it with tools/addr-lib.js.
   RULES (user 2026-10-09: "mali ang method; hindi dapat kung sino ang malapit; dapat iintindihin ang diagram at ang flow ng logic"):
   1. An address is tied to a SYMBOL or a WIRE END it belongs to, never to "the nearest wire that happens to be free".
      controller / station tag (PID, PIDV, MAN, SUMA, SUMP + .PV / .SV / .MV) -> the pin of that block;  AO#### -> the INPUT (command) pin of the AO block it is paired with;
      AI#### -> the OUTPUT pin of the AI block it is paired with;  valve / actuator tag -> the command pin of the block it is paired with;  circle tag -> the signal of its own circle;
      reader label -> the wire the reader found the label ON;  anything else -> only a wire whose box-gap to the text is small AND clearly smaller than the next wire (unique).
   2. PAIRING IS ONE TO ONE (a text belongs to one symbol, a symbol owns one text): the pairs are chosen by smallest gap first, not "each text takes the nearest".
   3. A text that cannot be tied without guessing is NOT given a value: it goes to S.addrUn with the reason (no wire / ambiguous between nets a, b) for the engineer to confirm on the drawing. No value is better than a wrong value.
   4. Distances are measured from the BOX of the text (start x, width = length x height x 0.62, height) to the wire, not from the start point of the text (a long address left of a vertical wire was 16 units away by the start point). */
function anAddr(S){
 const ADRE=/^(S\d\s*)?([A-Za-z]{1,6}\.?\d{3,6}[A-Za-z]?|[A-Z]{2,}[A-Z0-9\-]*\d[A-Z0-9\-]*)(\.(PV|SV|MV))?$/,
  SKIP=/^(LN\d+|ABC-\d+[A-Z]?|PTN\d+|SIG\.AB|PID|PIDV|MAN|SUMA|FX|HS|AI|AO|TR\d+|P[SM]\d{4}|P\.\d+|HOU\w*|STN\d*|MW\d*|FM\d*|DP\d*|S|AB|TCF\d*|MOF-.*|SC-L.*|INV-M.*)$/i,
  DIGRE=/^(S\d\s*)?[MBIO]\.[0-9A-Fa-f]{3,4}$/,
  nets=S.nets,TX=S.tx,out=[],un=[];
 const bx=t=>{/* box of the text with its DXF alignment: a = 0 left, 1 / 4 centre, 2 right; b = 0 / 1 baseline / bottom, 2 middle, 3 top (the same convention the reader uses for text boxes) */
  const h=t.h||3,s=String(t.t).trim(),w=s.length*h*.62,x0=t.a===2?t.x-w:(t.a===1||t.a===4)?t.x-w/2:t.x,y0=t.b===3?t.y-h:t.b===2?t.y-h/2:t.y;return{x0,x1:x0+w,y0,y1:y0+h}};
 const rd=(p,q)=>{const dx=Math.max(p.x0-q.x,0,q.x-p.x1),dy=Math.max(p.y0-q.y,0,q.y-p.y1);return Math.hypot(dx,dy)};
 const gapSeg=(r,s)=>{/* distance between the text box and a wire segment (0 when they touch / cross) */
  let t0=0,t1=1;const dx=s.x2-s.x1,dy=s.y2-s.y1;const P=[-dx,dx,-dy,dy],Q=[s.x1-r.x0,r.x1-s.x1,s.y1-r.y0,r.y1-s.y1];let hit=true;
  for(let i=0;i<4;i++){if(P[i]===0){if(Q[i]<0){hit=false;break}}else{const u=Q[i]/P[i];if(P[i]<0){if(u>t1){hit=false;break}if(u>t0)t0=u}else{if(u<t0){hit=false;break}if(u<t1)t1=u}}}
  if(hit&&t0<=t1)return 0;
  let d=Math.min(rd(r,{x:s.x1,y:s.y1}),rd(r,{x:s.x2,y:s.y2}));
  for(const[x,y]of[[r.x0,r.y0],[r.x1,r.y0],[r.x0,r.y1],[r.x1,r.y1]])d=Math.min(d,anPtSeg(x,y,s));
  return d};
 const gapNet=(r,n)=>{let d=1e9;for(const i of nets[n].segs)d=Math.min(d,gapSeg(r,S.seg[i]));return d};
 const gapBlk=(r,b)=>{if(b.x0==null)return 1e9;const dx=Math.max(b.x0-r.x1,0,r.x0-b.x1),dy=Math.max(b.y0-r.y1,0,r.y0-b.y1);return Math.hypot(dx,dy)};
 const live=n=>n!=null&&n>=0&&nets[n]&&nets[n].segs.length&&!nets[n].dig;
 const items=[],seen=new Set();
 for(const t of TX){const s=String(t.t).trim();if(!ADRE.test(s)||SKIP.test(s.replace(/^S\d\s*/,''))||DIGRE.test(s))continue;const kk=s+'|'+Math.round(t.x)+'|'+Math.round(t.y);if(seen.has(kk))continue;seen.add(kk);items.push({t,s,r:bx(t),n:null,how:null,gap:null,alt:[],why:null})}
 const done=it=>it.n!=null;
 const set=(it,n,how,gap)=>{it.n=n;it.how=how;it.gap=gap};
 /* (1) the tag of a controller / station names its own pin (.PV / .SV / .MV) or its output */
 const byTag=s=>{const base=s.replace(/\.(PV|SV|MV)$/i,''),suf=((/\.(PV|SV|MV)$/i.exec(s)||[])[1]||'').toUpperCase();const b=S.blk.find(q=>q.pins&&(q.txt||[]).some(z=>String(z).trim()===base));if(!b)return null;
  if(b.k==='PID'||b.k==='PIDV'){const pn=anPins(S,b);if(suf==='PV'&&pn)return{n:pn.pv,b};if(suf==='SV'&&pn)return{n:pn.sv,b};return{n:(b.o||[]).find(k=>live(k)&&(S.cns[k]||[]).length)??(b.o||[]).find(live)??(b.o||[])[0],b}}
  if(b.k==='ALM'||b.k==='TXD')return{n:(b.i||[])[0],b};
  const o=(b.o||[]).find(k=>live(k)&&(S.cns[k]||[]).length)??(b.o||[]).find(live)??(b.o||[])[0];return{n:o!=null?o:(b.i||[])[0],b}};
 for(const it of items){const q=S.blk.find(z=>z.pins&&['PID','PIDV','MAN','SUMA','SUMP'].includes(z.k)&&(z.txt||[]).some(x=>String(x).trim()===it.s.replace(/\.(PV|SV|MV)$/i,'')));if(!q)continue;const r=byTag(it.s);if(r&&live(r.n))set(it,r.n,'controller tag',0)}
 /* (2) symbols that carry an address beside them: AO triangle (command = its INPUT), AI triangle (its OUTPUT). One text per symbol, one symbol per text, smallest gap first. */
 const pairSym=(its,kinds,maxGap,netOf,how,margin)=>{const prs=[];for(const it of its)for(const b of S.blk){if(!kinds.includes(b.k)||b.cx==null)continue;const d=gapBlk(it.r,b);if(d<=maxGap)prs.push({it,b,d})}
  prs.sort((a,c)=>a.d-c.d);const ui=new Set(),ub=new Set();for(const p of prs){if(ui.has(p.it)||ub.has(p.b))continue;const n=netOf(p.b);if(!(live(n)||(p.b.k==='AI'&&n!=null&&n>=0&&nets[n]&&nets[n].segs.length)))continue;
   const others=prs.filter(z=>z.it===p.it&&z.b!==p.b&&!ub.has(z.b));if(margin&&others.length&&others[0].d-p.d<margin){p.it.why='ambiguous: symbols '+p.b.id+' ('+p.d.toFixed(1)+') and '+others[0].b.id+' ('+others[0].d.toFixed(1)+') are equally close';continue}
   ui.add(p.it);ub.add(p.b);set(p.it,n,how,p.d);if(p.b.k==='AI')p.it.ai=p.b.id;p.it.alt=others.map(z=>z.b.id+':'+z.d.toFixed(1))}};
 pairSym(items.filter(it=>!done(it)&&/^(S\d\s*)?AO\d{3,5}$/i.test(it.s)),['AO'],22,b=>(b.i||[])[0],'AO block input');
 /* tags that the reader tied to a block output: the AI triangle names its own output wire */
 pairSym(items.filter(it=>!done(it)&&/^(S\d\s*)?AI\d{3,5}$/i.test(it.s)),['AI'],32,b=>{const o=b.pins.find(q=>q.role==='out')||(b.pins.length===1?b.pins[0]:null);return o?o.n:null},'AI block output');
 /* (3) the tag of a link circle ("( FROM / TO ABC-xxx )", number / letter circles): the text must be right beside THAT circle (gap to the disc <= 12) and no other analog wire may be clearly closer than the circle's own wires (v1.20.3 / v1.20.4 tied SI0061 to SI0380 and SI0219 to the wrong circle by "nearest circle within r + 50"). One text per circle, one circle per text, smallest gap first. The value is the one of the circle wire that is right beside the text (all wires of one circle number are one signal, the engine links them). */
 {const CI=(S.conn||[]).concat(S.xc||[]).filter(c=>c.nets&&c.nets.some(live)),prs=[];
  const own=(it,c)=>{let g=1e9,n=null;for(const k of c.nets){if(!live(k))continue;const x=gapNet(it.r,k);if(x<g){g=x;n=k}}return{g,n}};
  for(const it of items){if(done(it))continue;for(const c of CI){const dc=Math.max(0,rd(it.r,{x:c.x,y:c.y})-c.r);if(dc>12)continue;const o=own(it,c);if(o.n==null)continue;
    let ob=1e9;for(const nn of nets){if(!nn.segs.length||nn.dig||c.nets.includes(nn.id))continue;ob=Math.min(ob,gapNet(it.r,nn.id))}
    if(ob<o.g-1&&dc+2>ob)continue;/* another wire is clearly closer than the circle AND than the circle disc itself: the text is the label of that wire, not of the circle */
    prs.push({it,c,dc,n:o.n,g:o.g})}}
  prs.sort((p,q)=>p.dc-q.dc);const ui=new Set(),uc=new Set();for(const p of prs){if(ui.has(p.it)||uc.has(p.c))continue;ui.add(p.it);uc.add(p.c);p.it.eng=p.c.nets.find(k=>(S.drv[k]||[]).some(d=>d.k!=='LINK'))??p.c.nets.find(k=>!(S.drv[k]||[]).length&&(S.cns[k]||[]).length)??p.c.nets[0];set(p.it,p.it.eng,'circle tag',p.dc);p.it.alt=prs.filter(z=>z.it===p.it&&z.c!==p.c).map(z=>(z.c.num||'?')+':'+z.dc.toFixed(1))}}
 for(const it of items){if(done(it))continue;let n=null,g=null;S.lab.forEach((l,m)=>{if(n==null&&l&&l.t===it.t.t&&Math.hypot(l.x-it.t.x,l.y-it.t.y)<1&&live(m)){n=m;g=l.d}});
  if(n==null&&items.filter(z=>z.t.t===it.t.t).length===1){/* the reader's tie of a text that has no position record: only when this string is written ONCE on the sheet (the same string at several places cannot be told apart by name) */const q=(S.tagN||[]).filter(z=>z.t===it.t.t&&!z.by&&live(z.n)).sort((a,b)=>a.d-b.d)[0];if(q){n=q.n;g=q.d}}
  if(n!=null)set(it,n,'label on wire (reader)',g)}
 /* (4) the tag of a block / valve / actuator, and the AI of the IO list: only a symbol that is NOT yet paired, one to one, within 70 */
 {const eq=items.filter(it=>!done(it)&&/^[A-Z]{2,4}-[A-Z]{1,3}\d/.test(it.s)),isT=it=>/^[A-Z]*T-/.test(it.s);
  pairSym(eq.filter(isT),['AI'],40,b=>{const o=b.pins.find(q=>q.role==='out')||(b.pins.length===1?b.pins[0]:null);return o?o.n:null},'transmitter tag -> AI block');
  pairSym(eq.filter(it=>!done(it)&&!isT(it)),['IP','AO','ACT','VLV','PO'],64,b=>(b.i||[])[0]!=null?b.i[0]:(b.o||[])[0],'valve / actuator tag -> command pin',8);
  pairSym(eq.filter(it=>!done(it)),['AI'],40,b=>{const o=b.pins.find(q=>q.role==='out')||(b.pins.length===1?b.pins[0]:null);return o?o.n:null},'instrument tag -> AI block')}
 for(const it of items){if(done(it))continue;const r=byTag(it.s);if(r&&live(r.n))set(it,r.n,'tag of a block',0)}
 /* (4b) an address written right beside the box of a constant / manual value (the "A" box of ABC-007 SI0168) names the wire that leaves that box */
 pairSym(items.filter(it=>!done(it)&&/^(S\d\s*)?(SI|AI)\d{3,5}$/i.test(it.s)),['CONST'],5,b=>{const o=b.pins.find(q=>q.role==='out');return o?o.n:(b.o||[])[0]},'constant box output',3);
 /* (5) a wire that carries no address yet, with the text right beside it: the BOX gap must be small and clearly smaller than the next wire, and only ONE text may claim the wire */
 {const named=new Set();S.lab.forEach((l,m)=>{if(l)named.add(m)});(S.tagN||[]).forEach(q=>{if(!q.by||q.by==='circle')named.add(q.n)});items.forEach(it=>{if(done(it))named.add(it.n)});
  const WMAX=10,MARGIN=3,cand=new Map();
  for(const it of items){if(done(it))continue;const c=[];for(const nn of nets){if(!nn.segs.length||nn.dig)continue;const g=gapNet(it.r,nn.id);if(g<=WMAX*2)c.push({n:nn.id,g,al:named.has(nn.id)})}c.sort((a,b)=>a.g-b.g);cand.set(it,c)}
  const claim=new Map();for(const[it,c]of cand){if(!c.length||c[0].g>WMAX){it.why=c.length?'nearest free wire is '+c[0].g.toFixed(1)+' away (limit '+WMAX+')':'no free analog wire beside the text';continue}
   if(c[1]&&c[1].g-c[0].g<MARGIN){it.why='ambiguous: wires '+c[0].n+' ('+c[0].g.toFixed(1)+') and '+c[1].n+' ('+c[1].g.toFixed(1)+') are equally close';it.alt=c.slice(0,3).map(z=>z.n+':'+z.g.toFixed(1));continue}
   (claim.get(c[0].n)||claim.set(c[0].n,[]).get(c[0].n)).push({it,g:c[0].g})}
  for(const[n,a]of claim){a.sort((p,q)=>p.g-q.g);const names=[...new Set(a.map(y=>y.it.s))];
   /* the SAME address written several times along one wire is one address; DIFFERENT addresses claiming one wire at nearly the same distance cannot be told apart */
   if(names.length>1&&a.find(y=>y.it.s!==a[0].it.s).g-a[0].g<MARGIN){for(const z of a)z.it.why='ambiguous: texts '+names.join(' / ')+' all claim wire '+n;continue}
   const w=a.filter(y=>y.it.s===a[0].it.s);for(const z of w)set(z.it,n,named.has(n)?'wire beside the text (wire has a second address)':'wire beside the text (unique)',z.g);for(const z of a.filter(y=>y.it.s!==a[0].it.s))z.it.why='wire '+n+' belongs to '+a[0].it.s}}
 for(const it of items){if(it.n==null)un.push({t:it.s,x:it.t.x,y:it.t.y,why:it.why||'no wire, symbol or circle of this address found',alt:it.alt});else out.push({t:it.s,x:it.t.x,y:it.t.y,x1:it.r.x1,h:it.t.h||3,n:it.n,eng:it.eng!=null?it.eng:it.n,ai:it.ai,how:it.how,gap:+(it.gap||0).toFixed(2),alt:it.alt})}
 S.addr=out;S.addrUn=un;return S}
