/* duplicate blocks (same kind, same box) = a shape drawn twice.  usage: node tools/dup-blocks.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let n=0;const by={};
for(const r of rows){const S=build(E,r);const seen=new Map();for(const b of S.blk){if(b.x0==null||['TXD','ACH','VLV'].includes(b.k))continue;const k=b.k+Math.round(b.x0)+','+Math.round(b.y0)+','+Math.round(b.x1)+','+Math.round(b.y1);if(seen.has(k)){n++;by[r.name+' '+b.k]=(by[r.name+' '+b.k]||0)+1}else seen.set(k,b.id)}}
console.log('duplicate blocks (same kind, same box):',n,JSON.stringify(by))
