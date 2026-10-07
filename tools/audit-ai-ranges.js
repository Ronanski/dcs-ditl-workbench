/* AI ranges written on the drawings against the user's IO list (LMYP-1 #1_IO_Rev.1.xls: Base Scale / Full Scale per AI address and station; compact copy in tools/data/io-scales.json). usage: node tools/audit-ai-ranges.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);const io=require(process.argv[3]||'./data/io-scales.json');
let n=0,ok=0,bad=[],none=[];
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);const c={};for(const t of S.tx){const m=/^S(\d)-MDL/.exec(t.t.trim());if(m)c[m[1]]=(c[m[1]]||0)+1}const stn=Object.keys(c).sort((x,y)=>c[y]-c[x])[0]||'1';
 for(const b of S.blk){if(b.k!=='AI'||!b.rng)continue;const o=b.pins.find(p=>p.role==='out');const lab=o&&S.lab[o.n]?S.lab[o.n].t:'';const m=/^(?:S(\d)\s*)?(AI\d{4})$/.exec(lab);if(!m)continue;n++;const st=m[1]||stn;const e=(io[st]||{})[m[2]];
  if(!e){none.push(r.name+' '+lab+' (station '+st+')');continue}
  const lo=parseFloat(e.lo),hi=parseFloat(e.hi);const same=Math.abs(lo-b.rng.lo)<1e-6&&Math.abs(hi-b.rng.hi)<1e-6;if(same)ok++;else bad.push(r.name+' '+lab+' drawing '+b.rng.lo+'~'+b.rng.hi+' '+b.rng.u+' | IO list '+e.lo+'~'+e.hi+' '+e.u+' ('+e.tag+' '+e.d+')')}}
console.log('AI blocks with a tag',n,'| range equal to the IO list',ok,'| DIFFERENT',bad.length,'| not found in the IO list',none.length);bad.forEach(x=>console.log('  DIFF '+x));none.slice(0,15).forEach(x=>console.log('  none '+x))
