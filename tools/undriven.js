/* nets that feed something but nothing drives them and the user cannot set them (not in ext): they stay 0 forever. usage: node tools/undriven.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let tot=0;const by={};
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);const ext=new Set(S.ext),lk=new Set();for(const[d] of S.link||[])lk.add(d);
 for(const n of S.nets){if(!n.segs.length)continue;const id=n.id;if((S.drv[id]||[]).length||ext.has(id)||lk.has(id))continue;if(!(S.cns[id]||[]).length)continue;tot++;(by[r.name]=by[r.name]||[]).push((S.lab[id]?S.lab[id].t:'net'+id)+'('+(n.dig?'D':'A')+')->'+S.cns[id].map(b=>b.k+'#'+b.id).join('/'))}}
console.log('undriven, un-settable nets that feed logic:',tot);for(const s in by)console.log(s,by[s].join('   '));
