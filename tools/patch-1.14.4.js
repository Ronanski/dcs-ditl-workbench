/* v1.14.3 -> v1.14.4 (WIP, not released). Reader fixes from the sheet-by-sheet verification (docs/FINDINGS.md). DITL page untouched.  usage: node tools/patch-1.14.4.js [out.html]  (reads archive/html/logic-sim-v1.14.3.html, or the root file before it is archived; writes logic-sim-v1.14.4.html) */
const fs=require('fs');const src=fs.existsSync('logic-sim-v1.14.3.html')?'logic-sim-v1.14.3.html':'archive/html/logic-sim-v1.14.3.html';let h=fs.readFileSync(src,'utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.14.3</title>','<title>Logic Sim v1.14.4</title>');
/* F-01 MUL with ONE input and a number written above the X box ("0.8", "1.2" on ABC-002): the number is the gain; it was ignored (output = input x 1) */
rep(`   case 'DIV':{const s=ins.slice().sort(posOrder);let num=null,den=null;`,`   case 'MUL':{b.i=ins.map(p=>p.n);if(ins.length===1){const t=near(b.cx,b.cy,16,q=>/^-?\\d+(?:\\.\\d+)?$/.test(q.t.trim()))[0];b.gain=t?+t.t.trim():1}break}
   case 'DIV':{const s=ins.slice().sort(posOrder);let num=null,den=null;`);
rep(`case 'MUL':{let y=1;for(const n of b.i)y*=rd(n);out(b.i.length?y:0);break}`,`case 'MUL':{let y=1;for(const n of b.i)y*=rd(n);if(b.gain!=null)y*=b.gain;out(b.i.length?y:0);break}`);
/* F-02 SUB / SUM / ADD / DEV: a sign text ("+" / "-") 9 - 13 units from its pin was not attached (ABC-001C SUB #2, ABC-005 SUB #15 subtracted the wrong way): unlabeled pins take the nearest free sign text within 13 */
rep(`   case 'DEV':case 'SUB':case 'SUM':case 'ADD':{const s=ins.slice()`,`   case 'DEV':case 'SUB':case 'SUM':case 'ADD':{{const used=new Set(blk.flatMap(q=>q.pins.map(p=>p.lt)).filter(Boolean));const fr=TX.filter(t=>/^[+\\-−]$/.test(t.t.trim())&&!used.has(t)&&!(t.x>=b.x0&&t.x<=b.x1&&t.y>=b.y0&&t.y<=b.y1)),prs=[];for(const p of ins)if(!/^[+\\-−]$/.test((p.lab||'').trim()))for(const t of fr){const d=anD(p.x,p.y,t.x,t.y);if(d<=13)prs.push({p,t,d})}prs.sort((x,y)=>x.d-y.d);const up=new Set(),ut=new Set();for(const q of prs){if(up.has(q.p)||ut.has(q.t))continue;up.add(q.p);ut.add(q.t);q.p.lab=q.t.t.trim();q.p.lt=q.t}}const s=ins.slice()`);
/* F-03 LAG f(t): the time ("30Sec", "100Sec", "2Sec", "180Sec") is written to the LEFT of the box, further than the 12 units searched: the default 15 s was used (ABC-002 x2, 010, 020, 053) */
rep(`case 'LAG':{const t=near(b.cx,b.y0,12,q=>/^\\d+(\\.\\d+)?\\s*(sec|s|min)/i.test(q.t.trim()))[0];`,`case 'LAG':{const t=near(b.cx,b.cy,24,q=>/^\\d+(\\.\\d+)?\\s*(sec|s|min)/i.test(q.t.trim()))[0];`);
/* F-04 timers: the time text ("300s" of TR74 on ABC-013) further than 2.2 x the radius of the half disc was not found and the default 5 s was used: look up to 20 units, only texts that no other half disc owns */
rep(`const tm=tt.find(q=>/^\\d+(\\.\\d+)?\\s*(s|sec|min|m)$/i.test(q.t.trim()));const kind=`,`const TMRX=/^\\d+(\\.\\d+)?\\s*(s|sec|min|m)$/i;const tm=tt.find(q=>TMRX.test(q.t.trim()))||near(a.x,a.y,20,q=>TMRX.test(q.t.trim())&&!R_arcs(S).some(o=>o!==a&&anD(o.x,o.y,q.x,q.y)<=o.r*2.2))[0];const kind=`);
/* F-05 the RATE LIMITER symbol of the legend (box with "V" and the arrow glyph: ABC-001C "18% / Hr", ABC-001D "2.25% / HR" and "1.5% / HR", FM403) was read as a HIGH LIMIT = minimum of its inputs, i.e. min(signal, bypass 0 / 1): the signal was destroyed. Now a RATE block: main input, bypass input (1 = follow), rate = % / hour of the signal range */
rep(`  if(sg.g.length){const{d,h,v}=sg;
   if(d.length===2&&h.length===2&&!v.length)return 'SUM';`,`  if(tt.some(q=>q.trim()==='V'))return 'RATE';
  if(sg.g.length){const{d,h,v}=sg;
   if(d.length===2&&h.length===2&&!v.length)return 'SUM';`);
rep(`P.rate=t&&anNum(t.t)>0?anNum(t.t):0;b.main=an[0]?an[0].n:(ins[0]?ins[0].n:-1);`,`P.rate=t&&anNum(t.t)>0?anNum(t.t):0;if((b.txt||[]).some(q=>q.trim()==='V')){const ht=near(b.cx,b.cy,70,q=>/\\d\\s*%\\s*\\/\\s*(hr|h)\\b/i.test(q.t.trim()))[0];if(ht){const m=/(\\d+(?:\\.\\d+)?)\\s*%\\s*\\/\\s*(?:hr|h)\\b/i.exec(ht.t),rg_=anRange(S,b,90);P.rate=+m[1]/3600;P.hr=+m[1]}else P.rate=0}b.main=an[0]?an[0].n:(ins[0]?ins[0].n:-1);`);
/* F-06 grey blocks (other layer, no standard glyph) that were not recognised at all: ABC-001A high / low limit box (ramp with flat ends, texts HIGH LIMIT / LOW LIMIT), ABC-001A two small boxes with "+" / "-" beside the pins (subtract), ABC-001B "RATE LIMIT" ramp box FM0403, ABC-001D box with a drawn "+" (add). Their outputs were never driven. */
rep(` /* control valves: the wire that touches the tip (stem)`,` for(const sh of S.shp){if(sh.ty!=='rect'||sh.w>42||sh.h>50||blk.some(b=>b.sh===sh||(b.x0!=null&&sh.cx>=b.x0-1&&sh.cx<=b.x1+1&&sh.cy>=b.y0-1&&sh.cy<=b.y1+1)))continue;if(txIn(sh).length)continue;const sg=sigOf(sh);let k=null;
  const nearT=re=>TX.some(q=>re.test(q.t.trim())&&anD(q.x,q.y,sh.cx,sh.cy)<=50);
  if(sg.d.length>=1&&sg.h.length>=1){if(nearT(/^RATE\\s*LIMIT/i))k='RATE';else if(nearT(/^(HIGH|LOW)\\s*LIMIT/i))k='HLLIM'}
  else if(sg.h.length===1&&sg.v.length===1&&!sg.d.length)k='ADD';
  else if(!sg.g.length&&sh.w<=24&&sh.h<=14&&TX.some(q=>/^[+\\-−]$/.test(q.t.trim())&&anD(q.x,q.y,sh.cx,sh.cy)<=18))k='SUB';
  else if(!sg.g.length&&sh.w<=16&&sh.h>=30)k='SUM';/* ABC-026 / 027: grey tall bar, 4 + 4 inputs, = summation (number of normal transmitters) */
  if(k)blk.push({id:uid++,k,sh,x0:sh.x0,y0:sh.y0,x1:sh.x1,y1:sh.y1,cx:sh.cx,cy:sh.cy,txt:[],p:{}})}
 /* control valves: the wire that touches the tip (stem)`);
rep(`   case 'DIV':{const s=ins.slice().sort(posOrder);let num=null,den=null;`,`   case 'HLLIM':{const s=ins.slice(),tp=s.find(p=>p.side==='T')||s[0],lm=s.filter(p=>p!==tp).sort((p,q)=>q.y-p.y);b.main=tp?tp.n:-1;b.hi=lm[0]?lm[0].n:-1;b.lo=lm[1]?lm[1].n:-1;b.i=[b.main,b.hi,b.lo].filter(x=>x>=0);break}
   case 'DIV':{const s=ins.slice().sort(posOrder);let num=null,den=null;`);
rep(`   case 'ABS':out(Math.abs(rd(b.i[0])));break;`,`   case 'HLLIM':{let x=rd(b.main);if(b.lo>=0)x=Math.max(x,rd(b.lo));if(b.hi>=0)x=Math.min(x,rd(b.hi));out(x);break}
   case 'ABS':out(Math.abs(rd(b.i[0])));break;`);
/* F-07 rates written per MINUTE or per HOUR were used as per SECOND: RAMP "1% / min" (ABC-020 RAMPB #52, ABC-051 RAMPB #24 "1.67% / min") ran 60 times too fast; RATE "1% / min" (ABC-034 #26) and "2 kg/cm2 / min" (ABC-052 #88) were not read at all (no limit) */
rep(`const t=near(b.cx,b.cy,36,q=>/%%%\\s*\\/\\s*sec|%\\s*\\/\\s*sec|\\/\\s*sec/i.test(q.t))[0];P.rate=t&&anNum(t.t)>0?anNum(t.t):0;`,`const t=near(b.cx,b.cy,36,q=>/\\/\\s*(sec|min|hr|h)\\b/i.test(q.t)&&anNum(q.t)>0)[0];P.rate=t&&anNum(t.t)>0?anNum(t.t)/(/\\/\\s*min/i.test(t.t)?60:/\\/\\s*(hr|h)\\b/i.test(t.t)?3600:1):0;`);
rep(`P.rate=t?anNum(t.replace(/RAMP\\s*:/i,'')):1;`,`P.rate=t?anNum(t.replace(/RAMP\\s*:/i,''))/(/\\/\\s*min/i.test(t)?60:/\\/\\s*(hr|h)\\b/i.test(t)?3600:1):1;`);
/* F-08 gate drawn with its BAR on the grey layer DCS-LP while its circle is on CON (ABC-003C OR #92-equivalent at (306, 270): the copy of ABC-003B #92 / 003D #91): the bar was not taken, the gate did not exist, its output was never driven */
rep(`for(const s of SG){if(s.use||!/^CON$/i.test(s.l))continue;const L=len(s);if(L<6||L>BARMAX)continue;`,`for(const s of SG){if(s.use||!/(CON$|^DCS-LP$|^0$)/i.test(s.l))continue;const L=len(s);if(L<6||L>BARMAX)continue;`);
/* F-09 six more OR gates drawn completely on another layer (bar and circle grey: ABC-003E M.0097, ABC-004A M.0138 and M.2020, ABC-007 M.0198, ABC-009A (544, 682), ABC-001C M.2013): gate circles of r 2.5 - 5.6 on CON / DCS-LP / 0 with no text inside are taken (a connector circle always has its number inside) */
rep(`const CIc=R.ci.filter(c=>/^CON$/i.test(c.l)&&c.r>2.5&&c.r<5.2);`,`const CIc=R.ci.filter(c=>/(CON$|^DCS-LP$|^0$)/i.test(c.l)&&c.r>2.5&&c.r<5.6&&(/CON$/i.test(c.l)||!R.tx.some(q=>Math.hypot(q.x-c.x,q.y-c.y)<=c.r)));`);
/* F-10 OR gates with a very long bar (more than 130 units: ABC-003E 134, ABC-004A 141, ABC-007 147, 7 or more inputs) or a bar on a layer with a garbled name ending in CON (ABC-009A) */
rep(`BARMAX=130`,`BARMAX=160`);
/* F-11 circles whose "( FROM / TO ABC-xxx )" text is further than the 28 units searched (ABC-004A 6, 8, 9: "B-CF RUN ( FROM ABC-004B )"): the text nearest to the circle that no other circle owns is taken, up to 80 units. Without it the number circles of the 004A / B / C family could not find their sender on the other sheet. */
rep(`if(nl.size)(tgt?S.xc:S.conn).push({num,tgt,x:c.x,y:c.y,r:c.r,nets:[...nl],sink,tags,ref,lt:!tgt&&typeof num==='string'})}
 return S}`,`if(nl.size)(tgt?S.xc:S.conn).push({num,tgt,x:c.x,y:c.y,r:c.r,nets:[...nl],sink,tags,ref,lt:!tgt&&typeof num==='string'})}
 {const RX=/(FROM|TO)\\s+ABC[-\\s]?(\\d{3}[A-Z]?)/i,all=S.conn.concat(S.xc),used=new Set();
  for(const c of all)if(c.ref){let bq=null,bd=c.r+28;for(const q of TX){if(!RX.test(q.t))continue;const d=anD(q.x,q.y,c.x,c.y);if(d<bd){bd=d;bq=q}}if(bq)used.add(bq)}
  const prs=[];for(const c of all)if(!c.ref&&!(!c.tgt&&S.conn.some(o=>o!==c&&o.num===c.num&&o.sink!==c.sink)))for(const q of TX){if(used.has(q)||!RX.test(q.t))continue;const d=anD(q.x,q.y,c.x,c.y);if(d<=80)prs.push({c,q,d})}
  prs.sort((a,b)=>a.d-b.d);const uc=new Set(),uq=new Set();for(const e of prs){if(uc.has(e.c)||uq.has(e.q))continue;uc.add(e.c);uq.add(e.q);const m=RX.exec(e.q.t);e.c.ref={dir:m[1].toUpperCase(),code:m[2].toUpperCase(),codes:[m[2].toUpperCase(),...((/ABC[-\\s]?\\d{3}[A-Z]?((?:\\s*\\/\\s*[A-Z])+)/i.exec(e.q.t)||[0,''])[1].match(/[A-Za-z]/g)||[]).map(L=>m[2].slice(0,3)+L.toUpperCase())]}}}
 return S}`);
/* F-12 the "M" circle of a motor symbol (trapezoid = motor-operated damper / valve actuator: ABC-003A / B / C / D) is the motor, not a connector */
rep(`if(S.gate.some(g=>g.body&&g.body.r&&anD(g.body.cx,g.body.cy,c.x,c.y)<.5))continue;`,`if(S.gate.some(g=>g.body&&g.body.r&&anD(g.body.cx,g.body.cy,c.x,c.y)<.5))continue;if(S.shp.some(sh=>sh.ty==='quad'&&c.x>=sh.x0&&c.x<=sh.x1&&c.y>=sh.y0&&c.y<=sh.y1))continue;`);
fs.writeFileSync(process.argv[2]||'logic-sim-v1.14.4.html',h);console.log('wip written',h.length);
