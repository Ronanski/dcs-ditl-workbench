/* v1.6.0 -> v1.6.1 : 4th save layer (the address bar, survives F5 with every browser storage blocked) + one timestamped bundle in all layers + "last load came from" diagnostic */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.6.0.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,90));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,90));h=h.split(a).join(b)};
const cut=(from,to,b)=>{const i=h.indexOf(from);if(i<0)throw new Error('cut from NOT FOUND: '+from.slice(0,70));const j=h.indexOf(to,i);if(j<0)throw new Error('cut to NOT FOUND: '+to.slice(0,70));h=h.slice(0,i)+b+h.slice(j+to.length)};
rep('<title>DITL Logic Workbench v1.6.0</title>','<title>DITL Logic Workbench v1.6.1</title>');
/* bundle + hash layer */
rep(`const anSave=()=>{const s=JSON.stringify(AN.sv);`,`let _ht=null;const HB=()=>{try{const m=/[#&]a=([^&]+)/.exec(location.hash);if(m)return JSON.parse(decodeURIComponent(escape(atob(m[1]))))}catch(e){}return null};
const BOOT={};try{BOOT.ls=JSON.parse(localStorage.getItem('ditl.an.bundle'))}catch(e){}BOOT.wn=WN.get().bundle;BOOT.hb=HB();/* what the page was opened with, read BEFORE anything is written */
function persistAll(){if(!AN._ready){AN._pend=1;return}const o={sv:AN.sv,ws:AN.ws,cur:(AN.sheets[AN.i]||{}).name||AN._cur||null,cat:AN.cat,ts:Date.now()},s=JSON.stringify(o);
 try{localStorage.setItem('ditl.an.bundle',s)}catch(e){}KV.set('bundle',s);WN.put('bundle',o);
 clearTimeout(_ht);_ht=setTimeout(()=>{try{if(s.length<150000)history.replaceState(null,'',location.pathname+location.search+'#a='+btoa(unescape(encodeURIComponent(s))))}catch(e){}},250)}
const anSave=()=>{const s=JSON.stringify(AN.sv);`);
rep(`KV.set('sv',s);WN.put('sv',AN.sv)};`,`KV.set('sv',s);WN.put('sv',AN.sv);persistAll()};`);
rep(`KV.set('ws',s);WN.put('ws',AN.ws)};`,`KV.set('ws',s);WN.put('ws',AN.ws);persistAll()};`);
cut(`AN.kv=Promise.all([KV.get('sv'),KV.get('ws'),KV.get('cur')])`,`AN._cur=c||w.cur||null}).catch(()=>{});`,`AN.kv=Promise.all([KV.get('sv'),KV.get('ws'),KV.get('cur'),KV.get('bundle')]).then(([a,b,c,bd])=>{const w=WN.get();AN._src='nothing found (defaults)';
 const cand=[];const add=(name,o)=>{if(o&&typeof o==='object'&&o.ts)cand.push([name,o])};
 add('browser storage',BOOT.ls);try{if(bd)add('backup storage (IndexedDB)',JSON.parse(bd))}catch(e){}add('tab memory',BOOT.wn);add('address bar',BOOT.hb);
 cand.sort((x,y)=>y[1].ts-x[1].ts);
 if(cand.length){const[nm,o]=cand[0];AN._src=nm;if(o.sv&&typeof o.sv==='object')AN.sv=o.sv;if(o.ws)Object.assign(AN.ws,o.ws);AN._cur=o.cur||null;if(o.cat)AN._cat=o.cat}
 else{
  try{if(a){const o=JSON.parse(a);if(o&&typeof o==='object'){AN.sv=o;AN._src='backup storage (older)'}}else if(w.sv&&!Object.keys(AN.sv).length)AN.sv=w.sv}catch(e){}
  try{if(b)Object.assign(AN.ws,JSON.parse(b));else if(w.ws&&!localStorage.getItem('ditl.an.ws'))Object.assign(AN.ws,w.ws)}catch(e){}
  AN._cur=c||w.cur||null;if(Object.keys(AN.sv).length)AN._src=AN._src.startsWith('nothing')?'browser storage (older)':AN._src}AN._ready=1;if(AN._pend)persistAll()}).catch(()=>{AN._ready=1});`);
rep(`WN.put('cur',AN.sheets[i].name);render()}`,`WN.put('cur',AN.sheets[i].name);persistAll();render()}`);
rep(`WN.put('cat',c);`,`WN.put('cat',c);persistAll();`);
rep(`if(!c)c=WN.get().cat||null;`,`if(!c)c=WN.get().cat||null;if(!c){const hb=HB();c=hb&&hb.cat||null}`);
/* diagnostic text */
rep(`out.textContent='Browser storage: '+ls+' ('+mb+' MB used of about 5)  ·  Backup storage (IndexedDB): '+(ok&&v?'✔ ok':'✖ blocked')+'  ·  Tab memory: '+(window.name&&String(window.name).startsWith('ditl-an:')?'✔ ok':'—')+(ls.startsWith('✖')||used>4400000?'   → Your settings are kept in the backup storage.':'')`,`let url='✖',tab=(!window.name||String(window.name).startsWith('ditl-an:'))?'✔ ok':'✖ in use by another program';try{history.replaceState(null,'',location.href);url='✔ ok'}catch(e){}
   out.textContent='Last time the settings were loaded from: '+(AN._src||'?')+'.   Saving to: browser storage '+ls+' ('+mb+' MB used of about 5) · backup storage (IndexedDB) '+(ok&&v?'✔ ok':'✖ blocked')+' · tab memory '+tab+' · address bar '+url`);
fs.writeFileSync('ditl-workbench-v1.6.1.html',h);console.log('written',h.length);
