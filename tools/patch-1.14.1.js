/* v1.14.0 -> v1.14.1 (WIP in wip/, not released until the user gives the go). Reader: pin roles. DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('logic-sim-v1.14.0.html','utf8');
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
rep(`if(dy>-2&&dy<9&&dx>-3&&dx<60)pr.push`,`if(dy>-2&&dy<9&&dx>-14&&dx<60)pr.push`);

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
fs.writeFileSync('wip/logic-sim-v1.14.1.html',h);console.log('wip written',h.length);
