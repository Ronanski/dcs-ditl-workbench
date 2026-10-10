/* v1.20.9 -> v1.20.11 (work in progress, NOT released: the user's batch-1 inspection of 2026-10-10).
   usage: node tools/patch-1.20.11.js   (reads archive/html/logic-sim-v1.20.9.html or the root file, writes logic-sim-v1.20.11.html) */
const fs=require('fs');const src=fs.existsSync('logic-sim-v1.20.9.html')?'logic-sim-v1.20.9.html':'archive/html/logic-sim-v1.20.9.html';let h=fs.readFileSync(src,'utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,110));h=h.split(a).join(b)};
const repAll=(a,b,n)=>{const c=h.split(a).length-1;if(c!==n)throw new Error(c+' x (expected '+n+') '+a.slice(0,110));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.20.9</title>','<title>Logic Sim v1.20.11</title>');
require('./patch-1.20.11-fx.js')(rep,repAll);
require('./patch-1.20.11-dup.js')(rep,repAll);
require('./patch-1.20.11-minair.js')(rep,repAll);
require('./patch-1.20.11-xref.js')(rep,repAll);
require('./patch-1.20.11-cos.js')(rep,repAll);
require('./patch-1.20.11-ab.js')(rep,repAll);
require('./patch-1.20.11-vcol.js')(rep,repAll);
require('./patch-1.20.11-audit.js')(rep,repAll);
require('./patch-1.20.11-mode.js')(rep,repAll);
require('./patch-1.20.11-search.js')(rep,repAll);
require('./patch-1.20.11-pane2.js')(rep,repAll);
require('./patch-1.20.11-vplace.js')(rep,repAll);
fs.writeFileSync('logic-sim-v1.20.11.html',h);console.log('written logic-sim-v1.20.11.html',h.length);
