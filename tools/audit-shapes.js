/* shapes of the drawing (boxes, triangles) that did not become any block: possible unrecognised symbols.  usage: node tools/audit-shapes.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let n=0;const out=[];
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 for(const sh of S.shp||[]){if(sh.w<5||sh.h<5||sh.w>46||sh.h>46)continue;
  const cx=(sh.x0+sh.x1)/2,cy=(sh.y0+sh.y1)/2;
  const inBlk=S.blk.some(b=>b.x0!=null&&cx>=b.x0-1&&cx<=b.x1+1&&cy>=b.y0-1&&cy<=b.y1+1);if(inBlk)continue;
  const ins=S.tx.filter(t=>t.x>=sh.x0&&t.x<=sh.x1&&t.y>=sh.y0&&t.y<=sh.y1).map(t=>t.t.trim());
  n++;out.push(r.name+' '+sh.ty+' '+sh.w.toFixed(0)+'x'+sh.h.toFixed(0)+' @'+Math.round(cx)+','+Math.round(cy)+' text: '+JSON.stringify(ins).slice(0,60))}}
console.log('shapes that are not a block:',n);out.forEach(x=>console.log(x));
