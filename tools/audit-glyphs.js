/* Same-looking symbols must be the same block kind: group every box by its GLYPH (shape type, size class, number of diagonal / horizontal / vertical lines inside, text inside) and list the groups that were read as more than one kind, and the kinds of each group (the legend of ABC-000 is the reference).  usage: node tools/audit-glyphs.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);const G=new Map();
for(const r of rows){const S=build(E,r);const sheet=r.name;
 /* glyph lines inside each shape: same rule as the reader (segments that are part of the glyph) */
 for(const b of S.blk){if(!b.sh||!b.sh.ty)continue;const sh=b.sh;const gl=(S.gl||[]).filter(s=>s.x1>=sh.x0-.3&&s.x2>=sh.x0-.3&&s.x1<=sh.x1+.3&&s.x2<=sh.x1+.3&&s.y1>=sh.y0-.3&&s.y2>=sh.y0-.3&&s.y1<=sh.y1+.3&&s.y2<=sh.y1+.3);
  const isH=s=>Math.abs(s.y1-s.y2)<.06,isV=s=>Math.abs(s.x1-s.x2)<.06;const d=gl.filter(s=>!isH(s)&&!isV(s)).length,h=gl.filter(isH).length,v=gl.filter(isV).length;
  const txt=(b.txt||[]).map(t=>t.trim()).filter(t=>t&&!/^[A-Z]{2,5}\d|^S\d-|^[A-Z]+-[A-Z]+\d/.test(t)).slice(0,2).join('|');
  const key=sh.ty+' '+Math.round(sh.w/3)*3+'x'+Math.round(sh.h/3)*3+' d'+d+' h'+h+' v'+v+(txt?' "'+txt+'"':'');
  if(!G.has(key))G.set(key,{kinds:{},ex:[]});const g=G.get(key);g.kinds[b.k]=(g.kinds[b.k]||0)+1;if(g.ex.length<20)g.ex.push(sheet+'#'+b.id+'='+b.k)}}
let multi=0;const out=[];for(const [k,g] of G){const ks=Object.keys(g.kinds);if(ks.length>1){multi++;out.push('MIXED  '+k+' -> '+JSON.stringify(g.kinds)+'  e.g. '+g.ex.filter((e,i,a)=>a.findIndex(z=>z.split('=')[1]===e.split('=')[1])===i).join(', '))}}
console.log('glyph groups',G.size,'| read as more than one kind:',multi);out.sort().forEach(x=>console.log(x));
