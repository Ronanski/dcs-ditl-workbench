/* v1.15 WIP: signal reach fixes found by tools/audit-reach.js (docs/FINDINGS.md section H). Called by tools/patch-1.15.1.js after patch-defaults.js.
   H-01  AI / AO triangles that point UP (apex up): the OUT pin is the pin at the APEX, not "the lower pin" (22 position feedback AIs next to the positioners had in / out swapped: their signal never reached the SIG.AB box).
   H-02  two AI boxes with the same tag on one sheet (the positioner feedback AI and the AI that feeds the MAN / PID PV) are ONE transmitter: the free one follows the one that follows the valve / actuator (the loop never saw the valve position). */
module.exports=(rep)=>{
rep(String.raw`for(const b of blk)if(b.k==='AI'||b.k==='AO'){const apy=b.y0;for(const p of b.pins)p.role=(p.y<=apy+b.sh.h*.45)?'out':'in';if(b.k==='AO')b.pins.forEach(p=>{p.role=p.y<=apy+b.sh.h*.45?'out':'in'})}`,
String.raw`for(const b of blk)if(b.k==='AI'||b.k==='AO'){const P3=b.sh.p,ys=P3&&P3.length===3?P3.map(q=>q[1]):null;let ay=b.y0;if(ys){const u=ys.find((y,i)=>ys.filter((z,j)=>j!==i&&Math.abs(z-y)<.5).length===0);if(u!==undefined)ay=u}const by=ys?ys.find(y=>Math.abs(y-ay)>.5):b.y1;for(const p of b.pins)p.role=Math.abs(p.y-ay)<=Math.abs(p.y-by)?'out':'in'}`);
rep(String.raw`function anDefaults(S){if(typeof AN_DEF==='undefined')return;`,
String.raw`function anDefaults(S){
 /* H-02 same tag, one transmitter */
 {const by={};for(const b of S.blk)if(b.k==='AI'){const o=b.pins.find(p=>p.role==='out'),t=o&&S.lab[o.n]?S.lab[o.n].t:null;if(t)(by[t]=by[t]||[]).push(b)}
  for(const t in by){const g=by[t];if(g.length<2)continue;const m=g.find(b=>b.fb);if(!m)continue;for(const b of g)if(b!==m&&!b.fb){b.fb=m.fb;b.twin=m;b.pins.filter(p=>p.role==='out').forEach(p=>{if(S._tr)S._tr[p.n]=m.fb.id})}}}
 if(typeof AN_DEF==='undefined')return;`);
/* H-03  AND gate = bar + small rectangle (two short prongs + closing line): the prongs were only accepted on layer CON; on ABC-003E (4 x), ... they are drawn on layer 0 / DCS-LP, so the gate was not read and the comparator output M.5012 went nowhere */
rep(String.raw`const hs=SG.filter(s=>!s.use&&s!==b&&/^CON$/i.test(s.l)&&`,String.raw`const hs=SG.filter(s=>!s.use&&s!==b&&/(CON$|^DCS-LP$|^0$)/i.test(s.l)&&`);
/* H-04  pulse timer written "TP" (ABC-004A TR16, 2 s) was not read as a timer (labels accepted: TON TOF TPS TPh): its input NOT dead-ended */
rep(String.raw`const lab=tt.find(q=>/^(TON|TOF|TPS|TPh)s?$/i.test(q.t.trim()));if(!lab)continue;`,String.raw`const lab=tt.find(q=>/^(TON|TOF|TPS|TPh|TP)s?$/i.test(q.t.trim()));if(!lab)continue;`);
/* H-05  gate bars up to 160 long were accepted; the OR bar of ABC-005 (M.0148, 5 inputs) is 168 long, so it stayed a plain wire and its inputs (the OR before it) dead-ended */
rep(String.raw`const BARMAX=160;`,String.raw`const BARMAX=200;`);
/* H-06  OR circle: radius up to 5.6 was accepted; the OR with many inputs drawn as one 168 long bar has a r = 6.8 circle (ABC-005 M.0148) */
rep(String.raw`R.ci.filter(c=>/(CON$|^DCS-LP$|^0$)/i.test(c.l)&&c.r>2.5&&c.r<5.6&&`,String.raw`R.ci.filter(c=>/(CON$|^DCS-LP$|^0$)/i.test(c.l)&&c.r>2.5&&c.r<7.2&&`);
/* H-07  SIG.AB box on the side of a junction: only the pieces of the wire on the BOX side of the junction are the "signal abnormal" wire. The piece collinear on the OTHER side (ABC-007: the wire to the H/ comparator) was cut from the AI as well, so AI0192 fed nothing. */
rep(String.raw`const lp=SG.filter(j=>Ls.includes(j)||(Math.abs(j.y1-j.y2)<.06&&Math.abs(L.y1-L.y2)<.06&&Math.abs(j.y1-L.y1)<.2)||(Math.abs(j.x1-j.x2)<.06&&Math.abs(L.x1-L.x2)<.06&&Math.abs(j.x1-L.x1)<.2));`,
String.raw`const bs=(j,hz)=>{const m=hz?(j.x1+j.x2)/2-d2.x:(j.y1+j.y2)/2-d2.y,w=hz?bx[0]-d2.x:bx[1]-d2.y;return Math.abs(w)<.3||Math.abs(m)<.3||(m>0)===(w>0)};
   const lp=SG.filter(j=>Ls.includes(j)||(Math.abs(j.y1-j.y2)<.06&&Math.abs(L.y1-L.y2)<.06&&Math.abs(j.y1-L.y1)<.2&&bs(j,true))||(Math.abs(j.x1-j.x2)<.06&&Math.abs(L.x1-L.x2)<.06&&Math.abs(j.x1-L.x1)<.2&&bs(j,false)));`);
/* H-08  timer label search radius = 2.2 x the radius of the D: a large D (r = 6.8, ABC-001D TOF TR221, label 15.9 away) lost its label and was not a timer: radius at least r + 10 */
rep(String.raw`const tt=near(a.x,a.y,a.r*2.2,q=>/^(TON|TOF|TPS|TPh|TP|TD)s?$/i.test(q.t.trim())`,String.raw`const tt=near(a.x,a.y,Math.max(a.r*2.2,a.r+10),q=>/^(TON|TOF|TPS|TPh|TP|TD)s?$/i.test(q.t.trim())`);
/* H-09  contact glyph (two small circles + bar, control arrow): the control arrow had to end 3.3 +- 2.2 beside the circle axis, ABC-055 (M.000A, BU-CMD) has it 0.6 beside it, so the glyph was not a contact and the T output dead-ended. Now: any digital arrow tip within 5.8 of the circle axis along the glyph. */
rep(String.raw`if(vert?(Math.abs(ar.x-(a.x-3.3))<2.2&&ar.y>b.y-1&&ar.y<a.y+1):(Math.abs(ar.y-(a.y-3.3))<2.2&&ar.x>a.x-1&&ar.x<b.x+1)||vert&&Math.abs(ar.x-(a.x+3.3))<2.2&&ar.y>b.y-1&&ar.y<a.y+1||!vert&&Math.abs(ar.y-(a.y+3.3))<2.2&&ar.x>a.x-1&&ar.x<b.x+1){ctl=n.id;cp=ar}`,
String.raw`if(vert?(Math.abs(ar.x-a.x)<5.8&&ar.y>b.y-1&&ar.y<a.y+1):(Math.abs(ar.y-a.y)<5.8&&ar.x>a.x-1&&ar.x<b.x+1)){ctl=n.id;cp=ar}`);
/* H-03b the closing line of the AND rectangle must lie between the two prongs (it took the nearest wire of the same length, on ABC-004B a T switch input wire, and cut the circle 21 link) */
rep(String.raw`const cl=SG.find(s=>!s.use&&s!==b&&(v?isV(s)&&Math.abs(s.x1-far)<.5:isH(s)&&Math.abs(s.y1-far)<.5)&&len(s)>3&&Math.abs(len(s)-(v?Math.abs(t.y1-u.y1):Math.abs(t.x1-u.x1)))<1.2);`,
String.raw`const cl=SG.find(s=>!s.use&&s!==b&&(v?isV(s)&&Math.abs(s.x1-far)<.5:isH(s)&&Math.abs(s.y1-far)<.5)&&len(s)>3&&Math.abs(len(s)-(v?Math.abs(t.y1-u.y1):Math.abs(t.x1-u.x1)))<1.2&&(v?Math.abs(Math.min(s.y1,s.y2)-Math.min(t.y1,u.y1))<1.2&&Math.abs(Math.max(s.y1,s.y2)-Math.max(t.y1,u.y1))<1.2:Math.abs(Math.min(s.x1,s.x2)-Math.min(t.x1,u.x1))<1.2&&Math.abs(Math.max(s.x1,s.x2)-Math.max(t.x1,u.x1))<1.2));`);
/* H-10  chain of touching circles: the arrow ends in the FIRST circle, the circles that touch it and share its wire (ABC-004A 21 -> 21/004B -> 21/004C, ABC-027 01/026 -> A) are more senders of the same signal (fan-out), not receivers: they were read as sources, so they could not pair (ABC-027 A) */
rep(String.raw`if(nl.size)(tgt?S.xc:S.conn).push({num,tgt,x:c.x,y:c.y,r:c.r,nets:[...nl],sink,tags,ref,lt:!tgt&&typeof num==='string'})}`,
String.raw`if(nl.size)(tgt?S.xc:S.conn).push({num,tgt,x:c.x,y:c.y,r:c.r,nets:[...nl],sink,tags,ref,lt:!tgt&&typeof num==='string'})}
 {const al=S.conn.concat(S.xc);for(let pass=0;pass<3;pass++)for(const c of al)if(!c.sink)for(const d of al)if(d!==c&&d.sink&&Math.abs(anD(c.x,c.y,d.x,d.y)-(c.r+d.r))<=1.5&&(c.nets.some(n=>d.nets.includes(n))||String(c.num)===String(d.num))){c.sink=true;c.chain=1;c.nets=[...new Set([...c.nets,...d.nets])];break}}`);
/* test hook: tools/test-paint.js reads the drawn wires (AN.dbgL = the drawing layer of the open sheet); it changes nothing */
rep(String.raw`function paint(){const sh=cs();if(!sh||!sh.S||!L)return;`,String.raw`function paint(){const sh=cs();if(!sh||!sh.S||!L)return;AN.dbgL=L;`);

/* saved values use net / block numbers: the new AND / OR / timer / contact blocks and merged nets move them, so the values saved by v1.14.x are dropped on the first start of this version (the user said he had saved nothing yet) */
rep(String.raw`const AN_PV=14;`,String.raw`const AN_PV=16;`);

/* H-12  an arrow that sits in a GAP of a straight wire (the wire stops at its base, the next piece starts at its tip: ABC-001C "MW" row, 001B "MWD" / "X", ABC-009A / B ...) splits the wire in two nets: the circle after the arrow had no driver, the signal never left the sheet. The two collinear pieces on both sides of such an arrow are one wire. Both arrow kinds: solid triangles (R.so) and inserted arrows (R.arw). */
rep(String.raw`/* a box with a cross (X) in the middle of a wire = hard-wired contact / signal break: the signal goes straight through */`,
String.raw`/* H-12: arrow in a gap of a straight wire */
  {const bridge=(tp,bm)=>{const L=anD(tp[0],tp[1],bm[0],bm[1]);if(L<1)return;const mx=(tp[0]+bm[0])/2,my=(tp[1]+bm[1])/2;if(R.ar.some(a=>a.r>2.5&&anD(a.x,a.y,mx,my)<a.r+3))return;/* the arrow inside the D of a timer separates its input from its output: no bridge */const ux=(tp[0]-bm[0])/L,uy=(tp[1]-bm[1])/L;
    const at=(x,y)=>{let r=-1,bd=.9;SG.forEach((q,i)=>{if(q.use)return;const dx=q.x2-q.x1,dy=q.y2-q.y1,l=Math.hypot(dx,dy)||1;if(Math.abs(dx*uy-dy*ux)/l>.05)return;for(const[px,py]of[[q.x1,q.y1],[q.x2,q.y2]]){const d=anD(px,py,x,y);if(d<bd){bd=d;r=i}}});return r};
    const a=at(tp[0],tp[1]),c=at(bm[0],bm[1]);if(a>=0&&c>=0&&a!==c&&f(a)!==f(c)){un(a,c);(S._br=S._br||[]).push([Math.round(tp[0]),Math.round(tp[1])])}};
   for(const so of R.so){if(so.p.length<3)continue;const P=so.p.slice(0,3);let bs=null;for(let k=0;k<3;k++){const b1=P[(k+1)%3],b2=P[(k+2)%3],bl=anD(b1[0],b1[1],b2[0],b2[1]);if(!bs||bl<bs.bl)bs={k,bl}}
    const q1=P[(bs.k+1)%3],q2=P[(bs.k+2)%3];bridge(P[bs.k],[(q1[0]+q2[0])/2,(q1[1]+q2[1])/2])}
   for(const w of R.arw){const a=w.a*Math.PI/180,dx=Math.cos(a),dy=Math.sin(a);bridge([w.x,w.y],[w.x-dx*w.s,w.y-dy*w.s])}}
  /* a box with a cross (X) in the middle of a wire = hard-wired contact / signal break: the signal goes straight through */`);

/* H-13  junction dots drawn as small CIRCLE entities on layer MEM (ABC-001B "MWD" and "X": 3 circles r 1.06 / 1.06 / 1.95 on the wire) were not junction dots, so the branch to the circle was a separate wire without a driver */
rep(String.raw` S.dot=R.dot.map(d=>({x:d.x,y:d.y,r:Math.max(d.r,.8)}));`,
String.raw` S.dot=R.dot.map(d=>({x:d.x,y:d.y,r:Math.max(d.r,.8)}));
 for(const c of R.ci)if(/^MEM$/i.test(c.l)&&c.r<=2.2&&!S.dot.some(d=>anD(d.x,d.y,c.x,c.y)<.8))S.dot.push({x:c.x,y:c.y,r:Math.max(c.r,.8)});`);

/* H-14  a receiving wire of a link takes the type (analog / digital) of the wire that SENDS: ABC-052 SW#13 "a" leg (circle LPB, from ABC-050 SI0163, an analog value) was drawn on the CON layer and so typed digital: it was drawn as a digital wire and its value was handled as a flag */
rep(String.raw` for(const l of out)if(l.to===sh){S.xlk=S.xlk||{};for(const n of l.toNets)if(S.ext.includes(n))S.xlk[n]=l}`,
String.raw` for(const l of out)if(l.to===sh){S.xlk=S.xlk||{};for(const n of l.toNets)if(S.ext.includes(n)){S.xlk[n]=l;try{const FS=l.from.S,fn=l.fromNets.find(m=>FS.drv[m].some(d=>d.k!=='LINK'));if(fn!==undefined&&!!FS.nets[fn].dig!==!!S.nets[n].dig&&!FS.nets[fn].sigab&&!S.nets[n].sigab)S.nets[n].dig=FS.nets[fn].dig}catch(e){}}}`);

/* H-15  AND gate drawn MIRRORED (inputs on the left of the long bar, output on the right edge of the box: ABC-001D M.201F & M.2032 -> M.2034): the short right edge was taken for the bar and the long bar for the closing line, so the gate had no pins. The longer of the two vertical lines is the bar. */
rep(String.raw`if(cl){S.gate.push({k:'AND',v,bar:b,bp,a0,a1,side:sd,out:v?{x:far,y:mid}:{x:mid,y:far},body:{x0:Math.min(bp,far),x1:Math.max(bp,far),y0:Math.min(t.y1,u.y1),y1:Math.max(t.y1,u.y1)},used:[b,t,u,cl]});[b,t,u,cl].forEach(s=>s.use=2)}}`,
String.raw`if(cl){let BB=b,BP=bp,A0=a0,A1=a1,SD=sd,FAR=far;const LB=SG.find(s=>!s.use&&s!==b&&s!==cl&&(v?isV(s)&&Math.abs(s.x1-far)<.5:isH(s)&&Math.abs(s.y1-far)<.5)&&len(s)>(v?Math.abs(t.y1-u.y1):Math.abs(t.x1-u.x1))+1.5&&(v?Math.min(s.y1,s.y2)<=Math.min(t.y1,u.y1)+.6&&Math.max(s.y1,s.y2)>=Math.max(t.y1,u.y1)-.6:Math.min(s.x1,s.x2)<=Math.min(t.x1,u.x1)+.6&&Math.max(s.x1,s.x2)>=Math.max(t.x1,u.x1)-.6));
   if(LB){BB=LB;BP=v?LB.x1:LB.y1;A0=v?Math.min(LB.y1,LB.y2):Math.min(LB.x1,LB.x2);A1=v?Math.max(LB.y1,LB.y2):Math.max(LB.x1,LB.x2);SD=-sd;FAR=bp;LB.use=2}
   S.gate.push({k:'AND',v,bar:BB,bp:BP,a0:A0,a1:A1,side:SD,out:v?{x:FAR,y:mid}:{x:mid,y:FAR},body:{x0:Math.min(BP,FAR),x1:Math.max(BP,FAR),y0:Math.min(t.y1,u.y1),y1:Math.max(t.y1,u.y1)},used:[b,t,u,cl]});[b,t,u,cl].forEach(s=>s.use=2)}}`);
/* H-16 */
rep(String.raw`function anDefaults(S){`,String.raw`function anDefaults(S){
 /* H-16 the small two-cell box above an I/P converter (valve positioner, field side) was read as a SUB with one input and no output: it is a field device */
 for(const b of S.blk)if(b.k==='SUB'&&b.o.length===0&&b.i.length===1&&b.pins.length===1)b.k='FIELD';`);

/* H-17  two circles with the same letter on one sheet and NO arrow on either (ABC-004A "A": the branch of wire SI0110 after F(X) LN23 and the circle that feeds the SUB): both were "receivers", so they never paired (and were sent to other sheets by a FROM text 40 units away). The one whose wire is driven by a block is the sender. */
rep(String.raw` S.link=[];const by={};for(const c of S.conn){(by[c.num]=by[c.num]||[]).push(c)}`,
String.raw` S.link=[];const by={};for(const c of S.conn){(by[c.num]=by[c.num]||[]).push(c)}
 for(const k in by){const g=by[k];if(g.length!==2||g.some(c=>c.sink||c.tgt))continue;const dr=c=>c.nets.some(n=>S.drv[n].some(d=>d.k!=='LINK'));const a=g.filter(dr);if(a.length===1&&!dr(g.find(c=>c!==a[0]))){a[0].sink=true;a[0].fromDriver=1}}`);
};
