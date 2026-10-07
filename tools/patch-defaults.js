/* v1.15 WIP: defaults that are NOT on the drawings (tools/assumed-data.js = source of truth, docs/ASSUMED-VALUES.md = the list).
   Called by tools/patch-1.15.0.js after patch-blocks.js: require('./patch-defaults.js')(rep).
   - TP  : operating temperature of each flow from the user's Compensation file (real data).
   - ALM : ASSUMED limits HH / H / L / LL (150 MW CFB with reheat).
   - RATE: ASSUMED rate of the ramp boxes that have no number on the drawing.
   - PO  : ASSUMED pulse cycle / stroke / shortest pulse.
   Every block that got a default carries b.dflt = {k, e}; the panel says so, the Assumed values list in the app shows all of them. */
const D=require('./assumed-data.js');
module.exports=(rep)=>{
const json=JSON.stringify(D).replace(/<\/script/gi,'<\\/script');
rep(String.raw`function anCompile(S){`,
String.raw`const AN_DEF=`+json+String.raw`;
/* apply the defaults that are not on the drawing (called at the start of anInit, before the saved values of the user are applied) */
function anDefaults(S){if(typeof AN_DEF==='undefined')return;
 const kpOf=b=>{const q=S.tx.filter(t=>/^FIFA\d+[A-D]?\.KP2$/i.test(t.t.trim())&&anD(t.x,t.y,b.cx,b.cy)<=60).sort((p,r)=>anD(p.x,p.y,b.cx,b.cy)-anD(r.x,r.y,b.cx,b.cy))[0];return q?q.t.trim().toUpperCase().replace(/\.KP2$/,''):''};
 const fixedRate=S.blk.filter(b=>b.k==='RATE'&&b.main!==undefined&&b.up===undefined&&!(b.p.rate>0)).sort((p,q)=>p.id-q.id),rl=AN_DEF.RATE.filter(e=>e.sheet===S.name);
 fixedRate.forEach((b,i)=>{const e=rl[i];if(e){b.p.rate=e.rate;b.dflt={k:'RATE',e}}});
 for(const b of S.blk){const P=b.p;
  if(b.k==='ALM'){const tag=(b.txt||[])[1],e=AN_DEF.ALM.find(q=>q.tag===tag);if(e&&P.hh==null&&P.h==null&&P.l==null&&P.ll==null){P.hh=e.hh;P.h=e.h;P.l=e.l;P.ll=e.ll;b.dflt={k:'ALM',e}}}
  else if(b.k==='TP'){const kp=kpOf(b),e=AN_DEF.TP.find(q=>q.kp===kp&&q.sheet===S.name);if(e){P.tref=e.top;b.dflt={k:'TP',e}}}
  else if(b.k==='PO'){const e=AN_DEF.PO;if(P.cyc==null){P.cyc=e.cyc;P.stroke=e.stroke;P.minp=e.minp;b.dflt={k:'PO',e}}}}}
function anCompile(S){`);
rep(String.raw`function anInit(S){const N=S.nets.length,`,String.raw`function anInit(S){anDefaults(S);const N=S.nets.length,`);
/* panel notes */
rep(String.raw`'Alarm limits live in the HMI, not on the drawing: type them here to test (empty = not used).'`,
String.raw`(b.dflt?'ASSUMED DEFAULT limits (150 MW CFB with reheat), NOT the DCS values: '+b.dflt.e.desc+' · '+b.dflt.e.basis+'. Type your own to replace them (empty = not used).':'Alarm limits live in the HMI, not on the drawing: type them here to test (empty = not used).')`);
rep(String.raw`else if(b.k==='RATE'||b.k==='RAMPB')pr('rate','Rate (% per sec)');`,
String.raw`else if(b.k==='RATE'||b.k==='RAMPB'){pr('rate','Rate (signal units per sec)');if(b.dflt)d.append(h$('small',{txt:'ASSUMED rate ('+b.dflt.e.rate+' '+b.dflt.e.u+'): the drawing shows no number for this box. '+b.dflt.e.loop+' · '+b.dflt.e.basis}))}`);
rep(String.raw`d.append(h$('small',{txt:(P.tref==null?'NOT compensating: the operating temperature is in the Compensation file, not on the drawing. ':'')+'Output = DP / Kt, Kt = (T + 273.15) / (T operating + 273.15).'}))`,
String.raw`d.append(h$('small',{txt:(b.dflt?'From the Compensation file (LMYP-1 #1-Compensation Calculation of Flow.xls): '+b.dflt.e.ft+' '+b.dflt.e.desc+', temperature '+b.dflt.e.tt+', range '+b.dflt.e.tbs+' ~ '+b.dflt.e.tfs+' °C, operating '+b.dflt.e.top+' °C (at = '+b.dflt.e.at.toFixed(4)+', bt = '+b.dflt.e.bt.toFixed(4)+'). ':(P.tref==null?'NOT compensating: no operating temperature known for this TP. ':''))+'Output = DP / Kt, Kt = (T + 273.15) / (T operating + 273.15).'}))`);
/* app: "Assumed values" button = list of everything that is not on the drawings (same panel as the LN tables) */
rep(String.raw`bLn=h$('button',{txt:'LN tables',title:'F(X) linearization tables'}),`,String.raw`bLn=h$('button',{txt:'LN tables',title:'F(X) linearization tables'}),bAs=h$('button',{txt:'Assumed values',title:'Every value that is not written on the drawings: from the Compensation file, or ASSUMED (150 MW CFB with reheat)'}),`);
rep(String.raw`bHp,bLn,bPn,`,String.raw`bHp,bLn,bAs,bPn,`);
rep(String.raw`bLn.onclick=()=>{if(anln.style.display==='block'){anln.style.display='none';anln.hidden=true}else lnOpen()};`,
String.raw`bLn.onclick=()=>{if(anln.style.display==='block'){anln.style.display='none';anln.hidden=true}else lnOpen()};
function asOpen(){anln.hidden=false;anln.style.display='block';anln.innerHTML='';const D=AN_DEF,go=n=>{const i=AN.sheets.findIndex(s=>s.name===n);if(i>=0)AN.go(i)},cell=(t,w)=>h$('td',{style:'padding:2px 6px;border-bottom:1px solid var(--line,#334);'+(w||''),txt:String(t==null?'-':t)});
 const tab=(head,rows)=>{const t=h$('table',{style:'border-collapse:collapse;font-size:11px;margin:4px 0 10px'});t.append(h$('tr',{},head.map(x=>h$('th',{style:'text-align:left;padding:2px 6px',txt:x}))));rows.forEach(r=>t.append(h$('tr',{},r.map((c,i)=>i===0?h$('td',{style:'padding:2px 6px;border-bottom:1px solid var(--line,#334)'},[h$('a',{href:'#',txt:c,style:'color:inherit',onclick:ev=>{ev.preventDefault();go(c)}})]):cell(c)))));return t};
 anln.append(h$('b',{txt:'Values that are NOT written on the drawings'}),h$('button',{txt:'✕',style:'float:right',onclick:()=>{anln.style.display='none';anln.hidden=true}}),
  h$('div',{style:'margin:6px 0;color:var(--dim)',txt:'TP = real plant data (Compensation file). ALM limits, ramp rates and the pulse cycle are ASSUMED for a 150 MW CFB boiler with reheat (set by the engineer assistant, 2026-10-07): replace them with the DCS values in the block panel. Click a sheet name to open it. Full list with the reason for each number: docs/ASSUMED-VALUES.md.'}),
  h$('b',{txt:'TP temperature compensation (Compensation file, real data)'}),tab(['Sheet','Flow tag','Description','Temp. tag','Range °C','Operating °C','at','bt'],D.TP.map(e=>[e.sheet,e.ft,e.desc,e.tt,e.tbs+' ~ '+e.tfs,e.top,e.at.toFixed(4),e.bt.toFixed(4)])),
  h$('b',{txt:'RATE ramp boxes without a rate on the drawing (ASSUMED)'}),tab(['Sheet','Loop','Rate','Unit','Why'],D.RATE.map(e=>[e.sheet,e.loop,e.rate,e.u,e.basis])),
  h$('b',{txt:'PO / PIDV pulse output (ASSUMED)'}),tab(['Pulse cycle s','Full stroke s','Shortest pulse s','Why'],[[D.PO.cyc,D.PO.stroke,D.PO.minp,D.PO.basis]]),
  h$('b',{txt:'ALM limits (ASSUMED) — '+D.ALM.length+' alarms'}),tab(['Tag','HH','H','L','LL','Unit','Description','Why'],D.ALM.map(e=>[e.tag,e.hh,e.h,e.l,e.ll,e.u,e.desc,e.basis])))}
bAs.onclick=()=>{if(anln.style.display==='block'&&anln.firstChild&&/NOT written/.test(anln.firstChild.textContent)){anln.style.display='none';anln.hidden=true}else asOpen()};`);
/* F(X) LN38 / LN39 of STATION 1 (ABC-010 drum level pressure compensation) are NOT in LINEAR.xls (only S2-LN38 / S2-LN39 of the heaters are): the sheet had no table (y = x). The user's file "Drum Level Calculation.xls" has the two curves (K = LN39 Y-axis, N = LN38 Y-axis, x = drum pressure kg/cm2). */
{const dl=require('./data/drum-level-ln.json'),ent=(ln,pts,title)=>({key:'S1-LN'+ln,stn:1,ln,dwg:'ABC-010',ptn:'S1-LN-'+ln,title,xr:[0,250],yr:[0,1],xu:'RANGE (kg/cm2)',yu:'RANGE (%)',src:'Drum Level Calculation.xls',pts});
 /* units deduced from the sheet (SUB: 100 - LN38 = offset in %, DIV: / LN39 = gain as a ratio): LN38 y = N x 100 (%), LN39 y = K (ratio). Check: with these units the sheet gives level out = level in at 0 kg/cm2 (identity), as physics needs; any other unit choice gives an offset / gain error at zero pressure. */
 const add=[Object.assign(ent(38,dl.LN38.map(q=>[q[0],q[1]*100]),'DRUM LEVEL PRESSURE COMPENSATION F4(p), N x 100 % (from the Drum Level Calculation file)'),{yr:[0,100]}),ent(39,dl.LN39,'DRUM LEVEL PRESSURE COMPENSATION F3(p), K as a ratio (from the Drum Level Calculation file)')];
 rep(String.raw`<script type="application/json" id="aln">[`,String.raw`<script type="application/json" id="aln">[`+JSON.stringify(add).slice(1,-1).replace(/<\/script/gi,'<\\/script')+',');
 rep(String.raw`(tb&&!man?tb.key+' · '+tb.dwg+' · ':'')`,String.raw`(tb&&!man?tb.key+' · '+tb.dwg+' · '+(tb.src?'FROM THE FILE '+tb.src+' (not in LINEAR.xls) · ':''):'')`)}
};
