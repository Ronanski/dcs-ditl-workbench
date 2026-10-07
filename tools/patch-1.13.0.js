/* v1.12.1 -> v1.13.0 (built in wip/, released only when the whole plan A..G + manual is complete: docs/PLAN.md). DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('logic-sim-v1.12.1.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.12.1</title>','<title>Logic Sim v1.13.0</title>');

/* ===== D: a T drawn with NO input wires and a "NN%" text next to it (IGNITION POS. 25%, ABC-003A/B/C/D) is a constant ===== */
rep(`  const P=b.p;
  switch(b.k){
   case 'SW':case 'AMT':{
     /* controls are`,`  if((b.k==='SW'||b.k==='AMT')&&!ins.length&&outs.length){const pt=near(b.cx,b.cy,14,t=>/^\\s*-?\\d+(?:\\.\\d+)?\\s*%\\s*$/.test(t.t.trim()))[0];if(pt){b.k='CONST';b.txt=[pt.t.trim()];b.p={val:anNum(pt.t)};b.note='T without wires: constant '+pt.t.trim()}}
  const P=b.p;
  switch(b.k){
   case 'SW':case 'AMT':{
     /* controls are`);

/* ===== E: SEL = average of the HEALTHY transmitters (SIG.AB flag of the AI that feeds each input); CTK = conditional write (no zero when off) ===== */
rep(` for(const n of S.ext){rt.ext[n]=S.nets[n].dig?0:0}
 rt.ramp=`,` {const ai=S.blk.filter(b=>b.k==='AI'),sg=S.blk.filter(b=>b.k==='SIGAB'),pr=[];for(const a of ai)for(const g of sg){const d=anD(a.cx,a.cy,g.cx,g.cy);if(d<=45)pr.push({a,g,d})}pr.sort((x,y)=>x.d-y.d);const ua=new Set(),ug=new Set();for(const q of pr){if(ua.has(q.a)||ug.has(q.g))continue;ua.add(q.a);ug.add(q.g);q.a.sig=q.g}
  for(const b of S.blk)if(b.k==='SEL')b.sgi=b.i.map(n=>{const d=(S.drv[n]||[]).find(x=>x.k==='AI'&&x.sig);return d?d.sig.id:null})}
 for(const n of S.ext){rt.ext[n]=S.nets[n].dig?0:0}
 rt.ramp=`);
rep(`   case 'SEL':{const a=b.i.map(rd);out(a.length?a.reduce((p,q)=>p+q,0)/a.length:0);break}`,`   case 'SEL':{/* AVERAGE SELECT CIRCUIT: average of the inputs whose transmitter is healthy (SIG.AB = 0); all bad: hold the last value */
     const all=b.i.map(rd),ok=all.filter((_,k)=>{const sid=b.sgi&&b.sgi[k];const q=sid!=null&&rt.st[sid];return!(q&&q.val>.5)});
     let y;if(ok.length){y=ok.reduce((p,q)=>p+q,0)/ok.length;s.last=y}else y=s.last!=null?s.last:(all.length?all.reduce((p,q)=>p+q,0)/all.length:0);
     s.nok=ok.length;out(y);break}`);
rep(`   case 'CTK':out(B(rd(b.ctl))?rd(b.cin):0);break;`,`   case 'CTK':{/* conditional write (SET SIxxxx => TAG.SV IF ctl): while ctl = 1 it sends the input, when ctl = 0 it does NOT write (the last value stays) */
     if(B(rd(b.ctl)))s.cv=rd(b.cin);out(s.cv==null?0:s.cv);break}`);

/* ===== B: PID default tuning by loop type (first letters of the tag) + suggested simulation speed. DEFAULTS only: the real tuning is in the DCS database ===== */
rep(`     if(P.kp==null){P.kp=1;P.ti=60;P.td=0;P.lo=0;P.hi=100}`,`     if(P.kp==null){const tg0=((b.txt||[]).filter(t=>!AN_HDR.test(t.trim()))[0]||'').replace(/^S\\d\\s*/,'').toUpperCase(),c0=/^DP/.test(tg0)?'P':tg0[0],LT={F:{kp:1,ti:15,sp:1,n:'flow'},P:{kp:1,ti:60,sp:5,n:'pressure'},T:{kp:1,ti:180,sp:60,n:'temperature'},L:{kp:1,ti:120,sp:10,n:'level'},A:{kp:.8,ti:240,sp:60,n:'analysis'},S:{kp:1,ti:30,sp:5,n:'speed'}}[c0]||{kp:1,ti:60,sp:5,n:'general'};
      P.kp=LT.kp;P.ti=LT.ti;P.td=0;P.lo=0;P.hi=100;P.lt=LT.n;P.sp=LT.sp}`);
rep(`' s (default tuning, edit in the block panel)'`,`' s (default for a '+(b.p.lt||'general')+' loop, edit in the block panel) · suggested speed '+(b.p.sp||1)+'x'`);
rep(`if(b.k==='PID'||b.k==='PIDV'){pr('kp',`,`if(b.k==='PID'||b.k==='PIDV'){d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'Loop type: '+(b.p.lt||'general')+' · suggested speed '+(b.p.sp||1)+'x'}),h$('button',{txt:'Use this speed',title:'Set the simulation speed in the top bar',onclick:()=>{sSpd.value=String(b.p.sp||1);sSpd.dispatchEvent(new Event('change'))}})]));pr('kp',`);

/* ===== C: FX tables: strict STATION + LN lookup (S1-LN21), warning instead of a silent fallback ===== */
rep(`function lnFind(name,ln){`,`/* station of a sheet = prefix of its own MDL tags (S1-MDL028); without any: the only station that has all the LN numbers of its FX blocks */
function stnOf(S){const c={};for(const t of S.tx){const m=/^S(\\d)-(?:MDL|LN)/i.exec(t.t.trim());if(m)c[m[1]]=(c[m[1]]||0)+1}const e=Object.entries(c).sort((a,b)=>b[1]-a[1]);if(e.length)return+e[0][0];
 const L=[...new Set(S.blk.filter(b=>b.k==='FX'&&b.p.ln).map(b=>+(/LN(\\d+)/i.exec(b.p.ln)||[])[1]).filter(Boolean))];if(!L.length)return null;const tb=lnTables(),cand=[1,2,3,4,5].filter(s=>L.every(n=>tb.some(t=>t.stn===s&&t.ln===n)));return cand.length===1?cand[0]:null}
function lnResolve(name,ln,stn){const m=/LN(\\d+)/i.exec(ln||'');if(!m)return{};const n=+m[1],all=lnTables().filter(t=>t.ln===n);if(!all.length)return{warn:'no table LN'+n+' in the LINEAR data: the block passes the value (y = x)'};
 if(stn!=null){const ex=all.find(t=>t.stn===stn);if(ex)return{t:ex};if(all.length===1)return{t:all[0],warn:'station S'+stn+' has no LN'+n+': using '+all[0].key+' (the only one that exists). Check the drawing.'};return{warn:'station S'+stn+' has no LN'+n+' (exists in '+all.map(t=>'S'+t.stn).join(', ')+'): no table, y = x'}}
 const t=lnFind(name,ln);return t?{t,warn:'station of this sheet unknown: table chosen by drawing name ('+t.key+')'}:{warn:'station unknown and table LN'+n+' ambiguous'}}
function lnFind(name,ln){`);
rep(`if(b.k==='FX'&&b.p.ln){const t=lnFind(sh.name,b.p.ln);if(t)Object.defineProperty(b.p,'tbl',{value:t,writable:true,enumerable:false,configurable:true})}`,`if(b.k==='FX'&&b.p.ln){if(sh.stn===undefined)sh.stn=stnOf(S);const r=lnResolve(sh.name,b.p.ln,sh.stn);if(r.t)Object.defineProperty(b.p,'tbl',{value:r.t,writable:true,enumerable:false,configurable:true});if(r.warn)Object.defineProperty(b.p,'lnWarn',{value:r.warn,writable:true,enumerable:false,configurable:true})}`);

/* ===== I: LN table editor: LX % / LY % editable, X / Y calculated, own reset, saved in the project file; the existing graph stays ===== */
rep(`sv:{},fl:'',av:{}}`,`sv:{},lne:{},fl:'',av:{}}`);
rep(`try{AN.sv=JSON.parse(localStorage.getItem('ditl.an')||'{}')||{}}catch(e){AN.sv={}}`,`try{AN.sv=JSON.parse(localStorage.getItem('ditl.an')||'{}')||{}}catch(e){AN.sv={}}
try{AN.lne=JSON.parse(localStorage.getItem('ditl.an.lne')||'{}')||{}}catch(e){AN.lne={}}
const lneSave=()=>{const s=JSON.stringify(AN.lne);try{localStorage.setItem('ditl.an.lne',s)}catch(e){}persistAll()};`);
rep(`const o={sv:AN.sv,ws:AN.ws,cur:`,`const o={sv:AN.sv,ln:AN.lne,ws:AN.ws,cur:`);
rep(`if(o.sv&&typeof o.sv==='object')AN.sv=o.sv;if(o.ws)Object.assign(AN.ws,o.ws);AN._cur=`,`if(o.sv&&typeof o.sv==='object')AN.sv=o.sv;if(o.ln&&typeof o.ln==='object')AN.lne=o.ln;if(o.ws)Object.assign(AN.ws,o.ws);AN._cur=`);
h=h.split(`sv:AN.sv,ws:AN.ws,cur:(AN.sheets`).join(`sv:AN.sv,ln:AN.lne,ws:AN.ws,cur:(AN.sheets`);
rep(`AN.sv=(o.sv&&typeof o.sv==='object')?o.sv:{};if(o.ws)Object.assign(AN.ws,o.ws);`,`AN.sv=(o.sv&&typeof o.sv==='object')?o.sv:{};AN.lne=(o.ln&&typeof o.ln==='object')?o.ln:{};lnApplyEdits();if(o.ws)Object.assign(AN.ws,o.ws);`);
rep(`return window.ANLT=a}`,`window.ANLT=a;lnApplyEdits();return a}
/* the edited tables (LX % / LY % of the ranges) replace the points of the table; the original points stay in o0 */
function lnApplyEdits(){for(const t of lnTables()){if(!t.o0)t.o0=(t.pts||[]).map(p=>[p[0],p[1]]);const e=AN.lne&&AN.lne[t.key];let pts=t.o0;if(e&&e.lx&&e.ly&&e.lx.length===t.o0.length&&t.xr&&t.yr)pts=e.lx.map((lx,i)=>[t.xr[0]+lx*(t.xr[1]-t.xr[0])/100,t.yr[0]+e.ly[i]*(t.yr[1]-t.yr[0])/100]);
  t.pts=pts;const o=[];pts.forEach(p=>{const q=o[o.length-1];if(!q||q[0]!==p[0]||q[1]!==p[1])o.push([p[0],p[1]])});o.sort((p,q)=>p[0]-q[0]);t.p2=o;t.edited=!!e}}`);
rep(`  if(tb&&!man)d.append(h$('small',{txt:tb.title||''}));`,`  if(tb&&!man)d.append(h$('small',{txt:tb.title||''}));
  if(P.lnWarn)d.append(h$('small',{style:'color:#ffb24a',txt:'⚠ '+P.lnWarn}));
  if(tb&&!man&&tb.xr&&tb.yr&&tb.o0){const key=tb.key,box=h$('div',{style:'display:none;margin:4px 0;padding:4px;border:1px solid var(--line)'}),btn=h$('button',{txt:tb.edited?'Edit table (edited)':'Edit table'});
   const cur=()=>{const e=AN.lne[key];return{lx:e?e.lx.slice():tb.o0.map(q=>(q[0]-tb.xr[0])/(tb.xr[1]-tb.xr[0])*100),ly:e?e.ly.slice():tb.o0.map(q=>(q[1]-tb.yr[0])/(tb.yr[1]-tb.yr[0])*100)}};
   const f2=v=>(Math.round(v*100)/100).toString();
   const build=()=>{box.innerHTML='';box.append(h$('b',{txt:key+'  ·  '+(tb.title||'')}),h$('small',{txt:'Edit LX % and LY % (as in the DCS). X and Y are calculated from the ranges: X '+tb.xr[0]+' … '+tb.xr[1]+' , Y '+tb.yr[0]+' … '+tb.yr[1]+'. This edit has its own Reset and is NOT cleared by the global Reset.'}));
    const c=cur(),n=c.lx.length,xs=[],ys=[],warn=h$('small',{style:'color:#ff7a7a'});
    const upd=()=>{for(let i=0;i<n;i++){xs[i].textContent=f2(tb.xr[0]+c.lx[i]*(tb.xr[1]-tb.xr[0])/100);ys[i].textContent=f2(tb.yr[0]+c.ly[i]*(tb.yr[1]-tb.yr[0])/100)}let bad=false;for(let i=1;i<n;i++)if(c.lx[i]<c.lx[i-1])bad=true;warn.textContent=bad?'⚠ LX must not decrease from row to row':''};
    const commit=(i,k,x)=>{c[k][i]=x;AN.lne[key]={lx:c.lx.slice(),ly:c.ly.slice()};lneSave();lnApplyEdits();btn.textContent='Edit table (edited)';upd();settle()};
    box.append(h$('div',{cls:'r',style:'font-weight:700'},[h$('span',{txt:'NO.',style:'width:26px'}),h$('span',{txt:'LX %',style:'width:74px'}),h$('span',{txt:'LY %',style:'width:74px'}),h$('span',{txt:'X',style:'width:60px'}),h$('span',{txt:'Y',style:'width:60px'})]));
    for(let i=0;i<n;i++){const ix=num(f2(c.lx[i]),x=>commit(i,'lx',x)),iy=num(f2(c.ly[i]),x=>commit(i,'ly',x));ix.style.width=iy.style.width='70px';const sx=h$('span',{style:'width:60px;color:var(--dim)'}),sy=h$('span',{style:'width:60px;color:var(--dim)'});xs.push(sx);ys.push(sy);box.append(h$('div',{cls:'r'},[h$('span',{txt:String(i+1).padStart(2,'0'),style:'width:26px'}),ix,iy,sx,sy]))}
    box.append(warn,h$('div',{cls:'r'},[h$('button',{txt:'Reset this table',title:'Back to the DCS values (LINEAR.xls). Only this table.',onclick:()=>{delete AN.lne[key];lneSave();lnApplyEdits();btn.textContent='Edit table';settle();build()}})]));upd()};
   btn.onclick=()=>{if(box.style.display==='none'){build();box.style.display='block'}else box.style.display='none'};d.append(h$('div',{cls:'r'},[btn]),box)}`);
/* LN panel: list of edited tables + reset all linear edits */
rep(`h$('button',{txt:'Download JSON',onclick:`,`h$('button',{txt:'Reset ALL linear edits ('+Object.keys(AN.lne).length+')',title:'Only the LX / LY edits of the tables. Not the global Reset.',onclick:()=>{AN.lne={};lneSave();lnApplyEdits();lnOpen();if(cs()&&cs().S)settle()}}),h$('button',{txt:'Download JSON',onclick:`);

/* ===== G: descriptions from the user's IO list + memory lists (unit 1, data/ades-unit1.json), address highlight when selected ===== */
{const zlib=require('zlib');const raw=fs.readFileSync('data/ades-unit1.json');const b64=zlib.gzipSync(raw,{level:9}).toString('base64');
 rep('<script id="analogjs">','<script type="text/plain" id="ades">'+b64+'</script><script id="analogjs">')}
rep(`async function loadData(){if(AN.data)return AN.data;
 AN.data=(async()=>{try{await AN.kv}catch(e){}`,`/* descriptions: station -> address -> record (IO list rows: tag, description, range, unit, type, SIG.AB address; memory lists: description, remark, timer type / seconds) */
let ADES=null;
async function adesLoad(){if(ADES)return ADES;const e=document.getElementById('ades');if(!e||!e.textContent.trim()){ADES={};return ADES}try{const bin=Uint8Array.from(atob(e.textContent.trim()),c=>c.charCodeAt(0));ADES=JSON.parse(await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream('gzip'))).text())}catch(x){ADES={}}return ADES}
function shStn(sh){if(sh.stn===undefined&&sh.S)sh.stn=stnOf(sh.S);return sh.stn}
function adesFind(sh,text){if(!ADES||!text)return null;const t=String(text).trim();let m=/^(?:S(\\d)\\s*)?([A-Z]{1,2})\\.([0-9A-F]{3,4})$/i.exec(t),pre,num,dot='.';
 if(m){pre=m[2].toUpperCase();num=m[3].toUpperCase().padStart(4,'0')}else{m=/^(?:S(\\d)\\s*)?(TR|SI|SO|AI|AO|DI|DO|FP|PTN)(\\d{1,6})$/i.exec(t);if(!m)return null;pre=m[2].toUpperCase();dot='';num=pre==='PTN'?m[3].padStart(6,'0'):m[3].padStart(4,'0')}
 const stn=m[1]?+m[1]:(sh?shStn(sh):null),T=ADES[String(stn)],key=pre+dot+num,r=T&&T[key];return r?{rec:r,stn,key}:null}
function adesText(r){if(!r)return'';return r.k==='io'?[r.tag,r.d].filter(Boolean).join(' · '):[r.d,r.r].filter(Boolean).join(' · ')}
function adesLines(a){const r=a.rec,o=[];if(r.k==='io'){o.push((r.tag||'')+'   ['+a.key+(a.stn?' · STN10'+a.stn:'')+']');if(r.d)o.push(r.d);const x=[r.t,(r.lo!=null||r.hi!=null)?(r.lo+' ~ '+r.hi+' '+(r.u||'')):'',r.ab?'signal abnormal '+r.ab:''].filter(Boolean).join('  ·  ');if(x)o.push(x)}
 else{o.push(a.key+'   [STN10'+a.stn+']');if(r.d)o.push(r.d);const x=[r.t?('timer '+r.t+(r.v!=null?' '+r.v+' s':'')):'',r.r].filter(Boolean).join('  ·  ');if(x)o.push(x)}return o}
let CARD=null;
function tagCard(){if(!CARD){CARD=h$('div',{id:'antag',style:'position:absolute;left:10px;top:10px;max-width:440px;background:#0f1a22ee;border:1px solid #2b4a5a;border-left:4px solid #ffe14a;padding:6px 10px;font:12px sans-serif;color:#e7eef3;display:none;z-index:6;pointer-events:none;line-height:1.45'});const c=$('cv');if(c){if(!/relative|absolute|fixed/.test(getComputedStyle(c).position))c.style.position='relative';c.append(CARD)}}return CARD}
/* selected wire: its address text turns yellow (digital) / sky blue (analog) and the description is shown on the drawing */
function tagHi(){const sh=cs(),S=sh&&sh.S,n=S&&AN.sel&&AN.sel.net!=null?AN.sel.net:null,key=n==null?'':sh.name+'#'+n;if(tagHi.k===key)return;tagHi.k=key;
 (tagHi.prev||[]).forEach(([e,f,w])=>{e.setAttribute('fill',f);if(w==null)e.removeAttribute('font-weight');else e.setAttribute('font-weight',w)});tagHi.prev=[];const c=tagCard();c.style.display='none';if(n==null||!L||!L.txe)return;
 const l=S.lab[n]||((S.tagN||[]).filter(q=>q.n===n).sort((a,b)=>a.d-b.d)[0]&&{t:S.tagN.filter(q=>q.n===n).sort((a,b)=>a.d-b.d)[0].t});if(!l||!l.t)return;
 const col=S.nets[n].dig?'#ffe14a':'#5cc8ff';c.style.borderLeftColor=col;
 for(const[t,e]of L.txe)if(t.t.trim()===String(l.t).trim()&&(l.x==null||Math.hypot(t.x-l.x,t.y-l.y)<4)){tagHi.prev.push([e,e.getAttribute('fill'),e.getAttribute('font-weight')]);e.setAttribute('fill',col);e.setAttribute('font-weight','700')}
 const a=adesFind(sh,l.t);c.innerHTML='';if(a){adesLines(a).forEach((x,i)=>{const d=document.createElement('div');d.textContent=x;if(i===0){d.style.fontWeight='700';d.style.color=col}c.append(d)});c.style.display='block'}else{const d=document.createElement('div');d.textContent=l.t;d.style.fontWeight='700';d.style.color=col;c.append(d);const d2=document.createElement('div');d2.style.color='#9fb3c0';d2.textContent='no description in the IO / memory lists';c.append(d2);c.style.display='block'}}
async function loadData(){if(AN.data)return AN.data;
 AN.data=(async()=>{try{await AN.kv}catch(e){}try{await adesLoad()}catch(e){}AN.adesLoad=adesLoad;AN.adesFind=adesFind;AN.shStn=shStn;AN.tagHi=tagHi;`);
rep(`e.textContent=t.t;TXE.set(t,e)});`,`e.textContent=t.t;TXE.set(t,e)});L.txe=TXE;`);
rep(`function paint(){const sh=cs();if(!sh||!sh.S||!L)return;`,`function paint(){const sh=cs();if(!sh||!sh.S||!L)return;try{tagHi()}catch(e){}`);
rep(`function selBox(){const g=L&&L.selg;`,`function selBox(){try{tagHi()}catch(e){}const g=L&&L.selg;`);
rep(` const mkRow=(g,key,tag,descTxt,ctlEls,pos)=>{`,` const mkRow=(g,key,tag,descTxt,ctlEls,pos)=>{{const ad=adesFind(sh,tag);if(ad){const t0=adesText(ad.rec);if(t0)descTxt=t0+(descTxt?'  ·  '+descTxt:'')}}`);

fs.writeFileSync('wip/logic-sim-v1.13.0.html',h);console.log('wip html written',h.length);
