/* v1.14.0 -> v1.14.1 (released). Reader: pin roles. DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('archive/html/logic-sim-v1.14.0.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.14.0</title>','<title>Logic Sim v1.14.1</title>');
/* 1. a 2-pin block drawn VERTICALLY with no input found (ABC-002 F(X) LN5, fed from a numbered circle above): the upper pin is the input */
rep(`else if(b.pins.length===2){const[p,q]=b.pins;if(Math.abs(p.x-q.x)>Math.abs(p.y-q.y)+1)(p.x<q.x?p:q).role='in'}}`,`else if(b.pins.length===2){const[p,q]=b.pins;if(Math.abs(p.x-q.x)>Math.abs(p.y-q.y)+1)(p.x<q.x?p:q).role='in';else if(Math.abs(p.y-q.y)>Math.abs(p.x-q.x)+1)(p.y>q.y?p:q).role='in'}}`);
/* 2. a T (SW / AMT) with two OUT pins: the one labelled "a" / "A" is the A-leg INPUT (ABC-004A x2, 010 x3, 011, 012) */
rep(` /* side of every pin relative to the block centre */`,` for(const b of blk)if((b.k==='SW'||b.k==='AMT')&&b.pins.filter(p=>p.role==='out').length>1){for(const p of b.pins)if(p.role==='out'&&/^a$/i.test(p.lab||''))p.role='in'}
 /* side of every pin relative to the block centre */`);

/* 3. a constant "A" box with a ratio ("1115 / 432 SCALE CONVERT") or a percent ("(50%)", "0%") next to it is a number, not a reference to the nearest wire tag (ABC-002 #31 became SI0043 = 0) */
rep(`for(const b of K){if(ub.has(b))continue;let bt=null,bd=9;`,`for(const b of K){if(ub.has(b))continue;if(TX.some(q=>/^\\s*\\(?\\s*-?\\d+(?:\\.\\d+)?\\s*(?:%|\\/\\s*-?\\d+(?:\\.\\d+)?)\\s*\\)?\\s*$/.test(q.t.trim())&&Math.hypot(q.x-b.cx,q.y-b.cy)<16))continue;let bt=null,bd=9;`);
rep(`    if(P.val==null){const nu=near(b.cx,b.cy,24,`,`    if(P.val==null){const pc=near(b.cx,b.cy,16,t=>/^\\(?\\s*-?\\d+(?:\\.\\d+)?\\s*%\\s*\\)?$/.test(t.t.trim()))[0];if(pc){P.val=parseFloat(pc.t.replace(/[()%\\s]/g,''));b.note='value '+pc.t.trim()}}
    if(P.val==null){const nu=near(b.cx,b.cy,24,`);
/* 4. "< X%" with a wire "SET X%": the threshold is the signal on that wire (ABC-003E CMPK x4, 020 ...); the other input is the value compared */
rep(`case 'CMPK':{const m=b.txt[0].replace(/%%%/g,'%').match(/^([<>≤≥])\\s*(-?\\d+(?:\\.\\d+)?)/);P.op=m?(m[1]==='≥'?'>':m[1]==='≤'?'<':m[1]):'<';P.sp=m?+m[2]:0;b.i=ins.map(p=>p.n);break}`,`case 'CMPK':{const m=b.txt[0].replace(/%%%/g,'%').match(/^([<>≤≥])\\s*(-?\\d+(?:\\.\\d+)?)/);P.op=m?(m[1]==='≥'?'>':m[1]==='≤'?'<':m[1]):'<';P.sp=m?+m[2]:0;b.i=ins.map(p=>p.n);
     if(!m&&ins.length>=2){const st=TX.filter(q=>/^SET\\b/i.test(q.t.trim())&&anD(q.x,q.y,b.cx,b.cy)<24).sort((a,c)=>anD(a.x,a.y,b.cx,b.cy)-anD(c.x,c.y,b.cx,b.cy))[0];const th=st?ins.slice().sort((a,c)=>anD(a.x,a.y,st.x,st.y)-anD(c.x,c.y,st.x,st.y))[0]:ins.find(p=>p.side==='T');const sg=th&&ins.find(p=>p!==th);if(th&&sg){P.ref=th.n;P.refSet=1;b.i=[sg.n,th.n]}}break}`);
/* 5. .LOC / .REM / .MAN tags are digital flags (local / remote / manual), not analog values */
rep(`for(const p of b.pins)if(p.role==='in'&&!dk[p.n]&&!nets[p.n].sigab)nets[p.n].dig=false}
 {const K=`,`for(const p of b.pins)if(p.role==='in'&&!dk[p.n]&&!nets[p.n].sigab)nets[p.n].dig=false
  S.lab.forEach((l,n)=>{if(l&&nets[n]&&!nets[n].sigab&&/\\.(LOC|REM|MAN)$/i.test(String(l.t).trim()))nets[n].dig=true})}
 {const K=`);
/* 6. DCMP limits are written "PV-SV > 1.5Kg/cm2" / "PV-SV < -1.0Kg/cm2" beside the two outputs */
rep(`tl=TX.filter(q=>/^[<>≤≥]/.test(q.t.replace(/%%%/g,'%').trim()))`,`tl=TX.filter(q=>/^(?:[A-Za-z][\\w-]*\\s*)?[<>≤≥]/.test(q.t.replace(/%%%/g,'%').trim()))`);
rep(`const m=e.q.t.replace(/%%%/g,'%').trim().match(/^([<>≤≥])\\s*(=)?\\s*(-?\\d+(?:\\.\\d+)?)\\s*(.*)$/);if(m)b.dc.push`,`const m=e.q.t.replace(/%%%/g,'%').trim().match(/^(?:[A-Za-z][\\w-]*\\s*)?([<>≤≥])\\s*(=)?\\s*(-?\\d+(?:\\.\\d+)?)\\s*(.*)$/);if(m)b.dc.push`);
rep(`if(dy>-2&&dy<9&&dx>-3&&dx<60)pr.push`,`if(dy>-8&&dy<9&&dx>-14&&dx<60)pr.push`);

/* 7. descriptions for EVERY address: a block that carries an address (SIG.AB B.1070, ...) shows its card when selected, and hovering any address text on the drawing shows the card */
rep(`function tagHi(){const sh=cs(),S=sh&&sh.S,n=S&&AN.sel&&AN.sel.net!=null?AN.sel.net:null,key=n==null?'':sh.name+'#'+n;if(tagHi.k===key)return;`,`function cardFill(c,a){c.innerHTML='';adesLines(a).forEach((x,i)=>{const d=document.createElement('div');d.textContent=x;if(i===0)d.style.fontWeight='700';c.append(d)})}
function tagHi(){const sh=cs(),S=sh&&sh.S,n=S&&AN.sel&&AN.sel.net!=null?AN.sel.net:null,key=n==null?(S&&AN.sel&&AN.sel.blk?sh.name+'b'+AN.sel.blk.id:''):sh.name+'#'+n;if(tagHi.k===key)return;`);
rep(`tagHi.prev=[];const c=tagCard();c.style.display='none';if(n==null||!L||!L.txe)return;`,`tagHi.prev=[];const c=tagCard();c.style.display='none';
 if(n==null&&S&&AN.sel&&AN.sel.blk&&L&&L.txe){const b=AN.sel.blk;let hit=null;for(const[t,e]of L.txe){if(t.x>=b.x0-14&&t.x<=b.x1+14&&t.y>=b.y0-14&&t.y<=b.y1+14){const a=adesFind(sh,t.t.trim());if(a){hit={e,a};break}}}
  if(hit){c.style.borderLeftColor='#ffe14a';tagHi.prev.push([hit.e,hit.e.getAttribute('fill'),hit.e.getAttribute('font-weight')]);hit.e.setAttribute('fill','#ffe14a');hit.e.setAttribute('font-weight','700');cardFill(c,hit.a);c.style.display='block'}return}
 if(n==null||!L||!L.txe)return;`);
rep(`/* selected wire: its address text turns yellow`,`{const sv_=$('svg');let hc=null;const HC=()=>{if(!hc){hc=h$('div',{id:'anhov',style:'position:absolute;max-width:420px;background:#0f1a22f5;border:1px solid #2b4a5a;border-left:4px solid #5cc8ff;padding:5px 9px;font:12px sans-serif;color:#e7eef3;display:none;z-index:7;pointer-events:none;line-height:1.4'});const c=$('cv');if(c){if(!/relative|absolute|fixed/.test(getComputedStyle(c).position))c.style.position='relative';c.append(hc)}}return hc};
 sv_.addEventListener('mousemove',e=>{if(!live()||e.buttons)return;const sh=cs();if(!sh||!sh.S||!ADES)return;const[x,y]=xy(e);let f=null;for(const t of sh.S.tx){const s=t.t.trim();if(s.length<4||s.length>14)continue;const h=t.h||2.6;if(x>=t.x-.6&&x<=t.x+s.length*h*.62+.6&&y>=t.y-h*.3&&y<=t.y+h*1.15){const a=adesFind(sh,s);if(a){f=a;break}}}
  const c=HC();if(!c)return;if(!f){c.style.display='none';return}cardFill(c,f);const cr=$('cv').getBoundingClientRect();c.style.left=Math.max(4,Math.min(cr.width-330,e.clientX-cr.left+14))+'px';c.style.top=Math.max(4,Math.min(cr.height-80,e.clientY-cr.top+16))+'px';c.style.display='block'});
 sv_.addEventListener('mouseleave',()=>{if(hc)hc.style.display='none'})}
/* selected wire: its address text turns yellow`);

/* 8. grey "/" box = divide, "*" / "×" = multiply, a grey box with only a number ("0") = constant (ABC-001B, 001C); the formula beside a divide ("T = B / A * 100 / ...") says which pin is the numerator */
rep(`const AN_KT={'T':'SW',`,`const AN_KT={'/':'DIV','÷':'DIV','*':'MUL','×':'MUL','T':'SW',`);
rep(`  for(const q of tt)if(AN_KT[q]){if(q==='T'&&sh.ty==='dia')return 'AMT';return AN_KT[q]}`,`  for(const q of tt)if(AN_KT[q]){if(q==='T'&&sh.ty==='dia')return 'AMT';return AN_KT[q]}
  if(sh.ty==='rect'&&tt.length===1&&/^-?\\d+(?:\\.\\d+)?\\s*%?$/.test(tt[0].replace(/%%%/g,'%')))return 'CONST';`);
rep(`const lt=near(b.cx,b.cy,14,t=>/^[ab]\\s*\\/\\s*[ab]$/i.test(t.t.trim()))[0];
     if(lt){const m=lt.t.trim().toLowerCase().match(/^([ab])\\s*\\/\\s*([ab])$/);`,`const lt=near(b.cx,b.cy,30,t=>/(?:^|=)\\s*[ab]\\s*\\/\\s*[ab]\\b/i.test(t.t.trim()))[0];
     if(lt){const m=lt.t.trim().toLowerCase().match(/(?:^|=)\\s*([ab])\\s*\\/\\s*([ab])\\b/);`);

/* 9. a grey box with a number and a unit ("4T", "8T" = 4 / 8 T/H) is a constant; "DROP RATE ( X / MIN )" = how fast the input falls per minute (ABC-055) */
rep(`tt.length===1&&/^-?\\d+(?:\\.\\d+)?\\s*%?$/.test(tt[0].replace(/%%%/g,'%')))return 'CONST';`,`tt.length===1&&/^-?\\d+(?:\\.\\d+)?\\s*[%A-Za-z°\\/]{0,8}$/.test(tt[0].replace(/%%%/g,'%')))return 'CONST';
  if(sh.ty==='rect'&&tt.some(q=>/^DROP\\s*RATE/i.test(q)))return 'DRATE';`);
rep(`if(tn&&/^-?\\d+(\\.\\d+)?\\s*%?$/.test(tn))P.val=anNum(tn);`,`if(tn&&/^-?\\d+(\\.\\d+)?\\s*[%A-Za-z°\\/]{0,8}$/.test(tn))P.val=anNum(tn);`);
rep(`   case 'FX':{if(!P.ln)P.ln='';b.i=ins.map(p=>p.n);break}`,`   case 'FX':{if(!P.ln)P.ln='';b.i=ins.map(p=>p.n);break}
   case 'DRATE':{b.i=ins.map(p=>p.n);break}`);
rep(`   case 'FX':out(anFX(P,rd(b.i[0])));break;`,`   case 'FX':out(anFX(P,rd(b.i[0])));break;
   case 'DRATE':{const x=rd(b.i[0]),H=s.h=s.h||[];if(H.length&&H[H.length-1][0]===rt.t)H[H.length-1][1]=x;else H.push([rt.t,x]);while(H.length>2&&H[1][0]<=rt.t-60)H.shift();const o0=H[0],dw=rt.t-o0[0];out(dw>1e-6?(o0[1]-x)/dw*60:0);break}`);
rep(`AK=new Set(['AI','PID',`,`AK=new Set(['DRATE','AI','PID',`);

/* 10. SWITCH pin labels: letters / "1:b" are matched to T pins GLOBALLY (nearest pair first, a text labels one pin only), and the "B" beside a COS (manual value) diamond is the COS's own label, not a leg of the T (ABC-009A, 019, 020, 002, 008, 050) */
rep(` for(const b of blk){if(!b.pins.length)continue;const cand=TX.filter(t=>LAB.test(t.t.trim())&&!(t.x>=b.x0+.3&&t.x<=b.x1-.3&&t.y>=b.y0+.3&&t.y<=b.y1-.3||false));`,` const Ts=blk.filter(q=>q.k==='SW'||q.k==='AMT'),Cs=blk.filter(q=>q.k==='COS');
 {const pairs=[];for(const b of Ts)for(const p of b.pins){if(p.role!=='in'&&b.pins.filter(q=>q.role==='out').length<2)continue;for(const t of TX){if(!LAB.test(t.t.trim()))continue;if(t.x>=b.x0+.3&&t.x<=b.x1-.3&&t.y>=b.y0+.3&&t.y<=b.y1-.3)continue;if(Cs.some(c=>anD(c.cx,c.cy,t.x,t.y)<11))continue;const d=anD(p.x,p.y,t.x,t.y);if(d<=11)pairs.push({p,t,d})}}
  pairs.sort((x,y)=>x.d-y.d);const up=new Set(),ut=new Set();for(const q of pairs){if(up.has(q.p)||ut.has(q.t))continue;up.add(q.p);ut.add(q.t);q.p.lab=q.t.t.trim();q.p.lt=q.t}}
 for(const b of blk){if(!b.pins.length||b.k==='SW'||b.k==='AMT')continue;const cand=TX.filter(t=>LAB.test(t.t.trim())&&!(t.x>=b.x0+.3&&t.x<=b.x1-.3&&t.y>=b.y0+.3&&t.y<=b.y1-.3||false));`);

/* 11. COS diamond that has the letter "B" drawn inside its box ("B | COS", ABC-009A x2): still a COS (manual value of the A/M transfer) */
rep(`if(tt.includes('COS')&&!tt.includes('T')&&!tt.includes('B'))return 'COS'`,`if(tt.includes('COS')&&!tt.includes('T'))return 'COS'`);
/* 12. Y / N switches (ABC-003E, 004B, 004C, 009A, 009B, 001D): leg "y" = taken when the control is 1, leg "n" when 0; the unlabelled pin is the control */
rep(`const isCtl=p=>/^\\d\\s*:\\s*\\S+/.test(p.lab||''),isAB=p=>/^[ab]$/i.test(p.lab||'');`,`const isCtl=p=>/^\\d\\s*:\\s*\\S+/.test(p.lab||''),isAB=p=>/^[ab]$/i.test(p.lab||'');
     const yn=ins.some(p=>/^[yn]$/i.test(p.lab||'')||/^\\d\\s*:\\s*y$/i.test(p.lab||''));if(yn)for(const p of ins){if(/^y$/i.test(p.lab||''))p.lab='a';else if(/^n$/i.test(p.lab||''))p.lab='b';else{const mm=/^(\\d)\\s*:\\s*y$/i.exec(p.lab||'');if(mm)p.lab=mm[1]+':a'}}`);
rep(`P.selA=m&&/^a$/i.test(m[1]);`,`P.selA=!!((m&&/^a$/i.test(m[1]))||(yn&&!m));`);
rep(`return{n:q.n,A:!!(mm&&/^a$/i.test(mm[1]))}});`,`return{n:q.n,A:!!((mm&&/^a$/i.test(mm[1]))||(yn&&!mm))}});`);
/* 13. a selector wire that stops short of the T (no arrow touching it, ABC-009A AMT #2 "1:B / BU-CMD"): attach the nearest wire end to the "1:x" text */
rep(` for(const b of blk){if(!b.pins.length||b.k==='SW'||b.k==='AMT')continue;const cand=`,` for(const b of Ts){if(b.pins.some(p=>/^\\d\\s*:/.test(p.lab||'')))continue;const used=new Set(Ts.flatMap(q=>q.pins.map(p=>p.lt)).filter(Boolean));
  const lt=TX.filter(t=>/^\\d\\s*:\\s*[A-Za-z]$/.test(t.t.trim())&&!used.has(t)&&anD(t.x,t.y,b.cx,b.cy)<=26&&nearestTb(t)===b)[0];if(!lt)continue;
  let best=null,bs=1e9;for(const s2 of S.seg)for(const[x,y]of[[s2.x1,s2.y1],[s2.x2,s2.y2]]){const d1=anD(x,y,lt.x,lt.y),d2=anDistPoly(polyOf(b),x,y);if(d1<=18&&d2<=7&&!b.pins.some(p=>p.n===s2.net)&&d1+d2<bs){bs=d1+d2;best={n:s2.net,x,y}}}
  if(best)b.pins.push({n:best.n,x:best.x,y:best.y,role:'in',lab:lt.t.trim(),lt})}
 for(const b of blk){if(!b.pins.length||b.k==='SW'||b.k==='AMT')continue;const cand=`);
rep(` const Ts=blk.filter(q=>q.k==='SW'||q.k==='AMT'),Cs=blk.filter(q=>q.k==='COS');`,` const Ts=blk.filter(q=>q.k==='SW'||q.k==='AMT'),Cs=blk.filter(q=>q.k==='COS'),nearestTb=t=>{let m=null,md=1e9;for(const q of Ts){const d=anD(q.cx,q.cy,t.x,t.y);if(d<md){md=d;m=q}}return m};`);

/* 14. circles with a LETTER ("A", "B", "E", "N") continue a signal on the same sheet exactly like the numbered ones */
rep("const t=TX.filter(q=>anD(q.x,q.y,c.x,c.y)<=c.r*.9&&/^\\d{1,2}$/.test(q.t.trim()))[0];if(!t)continue;num=+t.t}","const t=TX.filter(q=>anD(q.x,q.y,c.x,c.y)<=c.r*.9&&/^(\\d{1,2}|[A-Z]{1,3})$/.test(q.t.trim()))[0];if(!t)continue;num=/^\\d+$/.test(t.t.trim())?+t.t:t.t.trim()}");
rep("(tgt?S.xc:S.conn).push({num,tgt,x:c.x,y:c.y,r:c.r,nets:[...nl],sink,tags,ref})}","(tgt?S.xc:S.conn).push({num,tgt,x:c.x,y:c.y,r:c.r,nets:[...nl],sink,tags,ref,lt:!tgt&&typeof num==='string'})}");
rep("const grp={};S.conn.forEach(c=>(grp[c.num]=grp[c.num]||[]).push(c));","const grp={};S.conn.forEach(c=>{if(!c.lt)(grp[c.num]=grp[c.num]||[]).push(c)});");
/* 15. an analog wire that starts at a bare "3%" text (no box, no driver) carries that constant (ABC-003E "SET X%" = 3 %) */
rep(" S.ext=[];for(let n=0;n<N;n++)if(!S.drv[n].length&&S.cns[n].length)S.ext.push(n);",` S.ext=[];for(let n=0;n<N;n++)if(!S.drv[n].length&&S.cns[n].length)S.ext.push(n);
 S.kn={};for(const id of S.ext.slice()){const net=nets[id];if(net.dig)continue;const ends=[];for(const i of net.segs){const sg=S.seg[i];ends.push([sg.x1,sg.y1],[sg.x2,sg.y2])}
  let best=null,bd=10;for(const t of TX){if(!/^\\s*-?\\d+(?:\\.\\d+)?\\s*%\\s*$/.test(t.t.trim()))continue;for(const[x,y]of ends){const d=anD(t.x,t.y,x,y);if(d<bd){bd=d;best=t}}}
  if(best){S.kn[id]=parseFloat(best.t);S.ext.splice(S.ext.indexOf(id),1)}}
 {const devPV=d=>{let r=null;for(const p of d.pins.filter(q=>q.role==='in')){const t=TX.filter(q=>/^(PV|SV)$/i.test(q.t.trim())&&anD(q.x,q.y,p.x,p.y)<=12).sort((a,c)=>anD(a.x,a.y,p.x,p.y)-anD(c.x,c.y,p.x,p.y))[0];if(t&&/^PV$/i.test(t.t.trim())){const ip=d.ip&&d.ip.find(x=>x.n===p.n);r=ip?ip.sg:null}}return r};
  for(const b of S.blk)if(b.k==='DCMP'&&b.dc&&b.i&&b.i.length){const dv=(S.drv[b.i[0]]||[]).find(q=>q.k==='DEV'),sg=dv?devPV(dv):null;for(const d of b.dc){const m=/^(PV|SV)\\s*-\\s*(PV|SV)/i.exec(d.txt||'');if(!m)continue;d.neg=/^PV$/i.test(m[1])!==(sg!==null&&sg>0)}}}`);
rep("const rt=S.rt,v=rt.v,nets=S.nets,B=x=>x>.5?1:0;rt.t+=dt;rt.k++;const MU=S.multi;","const rt=S.rt,v=rt.v,nets=S.nets,B=x=>x>.5?1:0;rt.t+=dt;rt.k++;const MU=S.multi;if(S.kn)for(const k in S.kn)v[k]=S.kn[k];");
rep("case 'DCMP':{const x=rd(b.i[0]);for(const d of b.dc)v[d.n]=(d.op==='>'?(d.inc?x>=d.sp:x>d.sp):(d.inc?x<=d.sp:x<d.sp))?1:0;break}","case 'DCMP':{const x0=rd(b.i[0]);for(const d of b.dc){const x=d.neg?-x0:x0;v[d.n]=(d.op==='>'?(d.inc?x>=d.sp:x>d.sp):(d.inc?x<=d.sp:x<d.sp))?1:0}break}");
/* 16. DROP RATE: internal window setting (default 30 s; 5 / 10 / 30 / 60), the text on the drawing is kept */
rep("while(H.length>2&&H[1][0]<=rt.t-60)H.shift();","const W=P.win||30;while(H.length>2&&H[1][0]<=rt.t-W)H.shift();");
rep("else if(b.k==='LAG')pr('tau','Time constant (sec)');","else if(b.k==='LAG')pr('tau','Time constant (sec)');\n else if(b.k==='DRATE'){if(P.win==null)P.win=30;pr('win','Window to measure the rate (sec): 5 / 10 / 30 / 60')}");
rep(`const AN_PV=11;`,`const AN_PV=12;`);

/* 17. DCMP outputs drawn as two overlapping wires (ABC-001D: four out pins for two comparisons): every pin next to the matched one carries the same test */
rep(`if(m)b.dc.push({n:e.p.n,op:/[>≥]/.test(m[1])?'>':'<',inc:/[≥≤]/.test(m[1])||m[2]==='=',sp:+m[3],u:m[4]||'',txt:e.q.t.trim()})}
     break}`,`if(m)b.dc.push({n:e.p.n,op:/[>≥]/.test(m[1])?'>':'<',inc:/[≥≤]/.test(m[1])||m[2]==='=',sp:+m[3],u:m[4]||'',txt:e.q.t.trim()})}
     for(const e of b.dc.slice()){const pe=outs2.find(p=>p.n===e.n);if(!pe)continue;for(const p2 of outs2)if(p2.n!==e.n&&!b.dc.some(x=>x.n===p2.n)&&anD(p2.x,p2.y,pe.x,pe.y)<=3)b.dc.push(Object.assign({},e,{n:p2.n}))}
     break}`);
fs.writeFileSync('logic-sim-v1.14.1.html',h);console.log('wip written',h.length);
