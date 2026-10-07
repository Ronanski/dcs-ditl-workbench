/* block kinds per sheet as JSON, to compare two builds (a reader change shows as a change of the counts).  usage: node tools/count-blocks.js file.html > a.json ; node tools/count-blocks.js other.html > b.json ; diff a.json b.json */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);const o={};
for(const r of rows){const S=build(E,r),c={};S.blk.forEach(b=>{c[b.k]=(c[b.k]||0)+1});o[r.name]=Object.fromEntries(Object.entries(c).sort());o[r.name]._nets=S.nets.length}
console.log(JSON.stringify(o,null,1))
