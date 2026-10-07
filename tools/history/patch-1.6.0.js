/* v1.5.0 -> v1.6.0 : settings really saved (IndexedDB + window.name fallbacks + storage test), paused on open, consistent bright wires, pill symbols, centred symbol text, COS lamp, SV preset note, same-colour arrowheads */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.5.0.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,90));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.5.0</title>','<title>DITL Logic Workbench v1.6.0</title>');
rep(`const AN_PV=7;`,`const AN_PV=8;`);
/* ===== storage: localStorage can be full / blocked (the DITL page keeps big data there). Same data also in IndexedDB and in window.name ===== */
rep(`const anSave=()=>{try{localStorage.setItem('ditl.an',JSON.stringify(AN.sv))}catch(e){if(!anSave.w){anSave.w=1;try{msg('The browser refuses to store data (blocked or full): inputs and FORCE will NOT be remembered after reload.')}catch(x){}}}};`,`const KV=(()=>{const open=()=>new Promise(res=>{try{const r=indexedDB.open('ditl-an',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>res(null);r.onblocked=()=>res(null)}catch(e){res(null)}}),p=open();
 return{get:k=>p.then(d=>new Promise(res=>{if(!d)return res(undefined);try{const q=d.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>res(undefined)}catch(e){res(undefined)}})),set:(k,v)=>p.then(d=>new Promise(res=>{if(!d)return res(false);try{const t=d.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=()=>res(true);t.onerror=()=>res(false);t.onabort=()=>res(false)}catch(e){res(false)}}))}})();
const WN={get(){try{if(String(window.name).startsWith('ditl-an:'))return JSON.parse(window.name.slice(8))}catch(e){}return{}},put(k,v){try{if(window.name&&!String(window.name).startsWith('ditl-an:'))return;const o=WN.get();o[k]=v;window.name='ditl-an:'+JSON.stringify(o)}catch(e){}}};
const anSave=()=>{const s=JSON.stringify(AN.sv);try{localStorage.setItem('ditl.an',s)}catch(e){if(!anSave.w){anSave.w=1;try{msg('Browser storage is full or blocked: using the backup storage (IndexedDB). See Legend & style > Saving.')}catch(x){}}}KV.set('sv',s);WN.put('sv',AN.sv)};
/* read back: IndexedDB first (never full), then localStorage (already read above), then window.name (survives F5) */
AN.kv=Promise.all([KV.get('sv'),KV.get('ws'),KV.get('cur')]).then(([a,b,c])=>{const w=WN.get();
 try{if(a){const o=JSON.parse(a);if(o&&typeof o==='object')AN.sv=o}else if(w.sv&&!Object.keys(AN.sv).length)AN.sv=w.sv}catch(e){}
 try{if(b)Object.assign(AN.ws,JSON.parse(b));else if(w.ws&&!localStorage.getItem('ditl.an.ws'))Object.assign(AN.ws,w.ws)}catch(e){}
 AN._cur=c||w.cur||null}).catch(()=>{});`);
rep(`const wsSave=()=>{try{localStorage.setItem('ditl.an.ws',JSON.stringify(AN.ws))}catch(e){}};`,`const wsSave=()=>{const s=JSON.stringify(AN.ws);try{localStorage.setItem('ditl.an.ws',s)}catch(e){}KV.set('ws',s);WN.put('ws',AN.ws)};
`);
rep(`function go(i){if(i<0||i>=AN.sheets.length)return;AN.i=i;AN.sel=null;AN.key=null;try{localStorage.setItem('ditl.an.cur',AN.sheets[i].name)}catch(e){}render()}`,`function go(i){if(i<0||i>=AN.sheets.length)return;AN.i=i;AN.sel=null;AN.key=null;try{localStorage.setItem('ditl.an.cur',AN.sheets[i].name)}catch(e){}KV.set('cur',AN.sheets[i].name);WN.put('cur',AN.sheets[i].name);render()}`);
rep(`let nm=null;try{nm=localStorage.getItem('ditl.an.cur')}catch(e){}`,`let nm=AN._cur||null;try{nm=nm||localStorage.getItem('ditl.an.cur')}catch(e){}`);
rep(`async function loadData(){if(AN.data)return AN.data;
 AN.data=(async()=>{`,`async function loadData(){if(AN.data)return AN.data;
 AN.data=(async()=>{try{await AN.kv}catch(e){}`);
rep(`AN.cat=c;try{localStorage.setItem('ditl.cat',c)}catch(e){}`,`AN.cat=c;try{localStorage.setItem('ditl.cat',c)}catch(e){}WN.put('cat',c);`);
rep(`(function(){let c=null;try{c=localStorage.getItem('ditl.cat')}catch(e){}`,`(function(){let c=null;try{c=localStorage.getItem('ditl.cat')}catch(e){}if(!c)c=WN.get().cat||null;`);
/* ===== always paused when the file is opened ===== */
rep(`AN.run=true;bRun.textContent='❚❚ Pause';bRun.classList.add('on');SIDEKEY=null;`,`AN.run=false;bRun.textContent='▶ Run';bRun.classList.remove('on');SIDEKEY=null;`);
/* ===== wires: same thickness ON and OFF (only the colour changes), brighter ON, darker OFF; the raw CAD line under a wire is not drawn (its colour showed through) ===== */
rep(`if(isD){c=n.dig?(on?DCc:'#4a5660'):ANC;w=n.dig?.35*dW:(tube?.7:.5)*aW;o=.4}else if(n.dig){if(on){c=DCc;w=(dTube?.7:.5)*dW}else{c='#4a5660';w=(dTube?.6:.35)*dW}}else{c=ANC;w=(tube?.7:.5)*aW}`,`const wd_=(dTube?.95:.8)*dW,wa_=(tube?.95:.8)*aW;if(isD){c=n.dig?(on?DCc:'#3b4651'):ANC;w=n.dig?wd_:wa_;o=.4}else if(n.dig){c=on?DCc:'#3b4651';w=wd_}else{c=ANC;w=wa_}`);
rep(`R.seg.forEach(s=>pth(aci(s.c),\`M\${s.x1} \${-s.y1}L\${s.x2} \${-s.y2}\`));`,`const covered=new Set(),kk=(a,b,c,d)=>[a,b,c,d].map(v=>Math.round(v*20)).join(',');for(const s of [].concat(S.seg,S.gl||[],S.edge||[],(S.gate||[]).flatMap(g=>g.used||[]))){covered.add(kk(s.x1,s.y1,s.x2,s.y2));covered.add(kk(s.x2,s.y2,s.x1,s.y1))}
 R.seg.forEach(s=>{if(!covered.has(kk(s.x1,s.y1,s.x2,s.y2)))pth(aci(s.c),\`M\${s.x1} \${-s.y1}L\${s.x2} \${-s.y2}\`)});`);
rep(`bx=a.x-a.dx*2.2,by=a.y-a.dy*2.2,px=-a.dy*.8,py=a.dx*.8`,`bx=a.x-a.dx*2.8,by=a.y-a.dy*2.8,px=-a.dy*1.05,py=a.dx*1.05`);
/* ===== pill symbols (instrument bubbles): the two long lines were wires, the two arcs were symbol = outline in two colours. Now one symbol ===== */
rep(` /* digital gate bodies on CON: bar + (square | circle) */`,` /* pill (rounded box): two facing arcs + two horizontal lines joining their ends = one symbol, the lines are not wires */
 S.pills=[];
 {const ep=a=>{const t=v=>v*Math.PI/180;return[[a.x+a.r*Math.cos(t(a.a0)),a.y+a.r*Math.sin(t(a.a0))],[a.x+a.r*Math.cos(t(a.a1)),a.y+a.r*Math.sin(t(a.a1))]]},nr=(p,q)=>anD(p[0],p[1],q[0],q[1])<.8,AR=R.ar.filter(a=>a.r>=2&&a.r<=20),used=new Set();
  for(const L of AR){if(used.has(L))continue;for(const Q of AR){if(Q===L||used.has(Q)||Math.abs(L.y-Q.y)>.3||Math.abs(L.r-Q.r)>.3||Q.x<=L.x+2)continue;
   const el=ep(L),er=ep(Q),lt=el[0][1]>el[1][1]?el[0]:el[1],lb=el[0][1]>el[1][1]?el[1]:el[0],rt=er[0][1]>er[1][1]?er[0]:er[1],rb=er[0][1]>er[1][1]?er[1]:er[0];
   const find=(p,q)=>SG.find(s=>!s.use&&isH(s)&&((nr([s.x1,s.y1],p)&&nr([s.x2,s.y2],q))||(nr([s.x2,s.y2],p)&&nr([s.x1,s.y1],q))));
   const top=find(lt,rt),bot=find(lb,rb);if(top&&bot){top.use=1;bot.use=1;used.add(L);used.add(Q);S.pills.push({x0:L.x-L.r,x1:Q.x+Q.r,y0:Math.min(lb[1],rb[1]),y1:Math.max(lt[1],rt[1])});break}}}}
 /* digital gate bodies on CON: bar + (square | circle) */`);
rep(` /* NOT / AND / OR gates found earlier */`,` for(const p of S.pills||[])blk.push({id:uid++,k:'TXD',fixed:1,x0:p.x0,y0:p.y0,x1:p.x1,y1:p.y1,cx:(p.x0+p.x1)/2,cy:(p.y0+p.y1)/2,txt:[],p:{},pins:[]});
 /* NOT / AND / OR gates found earlier */`);
rep(`const AN_KC={`,`const AN_KC={TXD:'#e8c9a0',`);
rep(`const inBlk=t=>S.blk.some(b=>b.k!=='CONST'&&b.k!=='AI'&&`,`const inBlk=t=>S.blk.some(b=>b.k!=='CONST'&&b.k!=='AI'&&b.k!=='TXD'&&`);
/* ===== text inside a symbol is centred in it (T, COS, A, H/, ...) ===== */
rep(`const TXE=new Map(),gt=el('g',{},svg);R.tx.forEach(t=>{const e=el('text',{x:t.x,y:-t.y,`,`const CEN=new Set(['SW','AMT','COS','CONST','HC','LC','HLC','CMPK','MUL','DIV','ABS','SQRT','FX','LAG','HS','LS','HLIM','LLIM','TP','PO','IP','CTK','ADD','SUB','DEV','SUM']),tIn=new Map();for(const t of R.tx){const b=blkAt(t.x,t.y,0);if(b&&CEN.has(b.k)){(tIn.get(b)||tIn.set(b,[]).get(b)).push(t)}}
 const tcen=t=>{if(t.r)return null;const b=blkAt(t.x,t.y,0);if(!b||!CEN.has(b.k))return null;const a=tIn.get(b);return a&&a.length===1&&t.t.trim().length<=8?b:null};
 const TXE=new Map(),gt=el('g',{},svg);R.tx.forEach(t=>{const cb=tcen(t),e=el('text',{x:cb?cb.cx:t.x,y:-(cb?cb.cy:t.y),`);
rep(`fill:tcol(t),'text-anchor':(t.a===1||t.a===4)?'middle':t.a===2?'end':'start','dominant-baseline':t.a===4?'central':`,`fill:tcol(t),'text-anchor':cb?'middle':(t.a===1||t.a===4)?'middle':t.a===2?'end':'start','dominant-baseline':cb?'central':t.a===4?'central':`);
/* ===== COS lamp: lit when the operator (manual) is in control of its T, dark when SV / remote / auto ===== */
rep(`if(cs){cs.used=1;b.b=cs.vnet;`,`if(cs){cs.used=1;cs.tb=b.id;b.b=cs.vnet;`);
rep(`   else if(['TON','TOF','TPS','TPV'].includes(b.k)){const w=`,`   else if(b.k==='COS'&&b.used&&b.sh&&b.sh.p){const e=el('path',{d:mkp(b.sh.p),fill:'none','stroke-width':.9,'stroke-linejoin':'round','pointer-events':'none'},gp),t=el('text',{},gb);L.ov.push({b,k:'COS',e,t,last:null})}
   else if(['TON','TOF','TPS','TPV'].includes(b.k)){const w=`);
rep(`  else if(o.k==='TMR'){`,`  else if(o.k==='COS'){const tq=S.rt.st[b.tb],lit=!!(tq&&tq.pk==='B');key=lit?'1':'0';txt='';fill=lit?'#ff7ad9':'#0b1013';op=lit?.45:1;if(o.last!==key)o.e.setAttribute('stroke',lit?'#ff7ad9':'#3b4651')}
  else if(o.k==='TMR'){`);
/* ===== "IF M.0704 = 1 / SET SV = 109 kg/cm2": while the condition is 1 the A line of the SV selector carries that value ===== */
rep(`  S._tr={};for(const b of blk){`,`  S.pre={};for(const t of TX){const m=/^SET\\s+SV\\s*=\\s*(-?\\d+(?:\\.\\d+)?)\\s*(.*)$/i.exec(t.t.trim());if(!m)continue;
   const cq=TX.find(q=>/^IF\\s+(?:S\\d\\s+)?[A-Za-z]\\.[0-9A-F]{3,5}[A-Z]?\\s*=\\s*1$/.test(q.t.trim())&&Math.abs(q.x-t.x)<8&&q.y>=t.y-.5&&q.y-t.y<14);if(!cq)continue;const tag=/([A-Za-z]\\.[0-9A-F]{3,5}[A-Z]?)/.exec(cq.t)[1],cn=S.lab.findIndex(l=>l&&l.t===tag);if(cn<0)continue;
   let tb=null,td=40;for(const b of blk)if((b.k==='AMT'||b.k==='SW')&&b.a>=0&&TX.some(q=>/^SV$/i.test(q.t.trim())&&Math.hypot(q.x-b.cx,q.y-b.cy)<30)){const d=Math.hypot(b.cx-t.x,b.cy-t.y);if(d<td*50){td=d/50;tb=tb&&Math.hypot(tb.cx-t.x,tb.cy-t.y)<d?tb:b}}
   if(tb){S.pre[tb.a]={c:cn,val:+m[1],tag}}}
  S._tr={};for(const b of blk){`);
rep(`v[n]=rt.acc[n]}else v[n]=x}};`,`v[n]=rt.acc[n]}else v[n]=x;const pr=S.pre&&S.pre[n];if(pr&&v[pr.c]>.5)v[n]=pr.val}};`);
rep(` const rd=n=>n>=0?v[n]:0;`,` for(const k in S.pre||{}){const pr=S.pre[k];if(S.ext.includes(+k)&&v[pr.c]>.5&&F[+k]===undefined)v[+k]=pr.val}
 const rd=n=>n>=0?v[n]:0;`);
/* ===== storage test in the style card ===== */
rep(`h$('div',{cls:'it',style:'color:#7d8e9a',txt:'Click a wire to change the look of that one wire only.'}))}`,`h$('div',{cls:'it',style:'color:#7d8e9a',txt:'Click a wire to change the look of that one wire only.'}));
 {const out=h$('div',{style:'margin-top:4px;line-height:1.5'}),test=()=>{out.textContent='Testing…';let ls='✖ blocked',used=0;try{localStorage.setItem('ditl.an.probe','1');if(localStorage.getItem('ditl.an.probe')==='1')ls='✔ ok';localStorage.removeItem('ditl.an.probe')}catch(e){}try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);used+=k.length+(localStorage.getItem(k)||'').length}}catch(e){}
   const mb=(used/1048576).toFixed(1);KV.set('probe',Date.now()).then(ok=>KV.get('probe').then(v=>{out.textContent='Browser storage: '+ls+' ('+mb+' MB used of about 5)  ·  Backup storage (IndexedDB): '+(ok&&v?'✔ ok':'✖ blocked')+'  ·  Tab memory: '+(window.name&&String(window.name).startsWith('ditl-an:')?'✔ ok':'—')+(ls.startsWith('✖')||used>4400000?'   → Your settings are kept in the backup storage.':'')}))};
  const bt=h$('button',{txt:'Test saving',onclick:test}),sv_=h$('button',{txt:'Save settings file',onclick:()=>{const a=h$('a',{href:URL.createObjectURL(new Blob([JSON.stringify({sv:AN.sv,ws:AN.ws,cur:AN.sheets[AN.i]&&AN.sheets[AN.i].name},null,1)],{type:'application/json'})),download:'ditl-analog-settings.json'});a.click()}}),fi=h$('input',{type:'file',accept:'.json',style:'display:none'});
  fi.onchange=async()=>{try{const o=JSON.parse(await fi.files[0].text());if(o.sv)AN.sv=o.sv;if(o.ws)Object.assign(AN.ws,o.ws);anSave();wsSave();location.reload()}catch(e){msg('Cannot read that file')}};
  const ld=h$('button',{txt:'Load settings file',onclick:()=>fi.click()});d.append(h$('b',{txt:'Saving'}),out,h$('div',{cls:'it'},[bt,sv_,ld,fi]));test()}}`);
/* faint wires: only the DATA path (analog) is dimmed when nobody follows it; select / control signals and other digital wires stay bright. A digital wire is dimmed only when it is itself the T input that is not selected. */
rep(`   for(const b of C){if((b.k==='SW'||b.k==='AMT')&&b.a>=0&&b.b>=0&&b.a!==b.b&&n===uns(b)&&n!==b.sel)continue;if(b.o&&b.o.length&&b.o.every(o=>dead.has(o)))continue;live=true;break}
   if(!live){dead.add(n);ch=1}}if(!ch)break}
 return dead}`,`   for(const b of C){if((b.k==='SW'||b.k==='AMT')&&b.a>=0&&b.b>=0&&b.a!==b.b&&n===uns(b)&&n!==b.sel)continue;if((b.k==='SW'||b.k==='AMT')&&(n===b.sel||(b.cs||[]).some(c=>c.n===n))){live=true;break}if(b.o&&b.o.length&&b.o.every(o=>dead.has(o)))continue;live=true;break}
   if(!live){dead.add(n);ch=1}}if(!ch)break}
 const direct=new Set();for(const b of S.blk)if((b.k==='SW'||b.k==='AMT')&&b.a>=0&&b.b>=0&&b.a!==b.b){const u=uns(b);if(u!==b.sel&&dead.has(u))direct.add(u)}
 dead.direct=direct;return dead}`);
rep(`const isD=dead.has(n.id),on=`,`const isD=n.dig?dead.direct&&dead.direct.has(n.id):dead.has(n.id),on=`);
fs.writeFileSync('ditl-workbench-v1.6.0.html',h);console.log('written',h.length);
