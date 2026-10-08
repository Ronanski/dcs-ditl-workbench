/* v1.15.3 WIP: following a signal through many sheets without getting lost.
   - PATH: every ▶ / ◀ jump is remembered as a breadcrumb "ABC-003E › ABC-003B › ABC-007"; click any crumb to return to that sheet (the path after it is dropped), "⟲ Back to start" = one click to the first sheet.
     A sheet that is already in the path is NOT added again (no endless loops A → B → A): the path is cut back to it.
   - SIGNAL MAP: button "Map: where does this signal go": the whole cross-sheet downstream of the selection in ONE list (grouped by sheet, indented by hop, every sheet listed once even if the signals go round in a circle),
     each line = sheet · receiving wire · what it feeds (block kinds); click a line = go there (and the path is kept). */
module.exports=(rep)=>{
rep(String.raw`function trJump(tsh,net){const i=AN.sheets.indexOf(tsh);if(i<0)return;if(tsh!==cs()){const c0=cs();AN.hist.push({name:c0.name,view:(AN.av[c0.name]||[]).slice()});updBack()}go(i);const s2=cs();if(!s2||!s2.S)return;AN.sel={net};selBox();paint();panelUpd(true)}`,
String.raw`function trJump(tsh,net){const nets=Array.isArray(net)?net.slice():[net];net=nets[0];const i=AN.sheets.indexOf(tsh);if(i<0)return;const c0=cs();let P=AN.trPath=AN.trPath||[];
 if(!P.length||P[P.length-1].name!==c0.name){P.length=0;P.push({name:c0.name,net:AN.sel&&AN.sel.net!=null?AN.sel.net:null,nets:AN.sel&&AN.sel.nets,blk:AN.sel&&AN.sel.blk?AN.sel.blk.id:null})}
 const k=P.findIndex(q=>q.name===tsh.name);if(k>=0)P.length=k;P.push({name:tsh.name,net,nets,blk:null});
 if(tsh!==c0){AN.hist.push({name:c0.name,view:(AN.av[c0.name]||[]).slice()});updBack()}go(i);const s2=cs();if(!s2||!s2.S)return;AN.sel={net,nets};selBox();paint();panelUpd(true)}
function trGoCrumb(k){const P=AN.trPath||[],q=P[k];if(!q)return;P.length=k+1;const i=AN.sheets.findIndex(s=>s.name===q.name);if(i<0)return;if(AN.sheets[i]!==cs()){const c0=cs();AN.hist.push({name:c0.name,view:(AN.av[c0.name]||[]).slice()});updBack()}go(i);const s2=cs();if(!s2||!s2.S)return;
 AN.sel=q.net!=null?{net:q.net,nets:q.nets}:(q.blk!=null?{blk:s2.S.blk.find(b=>b.id===q.blk)}:null);if(AN.sel&&'blk' in AN.sel&&!AN.sel.blk)AN.sel=null;selBox();paint();panelUpd(true)}
function trPathUi(d,sh){const P=AN.trPath||[];if(!P.length)return;if(P[P.length-1].name!==sh.name){AN.trPath=[];return}if(P.length<2)return;
 const box=h$('div',{cls:'r',style:'flex-wrap:wrap;gap:4px;margin:4px 0;align-items:center'});box.append(h$('small',{txt:'Path:'}));
 P.forEach((q,k)=>{const b=h$('button',{cls:'keep',txt:(k===P.length-1?'● ':'')+q.name,title:'Go back to this sheet (the path after it is dropped)'});b.onclick=()=>trGoCrumb(k);box.append(b)});
 box.append(h$('button',{cls:'keep',txt:'⟲ Back to start',onclick:()=>trGoCrumb(0)}),h$('button',{cls:'keep',txt:'Clear path',onclick:()=>{AN.trPath=[];selUpd(d)}}));d.append(box)}
/* every exit of the traced signal (not cut by the 60-row limit of the lists) */
function trStarts(S){const s=AN.sel;if(!s)return[];return s.net!=null?(s.nets&&s.nets.length?s.nets.slice():[s.net]):(s.blk?(s.blk.o||[]).slice():[])}
function trExitsUi(d,sh){const S=sh.S,st=trStarts(S);if(!st.length)return;const dn=trDown(S,st);let ls=[];try{ls=(linksOf(sh)||[]).filter(l=>l.from===sh&&l.fromNets.some(m=>dn.has(m)))}catch(e){}if(!ls.length)return;
 d.append(h$('small',{txt:'This signal leaves the sheet ('+ls.length+'):',style:'display:block;margin-top:4px;color:#ff8ad8'}));
 ls.forEach(l=>{let more='';try{const TS=l.to.S||ensure(l.to),tn=l.toNets[0],nmx=nm(TS,tn),ad=adesFind(l.to,nmx),ds=ad?adesText(ad.rec):'',nc=(TS.cns[tn]||[]).length;more=' → '+nmx+(ds?' · '+ds:'')+' · feeds '+nc}catch(e){}
  const r=h$('div',{cls:'r tr'},[h$('span',{cls:'n',style:'color:#ff8ad8',txt:'   ▶ '+l.to.name+' (circle '+l.num+')'+more})]);r.onclick=()=>{AN._bk=AN.i;trJump(l.to,l.toNets)};d.append(r)})}
/* downstream of some wires inside one sheet (all T legs) */
function trDown(S,starts){const dn=new Set(starts),fr=starts.slice();let g=0;while(fr.length&&g++<500){const nx=[];for(const n of fr){for(const b of S.cns[n]||[])for(const m of b.o||[])if(!dn.has(m)){dn.add(m);nx.push(m)}for(const[dd,sr]of S.link||[])if(sr===n&&!dn.has(dd)){dn.add(dd);nx.push(dd)}}fr.length=0;fr.push(...nx)}return dn}
function trMap(sh,starts){const out=[],seen=new Set([sh.name+'|'+starts.join(',')]),q=[{sh,starts,depth:0,via:''}];
 while(q.length&&out.length<80){const x=q.shift(),S=ensure(x.sh),dn=trDown(S,x.starts),kinds={};for(const m of dn)for(const b of S.cns[m]||[])kinds[b.k]=(kinds[b.k]||0)+1;
  out.push({sh:x.sh,n:x.starts[0],starts:x.starts,depth:x.depth,via:x.via,kinds});
  let ls=[];try{ls=linksOf(x.sh).filter(l=>l.from===x.sh&&l.fromNets.some(m=>dn.has(m)))}catch(e){}
  for(const l of ls){const k=l.to.name+'|'+l.toNets.join(',');const again=[...seen].some(z=>z.startsWith(l.to.name+'|'));if(again){out.push({sh:l.to,n:l.toNets[0],depth:x.depth+1,via:x.sh.name+' (circle '+l.num+')',again:true});continue}seen.add(k);q.push({sh:l.to,starts:l.toNets.slice(),depth:x.depth+1,via:x.sh.name+' (circle '+l.num+')'})}}
 return out}
function trMapUi(d,sh){const s=AN.sel;if(!s)return;const starts=s.net!=null?(s.nets&&s.nets.length?s.nets.slice():[s.net]):(s.blk?(s.blk.o||[]).slice():[]);if(!starts.length)return;
 const b=h$('button',{cls:'keep',txt:'Map: where does this signal go (all sheets)',title:'The whole cross-sheet downstream in one list; each sheet once'}),box=h$('div',{style:'margin:4px 0'});
 b.onclick=()=>{if(box.firstChild){box.innerHTML='';return}let R;try{R=trMap(sh,starts)}catch(e){box.append(h$('small',{txt:'map failed: '+e.message}));return}
  box.append(h$('small',{txt:R.filter(x=>!x.again).length+' sheet(s); a sheet is listed once even when the signals go round in a circle (↺). Click a line to go there.'}));
  for(const x of R){const S=x.sh.S||ensure(x.sh),name=nm(S,x.n),ad=adesFind(x.sh,name),ds=ad?adesText(ad.rec):'',ks=Object.entries(x.kinds||{}).map(([k,c])=>k+'×'+c).join(' ');
   const r=h$('div',{cls:'r tr',style:'padding-left:'+(6+x.depth*14)+'px'},[h$('span',{cls:'n',style:x.again?'color:#9aa':'',txt:(x.again?'↺ back to ':(x.depth?'▶ ':'● '))+x.sh.name+(x.again?' (already listed)':' · '+name+(ds?' · '+ds:'')+(ks?' → feeds '+ks:' → feeds nothing here'))+(x.via&&!x.again?'   [via '+x.via+']':'')})]);
   if(!x.again)r.onclick=()=>{x.sh===cs()?(AN.sel={net:x.n,nets:x.starts},selBox(),paint(),panelUpd(true)):trJump(x.sh,x.starts||x.n)};box.append(r)}};
 d.append(h$('div',{cls:'r'},[b]),box)}
`);
rep(String.raw`const ups=s.net!=null?[s.net]:s.blk.pins.filter(p=>p.role==='in').map(p=>p.n),dns=s.net!=null?[s.net]:s.blk.o.slice();`,String.raw`const ups=s.net!=null?(s.nets&&s.nets.length?s.nets.slice():[s.net]):s.blk.pins.filter(p=>p.role==='in').map(p=>p.n),dns=s.net!=null?(s.nets&&s.nets.length?s.nets.slice():[s.net]):s.blk.o.slice();`);
rep(String.raw`key=(s.net!=null?'n'+s.net:'b'+(s.blk&&s.blk.id))`,String.raw`key=(s.net!=null?'n'+s.net+(s.nets?'_'+s.nets.join('_'):''):'b'+(s.blk&&s.blk.id))`);
rep(String.raw`function selUpd_(d){selUpd0_(d);try{trList(d)}catch(e){}}`,String.raw`function selUpd_(d){selUpd0_(d);try{trList(d)}catch(e){}if(!AN.view&&AN.sel&&cs()&&cs().S){try{const sh=cs();d.append(h$('h4',{txt:'Signal path'}));trPathUi(d,sh);trExitsUi(d,sh);trMapUi(d,sh)}catch(e){}}try{trendUi(d)}catch(e){}}`);
/* hooks */
rep(String.raw`d.append(h$('h4',{txt:'Trace'}),h$('div',{cls:'r'},[lg]));`,String.raw`d.append(h$('h4',{txt:'Trace'}),h$('div',{cls:'r'},[lg]));try{trPathUi(d,sh);trExitsUi(d,sh);trMapUi(d,sh)}catch(e){}`);
rep(String.raw`panelUpd,selBox,dsIdx,dsOpen,trSeries,trSample,trDraw,trZoom,trModel});`,String.raw`panelUpd,selBox,dsIdx,dsOpen,trSeries,trSample,trDraw,trZoom,trModel,trMap,trGoCrumb});`);
};
