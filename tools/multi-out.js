/* blocks that have more than one OUT pin where only one is expected (T switches), or no IN pin: probable pin-role mistakes. usage: node tools/multi-out.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);const by={};let tot=0;
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 for(const b of S.blk){if(!['SW','AMT'].includes(b.k))continue;const outs=b.pins.filter(p=>p.role==='out');if(outs.length>1){const dead=outs.filter(p=>!(S.cns[p.n]||[]).length&&!(S.drv[p.n]||[]).filter(d=>d!==b).length);tot++;(by[r.name]=by[r.name]||[]).push('#'+b.id+' '+b.k+' pins['+b.pins.map(p=>p.role+(p.lab?':'+p.lab:'')).join(',')+']'+(dead.length?' DANGLING OUT '+dead.map(p=>p.n).join('/'):''))}}}
console.log('T blocks with >1 OUT pin:',tot);for(const s in by)console.log(s,by[s].join('  '));
