/* Timers: the time / type read from the drawing against the user's MEMORY list (station TR table: "TR0112, TOFs, 2"). usage: node tools/audit-timers.js file.html */
const fs=require('fs'),zlib=require('zlib');const {load,build}=require('./lib.js');const {E,rows,html}=load(process.argv[2]);
const a=html.indexOf('<script type="text/plain" id="ades">'),b=html.indexOf('</script>',a);
const ades=JSON.parse(zlib.gunzipSync(Buffer.from(html.slice(a+'<script type="text/plain" id="ades">'.length,b).trim(),'base64')).toString('utf8'));
let tot=0,match=0,noTR=0,noMem=0;const bad=[],nomem=[];
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);let c={};for(const t of S.tx){const m=/^S(\d)-MDL/.exec(t.t.trim());if(m)c[m[1]]=(c[m[1]]||0)+1}if(!Object.keys(c).length)for(const t of S.tx){const m=/^S(\d)[- ]/.exec(t.t.trim());if(m)c[m[1]]=(c[m[1]]||0)+1}
 const stn=Object.keys(c).sort((x,y)=>c[y]-c[x])[0]||'1';
 for(const bl of S.blk){if(!['TON','TOF','TPS'].includes(bl.k))continue;tot++;
  const tr=S.tx.filter(t=>/^TR\d{2,4}$/.test(t.t.trim())&&Math.hypot(t.x-bl.cx,t.y-bl.cy)<28).sort((p,q)=>Math.hypot(p.x-bl.cx,p.y-bl.cy)-Math.hypot(q.x-bl.cx,q.y-bl.cy))[0];
  if(!tr){noTR++;continue}const key='TR'+tr.t.trim().slice(2).padStart(4,'0');
  const own=(S.tx.filter(t=>/^S(\d)\s/.test(t.t.trim())).length,stn);
  const e=(ades[stn]||{})[key];if(!e||e.v==null){noMem++;nomem.push(r.name+' '+key+' (station '+stn+') not in the memory list');continue}
  const kind=(e.t||'').replace(/s$/i,'').toUpperCase().replace('TP','TPS');const timeOk=Math.abs(e.v-bl.p.sec)<1e-6,typeOk=kind===bl.k;
  if(timeOk&&typeOk)match++;else bad.push(r.name+' '+key+' #'+bl.id+' drawing '+bl.k+' '+bl.p.sec+' s | memory list '+e.t+' '+e.v+' ('+e.d+')')}}
console.log('timers',tot,'| with a TRnnn label',tot-noTR,'| equal to the memory list (type and time)',match,'| DIFFERENT',bad.length,'| TR not in the memory list',noMem,'| no TR label',noTR);bad.forEach(x=>console.log('  DIFF '+x));if(process.argv.includes('--all'))nomem.forEach(x=>console.log('  '+x))
