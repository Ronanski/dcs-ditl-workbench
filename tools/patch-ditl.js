/* v1.15.3 WIP: DITL signals. The ABC sheets say "( FROM DITL pp-nn )" next to the signals that come from the DITL page and "TO DITL pp-nn" next to the ones that go to it.
   The DITL page is NOT touched and NOT simulated here (user, 2026-10-08): the signals that come FROM the DITL are inputs of the ABC set that you switch with ONE click (RUN or Pause);
   everything that the ABC logic computes stays under the control of the ABC logic. Panel button "DITL signals": every FROM DITL input (sheet, DITL reference, wire name + description, live value, one-click control)
   and every TO DITL output (live value). The Trace panel also tells where a wire comes from the DITL (◀ from DITL pp-nn) or leaves to it (→ to DITL pp-nn). */
module.exports=(rep)=>{
/* index of the DITL texts of a sheet: nets near a "FROM / TO DITL pp-nn" text (distance to the wire, 20 units) */
rep(String.raw`function whyTxt(S,b){`,String.raw`const DS_RX=/(FROM|TO)\s+DITL\s*([0-9]{2}[A-Z]?)\s*-\s*(\d+)/gi;
function dsIdx(sh){if(sh._ds)return sh._ds;const S=ensure(sh),from=new Map(),to=new Map(),lost=[];
 for(const t of S.tx){if(!/DITL/i.test(t.t))continue;const isFrom=/FROM/i.test(t.t);DS_RX.lastIndex=0;const refs=[];let m;while(m=DS_RX.exec(t.t))refs.push('DITL '+m[2]+'-'+m[3]);if(!refs.length)refs.push(t.t.replace(/[()]/g,'').trim());
  const near=[];for(const nn of S.nets){if(!nn.segs.length)continue;let d=1e9;for(const i of nn.segs)d=Math.min(d,anPtSeg(t.x,t.y,S.seg[i]));if(d<=20)near.push({id:nn.id,d})}near.sort((p,q)=>p.d-q.d);
  const pick=isFrom?(near.find(q=>S.ext.includes(q.id))||near[0]):(near.find(q=>!S.ext.includes(q.id)&&S.drv[q.id]&&S.drv[q.id].some(d=>d.k!=='LINK'))||near[0]);
  if(!pick){lost.push({t:t.t,x:Math.round(t.x),y:Math.round(t.y)});continue}
  const M=isFrom?from:to;const o=M.get(pick.id)||[];for(const r of refs)if(!o.includes(r))o.push(r);M.set(pick.id,o)}
 return sh._ds={from,to,lost}}
function whyTxt(S,b){`);
/* button */
rep(String.raw`bIm=h$('button',{txt:'Imports'`,String.raw`bDs=h$('button',{txt:'DITL signals',title:'Signals that come FROM the DITL page (one-click inputs) and go TO it (live values)'}),bIm=h$('button',{txt:'Imports'`);
rep(String.raw`bAs,bIm,bPn,`,String.raw`bAs,bIm,bDs,bPn,`);
/* panel */
rep(String.raw`bIm.onclick=()=>`,String.raw`let dsT=null;
function dsOpen(){anln.hidden=false;anln.style.display='block';anln.innerHTML='';const cell=(t,w)=>h$('td',{style:'padding:2px 6px;border-bottom:1px solid var(--line,#334);vertical-align:middle;'+(w||''),txt:String(t==null?'':t)}),live=[];let nF=0,nT=0,nL=0;const lostAll=[];
 anln.append(h$('b',{txt:'Signals from / to the DITL page'+(AN.dsAll?' — all sheets':' — '+(cs()?cs().name:''))}),h$('button',{txt:'✕',style:'float:right',onclick:()=>{anln.style.display='none';anln.hidden=true;clearInterval(dsT)}}),h$('button',{txt:AN.dsAll?'This sheet only':'All sheets',style:'float:right;margin-right:6px',title:'The list shows the signals of the sheet that is open; this switches to every sheet',onclick:()=>{AN.dsAll=!AN.dsAll;dsOpen()}}),
  h$('div',{style:'margin:6px 0;color:var(--dim)',txt:'The DITL page is not simulated here. A signal that comes FROM the DITL is an input of the ABC set: click it to switch it (works in RUN and in Pause; all linked sheets run together). Anything the ABC logic computes is NOT in this list: it stays controlled by the logic (use FORCE on the wire if you must). TO DITL = the value the ABC logic sends to the DITL (read-only). Click a sheet name to open it.'}));
 AN._dsSh=cs();for(const sh of(AN.dsAll?AN.sheets:[cs()])){if(!sh||/ABC-000/.test(sh.name))continue;let ix,S;try{S=ensure(sh);ix=dsIdx(sh)}catch(e){continue}if(!ix.from.size&&!ix.to.size&&!ix.lost.length){anln.append(h$('div',{style:'margin:6px 0',txt:sh.name+': no signal from / to the DITL on this sheet.'}));continue}
  const t=h$('table',{style:'border-collapse:collapse;font-size:11px;margin:2px 0 10px;width:100%'});t.append(h$('tr',{},['','DITL ref','Wire · description','Value','Control'].map(x=>h$('th',{style:'text-align:left;padding:2px 6px',txt:x}))));
  const addRow=(dir,n,refs)=>{const name=nm(S,n),ad=adesFind(sh,name),ds=ad?adesText(ad.rec):'',dig=S.nets[n].dig,vc=h$('td',{style:'padding:2px 6px;border-bottom:1px solid var(--line,#334);min-width:46px'});
   const upd=()=>{const x=S.rt.v[n];vc.textContent=dig?(x>.5?'1':'0'):fmt(x);vc.style.color=dig&&x>.5?'#6f6':''};upd();live.push(upd);let ctlEl;
   if(dir==='FROM'&&S.ext.includes(n)&&!(S.xlk&&S.xlk[n])){if(dig){const b=h$('button',{});const u=()=>{const o=S.rt.ext[n]>.5;b.textContent=o?'1 · ON':'0 · OFF';b.classList.toggle('on',o)};u();live.push(u);b.onclick=()=>{setExt(sh,n,S.rt.ext[n]>.5?0:1);u();upd()};ctlEl=b}
    else{const i=h$('input',{type:'number',step:'any',style:'width:72px'});i.value=S.rt.ext[n]||0;i.onchange=()=>{const v=parseFloat(i.value);if(isFinite(v))setExt(sh,n,v)};ctlEl=i}}
   else ctlEl=h$('small',{txt:dir==='FROM'?'comes from another sheet (logic)':'output of the ABC logic'});
   const r=h$('tr',{},[cell(dir==='FROM'?'◀ FROM':'→ TO'),cell(refs.join(', ')),cell(name+(ds?' · '+ds:'')),vc,h$('td',{style:'padding:2px 6px;border-bottom:1px solid var(--line,#334)'},[ctlEl])]);t.append(r);dir==='FROM'?nF++:nT++};
  for(const[n,refs]of ix.from)addRow('FROM',n,refs);for(const[n,refs]of ix.to)addRow('TO',n,refs);
  for(const l of ix.lost){nL++;lostAll.push(sh.name+': '+l.t+' @'+l.x+','+l.y)}
  anln.append(h$('a',{href:'#',style:'color:inherit;font-weight:bold',txt:sh.name+' · '+(sh.title||''),onclick:ev=>{ev.preventDefault();AN.go(AN.sheets.indexOf(sh))}}),t)}
 anln.insertBefore(h$('div',{style:'margin:4px 0',txt:'FROM DITL inputs: '+nF+' · TO DITL outputs: '+nT+' · texts that could not be tied to a wire: '+nL+(nL?' ('+lostAll.slice(0,8).join(' | ')+(lostAll.length>8?' …':'')+')':'')}),anln.children[2]);
 clearInterval(dsT);dsT=setInterval(()=>{if(anln.style.display!=='block'||!/Signals from/.test(anln.textContent.slice(0,40))){clearInterval(dsT);return}if(!AN.dsAll&&AN._dsSh!==cs()){dsOpen();return}if(document.activeElement&&document.activeElement.tagName==='INPUT')return;live.forEach(f=>{try{f()}catch(e){}})},500)}
bDs.onclick=()=>{if(anln.style.display==='block'&&anln.firstChild&&/Signals from/.test(anln.firstChild.textContent)){anln.style.display='none';anln.hidden=true;clearInterval(dsT)}else dsOpen()};
bIm.onclick=()=>`);
rep(String.raw`Object.assign(AN,{go,cs,paint,fitView,settle,setCat,reset,ensure,pick,linksOf,actSet,panelUpd,selBox});`,String.raw`Object.assign(AN,{go,cs,paint,fitView,settle,setCat,reset,ensure,pick,linksOf,actSet,panelUpd,selBox,dsIdx,dsOpen});`);
};
