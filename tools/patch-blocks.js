/* v1.15.0 WIP: function blocks that did not work (docs/FUNCTIONALITY.md GAPs) + page-link navigation. Called by tools/patch-1.15.1.js with its rep(a,b). String.raw keeps the backslashes of the regular expressions as they are (so no backtick and no dollar-brace inside the code). */
module.exports=(rep)=>{
/* G-01 SUMA analog integrator / SUMP pulse integrator: were pass-through ("temporary"). SUMA: total = integral of the input (the input is in units per HOUR, e.g. T/H -> T); SUMP: counts the rising edges of the pulse input. PO: pulse output, shows raise / lower pulses. TP: DP / Kt. */
rep(String.raw`   case 'TP':case 'IP':case 'AO':case 'PO':case 'FIELD':case 'ALM':case 'UNK':{if(b.o.length)out(rd(b.i[0]));break}`,
String.raw`   case 'SUMA':{const x=rd(b.i[0]);s.tot=(s.tot||0)+x*dt/3600;if(b.o.length)out(s.tot);break}
   case 'SUMP':{const x=B(rd(b.i[0]));if(x&&!s.prev)s.cnt=(s.cnt||0)+(P.w||1);s.prev=x;if(b.o.length)out(s.cnt||0);break}
   case 'PO':{const x=rd(b.i[0]);if(s.pos==null){s.pos=x;s.ct=0;s.pw=0;s.pd=0}
     const cyc=P.cyc>0?P.cyc:2,sp=P.stroke>0?P.stroke:60,mn=P.minp>=0?P.minp:.2,ups=100/sp;s.ct+=dt;
     if(s.ct>=cyc){s.ct-=cyc;const need=(x-s.pos)/ups;if(Math.abs(need)>=mn){s.pd=need>0?1:-1;s.pw=Math.min(Math.abs(need),cyc)}else{s.pd=0;s.pw=0}}
     if(s.pd!==0&&(x-s.pos)*s.pd<=0){s.pd=0;s.pw=0}const on=s.pd!==0&&s.ct<s.pw;s.up=on&&s.pd>0;s.dn=on&&s.pd<0;if(on)s.pos+=s.pd*ups*dt;if(b.o.length)out(x);break}
   case 'TP':{const dp=b.tpd>=0?rd(b.tpd):0,tt=b.tpt>=0?rd(b.tpt):null;let y=dp;s.kt=1;if(P.tref!=null&&tt!=null){s.kt=(tt+273.15)/(P.tref+273.15);y=s.kt>0?dp/s.kt:dp}if(b.o.length)out(y);break}
   case 'IP':case 'AO':case 'FIELD':case 'ALM':case 'UNK':{if(b.o.length)out(rd(b.i[0]));break}`);
/* compile: TP pins (the signal that passes, top pin, is the DP; the other pin is the temperature) and SEL modes (inputs left to right) */
rep(String.raw`   case 'DIV':{const s=ins.slice().sort(posOrder);let num=null,den=null;`,
String.raw`   case 'TP':{const s2=ins.slice(),tp=s2.find(p=>p.side==='T')||s2[0],ot=s2.find(p=>p!==tp);b.tpd=tp?tp.n:-1;b.tpt=ot?ot.n:-1;b.i=s2.map(p=>p.n);if(P.tref===undefined)P.tref=null;break}
   case 'SEL':{const s2=ins.slice().sort((p,q)=>p.x-q.x);b.i=s2.map(p=>p.n);const tx=(b.txt||[]).join(' ');b.mi={};
     if(/PRI/i.test(tx)){b.mopts=['AVG','PRI','SEC'];b.mi.PRI=0;b.mi.SEC=1}
     else{const mm=/\(\s*(\d)\s*\)\s*\/\s*\(\s*(\d)\s*\)\s*\/\s*AVG/i.exec(tx);if(mm){b.mopts=['AVG','('+mm[1]+')','('+mm[2]+')'];[mm[1],mm[2]].forEach((dg,k)=>{let ix=b.i.findIndex(n=>S.lab[n]&&new RegExp(dg+"\\.PV$").test(S.lab[n].t));if(ix<0)ix=k;b.mi['('+dg+')']=ix})}else b.mopts=['AVG']}
     break}
   case 'DIV':{const s=ins.slice().sort(posOrder);let num=null,den=null;`);
/* G-02 SEL: AVERAGE = average of the healthy inputs; PRI / SEC / (1) / (3) = that input while its transmitter is healthy, else the average of the healthy ones; all bad: hold */
rep(String.raw`     const all=b.i.map(rd),ok=all.filter((_,k)=>{const sid=b.sgi&&b.sgi[k];const q=sid!=null&&rt.st[sid];return!(q&&q.val>.5)});
     let y;if(ok.length){y=ok.reduce((p,q)=>p+q,0)/ok.length;s.last=y}else y=s.last!=null?s.last:(all.length?all.reduce((p,q)=>p+q,0)/all.length:0);
     s.nok=ok.length;out(y);break}`,
String.raw`     const all=b.i.map(rd),hk=all.map((_,k)=>{const sid=b.sgi&&b.sgi[k];const q=sid!=null&&rt.st[sid];return!(q&&q.val>.5)}),ok=all.filter((_,k)=>hk[k]);
     const md=P.mode||'AVG',ki=md!=='AVG'&&b.mi?b.mi[md]:null;let y;
     if(ki!=null&&hk[ki]){y=all[ki];s.last=y;s.use=md}
     else if(ok.length){y=ok.reduce((p,q)=>p+q,0)/ok.length;s.last=y;s.use=ki!=null?'AVG (the selected input is bad)':'AVG'}
     else{y=s.last!=null?s.last:(all.length?all.reduce((p,q)=>p+q,0)/all.length:0);s.use='holds the last value (all inputs bad)'}
     s.nok=ok.length;out(y);break}`);
/* G-03 divide by zero and square root of a negative number are INVALID conditions (legend of ABC-000), not normal results: flagged in the block panel; DIV holds its last good value, SQRT gives 0 */
rep(String.raw`   case 'DIV':{const d=rd(b.de);out(d?rd(b.nu)/d:0);break}`,
String.raw`   case 'DIV':{const d=rd(b.de);if(Math.abs(d)<1e-9){s.bad=1;out(s.good!=null?s.good:0)}else{s.bad=0;s.good=rd(b.nu)/d;out(s.good)}break}`);
rep(String.raw`   case 'SQRT':out(100*Math.sqrt(Math.max(0,rd(b.i[0]))/100));break;`,
String.raw`   case 'SQRT':{const x=rd(b.i[0]);if(x<0){s.bad=1;out(0)}else{s.bad=0;out(100*Math.sqrt(x/100))}break}`);
/* G-04 the instructions written on the drawing are executed: "IF M.0252 = 1  SET SI0361 => PICMS1002.SV" (CTK): while the condition holds, the source signal is written into the SV of controller PICMS1002 (the SV pin of the DEV in front of its PID); "SET SI0200 => AB0117" (ABC-001A): into the manual value of the COS named AB0117. A condition "= 0" works too. Several writes to one SV: the last true one wins. */
rep(String.raw`  for(const b of blk)if(b.k==='VLV'){const ip=`,
String.raw`  S.sets=[];for(const t of TX){const m=/^SET\s+(\S+)\s*=>\s*(\S+?)\s*$/i.exec(t.t.trim());if(!m)continue;
   const ift=TX.filter(q=>/^IF\s+\S+\s*=\s*[01]/i.test(q.t.trim())&&anD(q.x,q.y,t.x,t.y)<40).sort((a,c)=>anD(a.x,a.y,t.x,t.y)-anD(c.x,c.y,t.x,t.y))[0];if(!ift)continue;const im=/^IF\s+(\S+)\s*=\s*([01])/i.exec(ift.t.trim());
   const netOf=tag=>{let r=-1;S.lab.forEach((l,n)=>{if(r<0&&l&&l.t===tag&&nets[n].segs.length)r=n});if(r<0){const q=(S.tagN||[]).find(z=>z.t===tag);if(q)r=q.n}if(r<0){const tx2=TX.find(z=>z.t.trim()===tag);if(tx2){let bd=12;for(const sg of S.seg){const d=anPtSeg(tx2.x,tx2.y,sg);if(d<bd&&sg.net!=null){bd=d;r=sg.net}}}}return r};
   const src=netOf(m[1]),ctl=netOf(im[1]);let tgt=-1;const svm=/^(.+)\.SV$/i.exec(m[2]);
   if(svm){const pid=blk.find(b=>(b.k==='PID'||b.k==='PIDV')&&(b.txt||[]).some(x=>x.trim()===svm[1]));const dv=pid&&S.drv[pid.in0]&&S.drv[pid.in0].find(d=>d.k==='DEV');
    if(dv){let best=null,bs=1e9;const dist=(re,p)=>Math.min(99,...TX.filter(x=>re.test(x.t.trim())).map(x=>anD(x.x,x.y,p.x,p.y)));for(const p of dv.pins.filter(p=>p.role==='in')){const sc=dist(/^SV$/,p)-dist(/^PV$/,p);if(sc<bs){bs=sc;best=p}}if(best&&dist(/^SV$/,best)<22)tgt=best.n}}
   else{const tt=TX.find(x=>x.t.trim()===m[2]);if(tt){const cb=blk.filter(b=>b.k==='COS'&&b.vnet!=null).sort((a,c)=>anD(a.cx,a.cy,tt.x,tt.y)-anD(c.cx,c.cy,tt.x,tt.y))[0];if(cb&&anD(cb.cx,cb.cy,tt.x,tt.y)<40){if(cb.used)tgt=cb.vnet;else{let bd=14;for(const sg of S.seg){const d=anPtSeg(cb.cx,cb.cy,sg);if(d<bd&&sg.net!=null){bd=d;tgt=sg.net}}}}}}
   if(ctl>=0&&!S.drv[ctl].length&&!S.cns[ctl].some(x=>x.k==='SET'))S.cns[ctl].push({k:'SET',id:-1,i:[],o:[],p:{}});/* the condition tag is an input the user can set */
   S.sets.push({text:t.t.trim(),cond:ift.t.trim(),src,ctl,tgt,eq:+im[2]});
   if(src>=0&&ctl>=0&&tgt>=0){const q={c:ctl,src,eq:+im[2],tag:m[2]};if(S.pre[tgt])(S.pre[tgt].alt=S.pre[tgt].alt||[]).push(q);else S.pre[tgt]=q}}
  for(const b of blk)if(b.k==='VLV'){const ip=`);
/* the presets apply a number (val) or, for a written signal, the value of its source net (src); condition = 1 or = 0 */
rep(String.raw`for(const q of[pr].concat(pr.alt||[]))if(v[q.c]>.5)v[+k]=q.val}`,
String.raw`for(const q of[pr].concat(pr.alt||[]))if(q.eq===0?v[q.c]<.5:v[q.c]>.5){v[+k]=q.src!=null?v[q.src]:q.val;if(q.src!=null)rt.ext[+k]=v[+k]}}`);
rep(String.raw`for(const q of[pr].concat(pr.alt||[]))if(v[q.c]>.5)v[n]=q.val}};`,
String.raw`for(const q of[pr].concat(pr.alt||[]))if(q.eq===0?v[q.c]<.5:v[q.c]>.5)v[n]=q.src!=null?v[q.src]:q.val}};`);
/* G-05 block panel: integrators with total + reset, TP, SEL mode, DIV / SQRT invalid flag, PO pulses */
rep(String.raw`else if(b.k==='SUMA'||b.k==='SUMP')d.append(h$('small',{txt:'Integrator is TEMPORARY: output = input.'}))`,
String.raw`else if(b.k==='SUMA'||b.k==='SUMP'){const st=S.rt.st[b.id],e=h$('span',{cls:'v'});const f=()=>{e.textContent=b.k==='SUMA'?fmt(st.tot||0):String(st.cnt||0)+' pulses'};f._s=1;PU.push(f);f();d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:b.k==='SUMA'?'Total = integral of the input':'Pulse count'}),e,h$('button',{txt:'Reset total',onclick:()=>{st.tot=0;st.cnt=0;panelUpd(true)}})]));d.append(h$('small',{txt:b.k==='SUMA'?'The input is a rate per HOUR (T/H, m3/h, MW): the total grows by input x time / 3600. It has no output on the drawing: read it here.':'Counts the rising edges of the pulse input.'}))}`);
rep(String.raw`else if(b.k==='PVSV'){const e=h$('span',{cls:'v'});`,
String.raw`else if(b.k==='TP'){const i=h$('input',{type:'number',step:'any',placeholder:'not set'});i.style.width='84px';if(P.tref!=null)i.value=P.tref;i.onchange=()=>{const x=parseFloat(i.value);pSet(sh,b,'tref',isFinite(x)?x:null)};d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'Operating temperature (unit of the T input)'}),i]));const e=h$('span',{cls:'v'});const f=()=>{e.textContent='Kt = '+(S.rt.st[b.id].kt==null?'-':S.rt.st[b.id].kt.toFixed(4))};f._s=1;PU.push(f);f();d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'Correction'}),e]));d.append(h$('small',{txt:(P.tref==null?'NOT compensating: the operating temperature is in the Compensation file, not on the drawing. ':'')+'Output = DP / Kt, Kt = (T + 273.15) / (T operating + 273.15).'}))}
 else if(b.k==='SEL'&&b.mopts){const sl=h$('select',{},b.mopts.map(o=>h$('option',{value:o,txt:o==='AVG'?'AVG (average of the healthy inputs)':o==='PRI'?'PRI (primary = left input)':o==='SEC'?'SEC (secondary = right input)':'Input '+o})));sl.value=P.mode||'AVG';sl.onchange=()=>pSet(sh,b,'mode',sl.value);const e=h$('span',{cls:'v'});const f=()=>{e.textContent=S.rt.st[b.id].use||''};f._s=1;PU.push(f);f();d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'Select mode'}),sl]),h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'Now using'}),e]))}
 else if(b.k==='DIV'||b.k==='SQRT'){const e=h$('span',{cls:'v'});const f=()=>{e.textContent=S.rt.st[b.id].bad?(b.k==='DIV'?'INVALID: divide by zero (holds the last good value)':'INVALID: negative input (output 0)'):'valid'};f._s=1;PU.push(f);f();d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'Condition'}),e]))}
 else if(b.k==='PO'){const e=h$('span',{cls:'v'});const f=()=>{const q=S.rt.st[b.id];e.textContent=q.up?'raise pulse (PO1)':q.dn?'lower pulse (PO2)':'no pulse'};f._s=1;PU.push(f);f();d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'Pulse output'}),e]));pr('cyc','Pulse cycle (s) ASSUMED');pr('stroke','Full stroke time (s) ASSUMED');pr('minp','Shortest pulse (s) ASSUMED');d.append(h$('small',{txt:'Pulse output: a rise of the demand = raise pulse, a fall = lower pulse. Pulse cycle, full stroke and shortest pulse are NOT on the drawing: ASSUMED defaults (see docs/ASSUMED-VALUES.md), change them here.'}))}
 else if(b.k==='PVSV'){const e=h$('span',{cls:'v'});`);
/* G-06 page links: click a circle again and again = visit EVERY other end (same sheet, and every sheet named by the number / letter + sheet below it or by the text "( FROM / TO ABC-xxx )", "004B/C" = both), then the first again. The partner is chosen by the tag beside the circles first, by position only when the tags do not decide. */
rep(String.raw`if(theirs.length){const pc=theirs[Math.min(idx,theirs.length-1)],[a,b]=pairRoles(sh,c,p,pc);`,
String.raw`if(theirs.length){const sh_=theirs.filter(q=>(c.tags||[]).some(t=>(q.tags||[]).includes(t))),pc=sh_.length===1?sh_[0]:theirs[Math.min(idx,theirs.length-1)],[a,b]=pairRoles(sh,c,p,pc);`);
const cc0=String.raw`function connClick(c){const sh=cs(),S=sh.S;AN.sel={net:c.nets[0]};selBox();paint();panelUpd(true);`;
rep(cc0+String.raw`
 const lk=linksOf(sh).find(l=>l.at.c===c);
 if(c.tgt){if(lk){jumpTo(lk.peer.sh,lk.peer.c);return}`,
String.raw`/* every other end of a circle: same number on this sheet, and on every sheet named by the sheet code under the number / letter or by the text ( FROM / TO ABC-xxx ) ("004B/C" = both) */
function endsOf(sh,c){const S=ensure(sh),ends=[],addE=(s2,c2)=>{if(!(s2===sh&&c2===c)&&!ends.some(e=>e.sh===s2&&e.c===c2))ends.push({sh:s2,c:c2})},lk=linksOf(sh).find(l=>l.at.c===c);
 if(!c.tgt)S.conn.filter(q=>q!==c&&q.num===c.num).forEach(q=>addE(sh,q));
 const names=c.tgt?[String(c.tgt)]:(c.ref?(c.ref.codes||[c.ref.code]):[]);
 for(const code of names)for(const p of AN.sheets){if(p===sh||!(codeOf(p.name)===code||(!hasL(code)&&famOf(p.name)===parseInt(code,10))))continue;let PS;try{PS=ensure(p)}catch(e){continue}
  (PS.xc||[]).filter(q=>q.num===c.num&&pointsTo(q,sh)).concat((PS.conn||[]).filter(q=>q.num===c.num)).forEach(q=>addE(p,q))}
 if(lk)addE(lk.peer.sh,lk.peer.c);return ends}
`+cc0+String.raw`
 const lk=linksOf(sh).find(l=>l.at.c===c);
 {/* the group = this circle + all circles reached from it, also through the other circles (a receiver knows only its sender, the sender knows all receivers); walk the group in a fixed order (sheet, then top to bottom, left to right): every click goes to the next member, after the last it starts again. Click the circle you are at to continue. */
  const seen=[{sh,c}];for(let i=0;i<seen.length&&seen.length<64;i++)for(const e of endsOf(seen[i].sh,seen[i].c))if(!seen.some(x=>x.sh===e.sh&&x.c===e.c))seen.push(e);
  if(seen.length>1){const grp=seen.slice().sort((a,b)=>AN.sheets.indexOf(a.sh)-AN.sheets.indexOf(b.sh)||posCmp(a.c,b.c)),me=grp.findIndex(e=>e.sh===sh&&e.c===c),k=(me+1)%grp.length,e=grp[k];jumpTo(e.sh,e.c);
   msg('Circle '+c.num+(c.tgt?' / '+c.tgt:'')+' → '+(e.sh===sh?'same sheet':e.sh.name)+'  (end '+(k+1)+' of '+grp.length+'; click the circle you are at to go to the next end, after the last it starts again)'+(lk&&e.c===lk.peer.c&&e.sh===lk.peer.sh?'  · signal link':''));return}}
 if(c.tgt){if(lk){jumpTo(lk.peer.sh,lk.peer.c);return}`);
};
