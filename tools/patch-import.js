/* v1.15.2 WIP, P7: the DXF the user imports is KEPT in this browser (IndexedDB, same store as the settings) and re-applied at every start;
   every import gets a DRAWING-CHANGE REPORT (what is different from the built-in sheet). Called by tools/patch-1.15.1.js after patch-selector.js.
   Panel: button "Imports" (list, report per sheet, "back to built-in"). DITL page untouched. */
module.exports=(rep)=>{
/* 1. load: after the built-in sheets are read, re-apply the stored imports */
rep(String.raw`const keep=AN.sheets.filter(s=>s.imp);AN.sheets=rows.concat(keep);return AN.sheets})();return AN.data}`,
String.raw`const keep=AN.sheets.filter(s=>s.imp);AN.sheets=rows.concat(keep);try{await impRestore()}catch(x){AN.impErr=String(x&&x.message||x)}return AN.sheets})();return AN.data}
/* ---- P7: persistent DXF import + drawing-change report ---- */
const impBuild=(R,name)=>anWire(anModel(anNets(anBuild(R,name))));
function impSnap(R,name){const S=impBuild(R,name),kinds={},blk=[],tx=[];
 for(const b of S.blk){kinds[b.k]=(kinds[b.k]||0)+1;blk.push({s:b.k,x:b.cx,y:b.cy})}
 for(const q of R.tx)tx.push({s:q.t,x:q.x,y:q.y});
 return{kinds,blk,tx,nets:S.nets.length,blocks:S.blk.length,conn:S.conn.length,circles:R.ci.length,segs:R.seg.length,texts:R.tx.length,warn:S.warn.length}}
/* items of P that have no partner in Q: same text / kind and a position within tol units (1:1 matching, nearest first) */
function impMiss(P,Q,tol){const g={};for(const q of Q)(g[q.s]=g[q.s]||[]).push({q,u:0});const out=[];
 for(const p of P){const c=g[p.s]||[];let bi=-1,bd=tol;c.forEach((e,i)=>{if(e.u)return;const d=Math.hypot(e.q.x-p.x,e.q.y-p.y);if(d<=bd){bd=d;bi=i}});if(bi>=0)c[bi].u=1;else out.push(p.s+'@'+Math.round(p.x)+','+Math.round(p.y))}
 return out}
function impDiff(oldR,newR,name){const A=impSnap(oldR,name),B=impSnap(newR,name),rows=[],add=(what,a,b)=>rows.push({what,a,b,d:b-a});
 for(const k of ['blocks','nets','conn','segs','circles','texts','warn'])add(k==='conn'?'connector circles':k==='warn'?'reader warnings':k,A[k],B[k]);
 const kinds=[...new Set(Object.keys(A.kinds).concat(Object.keys(B.kinds)))].sort().map(k=>({k,a:A.kinds[k]||0,b:B.kinds[k]||0})).filter(x=>x.a!==x.b);
 const bgone=impMiss(A.blk,B.blk,3),bnew=impMiss(B.blk,A.blk,3),tgone=impMiss(A.tx,B.tx,1.5),tnew=impMiss(B.tx,A.tx,1.5);
 return{name,rows,kinds,bgone,bnew,tgone,tnew,same:!rows.some(r=>r.d)&&!kinds.length&&!bgone.length&&!bnew.length&&!tgone.length&&!tnew.length,ts:Date.now()}}
function impApply(name,txt,fname,ts,fresh){const R=anRead(txt);const old=AN.sheets.findIndex(s=>s.name===name),base=old>=0?(AN.sheets[old].imp?AN.sheets[old].orig:AN.sheets[old]):null;
 const o={name,no:'',title:'(imported from '+fname+', kept in this browser)',fam:base?base.fam:'IMPORTED',R,imp:1,orig:base,impTs:ts,impFile:fname};
 if(base){o.no=base.no;o.title='(imported from '+fname+', kept in this browser) '+base.title;try{o.rep=impDiff(base.R,R,name)}catch(x){o.rep={name,err:String(x&&x.message||x)}}}
 if(old>=0)AN.sheets[old]=o;else AN.sheets.push(o);
 if(fresh&&AN.sv&&AN.sv[name]){delete AN.sv[name];try{anSave()}catch(x){}}/* saved values use net numbers of the OLD drawing */
 return o}
async function impRestore(){const list=await KV.get('imp:list');if(!Array.isArray(list))return;const done=[];
 for(const name of list){const r=await KV.get('imp:'+name);if(!r||!r.txt)continue;try{impApply(name,r.txt,r.fname||name+'.dxf',r.ts||0,false);done.push(name)}catch(x){AN.impErr=(AN.impErr||'')+name+': '+x.message+' '}}
 AN.impRestored=done}
async function impSave(name,txt,fname){const list=(await KV.get('imp:list'))||[];if(!list.includes(name))list.push(name);const a=await KV.set('imp:'+name,{txt,fname,ts:Date.now()}),b=await KV.set('imp:list',list);return a&&b}
async function impDrop(name){const list=((await KV.get('imp:list'))||[]).filter(n=>n!==name);await KV.set('imp:'+name,null);await KV.set('imp:list',list);
 const i=AN.sheets.findIndex(s=>s.name===name&&s.imp);if(i>=0){const o=AN.sheets[i];if(o.orig)AN.sheets[i]=o.orig;else AN.sheets.splice(i,1);if(AN.i>=AN.sheets.length)AN.i=0}
 if(AN.sv&&AN.sv[name]){delete AN.sv[name];try{anSave()}catch(x){}}AN.tagIdx=null;AN.sheets.forEach(s=>{delete s.lk;if(s.S)s.S.xlk=null});AN.key=null;AN.lkey=null;render()}`);
/* 2. import: store + report */
rep(String.raw`   const old=AN.sheets.findIndex(s=>s.name===name);const o={name,no:'',title:'(imported, this session only)',fam:old>=0?AN.sheets[old].fam:'IMPORTED',R,imp:1};if(old>=0){o.no=AN.sheets[old].no;o.title=AN.sheets[old].title;AN.sheets[old]=o}else AN.sheets.push(o);ok++;AN.lkey=null;if(fs.length===1)AN.i=AN.sheets.indexOf(o)}catch(x){msg('Cannot read '+f.name+': '+x.message)}}
 if(ok){AN.tagIdx=null;AN.sheets.forEach(s=>{delete s.lk;if(s.S)s.S.xlk=null});msg(ok+' analog sheet(s) imported (kept until you reload the page).');AN.key=null;render()}};`,
String.raw`   const o=impApply(name,txt,f.name,Date.now(),true);const kept=await impSave(name,txt,f.name);o.kept=kept;ok++;if(!kept)nokeep++;AN.lkey=null;if(fs.length===1)AN.i=AN.sheets.indexOf(o)}catch(x){msg('Cannot read '+f.name+': '+x.message)}}
 if(ok){AN.tagIdx=null;AN.sheets.forEach(s=>{delete s.lk;if(s.S)s.S.xlk=null});msg(ok+' analog sheet(s) imported'+(nokeep?' ('+nokeep+' could NOT be stored: gone after reload)':' and kept in this browser; press Imports for the drawing-change report')+'.');AN.key=null;render();impOpen()}};`);
rep(String.raw`fImp.onchange=async e=>{const fs=[...e.target.files];e.target.value='';let ok=0;`,String.raw`fImp.onchange=async e=>{const fs=[...e.target.files];e.target.value='';let ok=0,nokeep=0;`);
/* 3. panel */
rep(String.raw`bAs=h$('button',{txt:'Assumed values'`,String.raw`bIm=h$('button',{txt:'Imports',title:'DXF files you imported (kept in this browser) and what is different from the built-in drawing'}),bAs=h$('button',{txt:'Assumed values'`);
rep(String.raw`bHp,bLn,bAs,bPn,`,String.raw`bHp,bLn,bAs,bIm,bPn,`);
rep(String.raw`bAs.onclick=()=>`,String.raw`function impOpen(){anln.hidden=false;anln.style.display='block';anln.innerHTML='';const imps=AN.sheets.filter(s=>s.imp),cell=(t,w)=>h$('td',{style:'padding:2px 6px;border-bottom:1px solid var(--line,#334);'+(w||''),txt:String(t==null?'-':t)}),
  tab=(head,rows)=>{const t=h$('table',{style:'border-collapse:collapse;font-size:11px;margin:4px 0 10px'});t.append(h$('tr',{},head.map(x=>h$('th',{style:'text-align:left;padding:2px 6px',txt:x}))));rows.forEach(r=>t.append(h$('tr',{},r.map(c=>cell(c)))));return t};
 anln.append(h$('b',{txt:'Imported DXF drawings (Imports)'}),h$('button',{txt:'✕',style:'float:right',onclick:()=>{anln.style.display='none';anln.hidden=true}}),
  h$('div',{style:'margin:6px 0;color:var(--dim)',txt:'A DXF you import is stored in this browser and used again at every start. Remove it to go back to the built-in drawing. The report compares the imported file with the built-in sheet. Saved values of that sheet are cleared at import (the numbers of the nets can change).'}));
 if(!imps.length)anln.append(h$('div',{txt:'No imported drawing. Use "Import ABC DXF".'}));
 for(const s of imps){const r=s.rep;anln.append(h$('b',{txt:s.name+' — '+s.impFile+' — '+(s.impTs?new Date(s.impTs).toLocaleString():'')+(s.kept===false?' — NOT STORED':'')}),h$('button',{txt:'Back to built-in',style:'margin-left:8px',onclick:()=>{impDrop(s.name).then(()=>impOpen())}}));
  if(!r){anln.append(h$('div',{txt:'New sheet (no built-in drawing with this name): nothing to compare.'}));continue}
  if(r.err){anln.append(h$('div',{txt:'Report failed: '+r.err}));continue}
  anln.append(h$('div',{style:'margin:4px 0;font-weight:bold',txt:r.same?'IDENTICAL to the built-in drawing (same blocks, texts, nets).':'DIFFERENT from the built-in drawing:'}));
  anln.append(tab(['Item','Built-in','Imported','Change'],r.rows.map(x=>[x.what,x.a,x.b,(x.d>0?'+':'')+x.d])));
  if(r.kinds.length)anln.append(h$('b',{txt:'Block kinds that changed'}),tab(['Kind','Built-in','Imported'],r.kinds.map(x=>[x.k,x.a,x.b])));
  const lst=(t,a)=>{if(a.length)anln.append(h$('div',{style:'margin:2px 0',txt:t+' ('+a.length+'): '+a.slice(0,40).join('  |  ')+(a.length>40?'  … +'+(a.length-40):'')}))};
  lst('Blocks only in the built-in (kind@x,y)',r.bgone);lst('Blocks only in the imported',r.bnew);lst('Texts only in the built-in',r.tgone);lst('Texts only in the imported',r.tnew)}}
bIm.onclick=()=>{if(anln.style.display==='block'&&anln.firstChild&&/Imported DXF/.test(anln.firstChild.textContent)){anln.style.display='none';anln.hidden=true}else impOpen()};
bAs.onclick=()=>`);
};
