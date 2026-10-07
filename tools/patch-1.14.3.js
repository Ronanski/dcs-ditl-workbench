/* v1.14.2 -> v1.14.3 (WIP, not released). Reader fixes from the logic verification. DITL page untouched.  usage: node tools/patch-1.14.3.js [out.html]  (reads logic-sim-v1.14.2.html, or archive/html/ once it was moved) */
const fs=require('fs');const src=fs.existsSync('logic-sim-v1.14.2.html')?'logic-sim-v1.14.2.html':'archive/html/logic-sim-v1.14.2.html';let h=fs.readFileSync(src,'utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.14.2</title>','<title>Logic Sim v1.14.3</title>');
/* 1. NOT whose OUT net is already driven by another block while its IN net has no other driver = the pins are swapped (flow right to left through a NOT with an elbow: ABC-055 M.0319 -> NOT -> AND, ABC-007 M.0188, ABC-020 M.017C): swap */
rep(` /* a net can never be both the in and the out of the same block: the in wins when an arrow is on it */`,` for(const b of blk)if(b.k==='NOT'&&b.pins.length===2){const o=b.pins.find(x=>x.role==='out'),i=b.pins.find(x=>x.role==='in');if(!o||!i)continue;const dr=n=>blk.some(q=>q!==b&&q.pins&&q.pins.some(x=>x.n===n&&x.role==='out'));if(dr(o.n)&&!dr(i.n)){o.role='in';i.role='out'}}
 /* a net can never be both the in and the out of the same block: the in wins when an arrow is on it */`);
/* 2. OR bar drawn as two overlapping pieces touching the same circle (ABC-009A M.0308, ABC-009B M.0328): two OR gates were made on one circle = two drivers on one net. Merge: one gate with the union of the bars */
rep(`if(side&&along>=a0-.5&&along<=a1+.5){S.gate.push({k:'OR'`,`if(side&&along>=a0-.5&&along<=a1+.5){const pg=c.used?S.gate.find(q=>q.k==='OR'&&q.body&&q.body.cx===c.x&&q.body.cy===c.y):null;if(pg){pg.a0=Math.min(pg.a0,a0);pg.a1=Math.max(pg.a1,a1);pg.used.push(b);b.use=2;break}S.gate.push({k:'OR'`);
/* 3. letter circles drawn bigger (r 8.0 - 8.2: ABC-001A / 001B / 001C, "C  UNIT LOAD DEMAND ( TO ABC-001A ) ( TO ABC-001C )") were skipped by the radius limits, so those signals were never connected */
rep(`for(const c of R.ci){if(c.r<2.2||c.r>8)continue;`,`for(const c of R.ci){if(c.r<2.2||c.r>8.3)continue;`);
rep(`else{if(c.r>6.5)continue;const t=TX.filter(`,`else{if(c.r>8.3)continue;const t=TX.filter(`);
/* 4. a wire that stops short of the circle because the arrow head fills the gap (ABC-001A "G" and "D" sinks: the wire ends 4 - 6 units from the circle, the arrow tip touches it): use the arrow tips too */
rep(`  const tags=TX.filter(q=>/^(S\\d\\s*)?[MB]`,`  for(const nt of nets)for(const a of nt.arrows){if(anD(a.x,a.y,c.x,c.y)<=c.r+1.2&&((c.x-a.x)*a.dx+(c.y-a.y)*a.dy)>0){nl.add(nt.id);sink=true}}
  const tags=TX.filter(q=>/^(S\\d\\s*)?[MB]`);
/* 5. the "M" circle of a motor-operated valve (ABC-054 / 055, r 7.6) is a motor symbol, not a signal connector: keep it out now that the radius limit is higher */
rep(`/^(\\d{1,2}|[A-Z]{1,3})$/.test(q.t.trim()))[0];if(!t)continue;`,`/^(\\d{1,2}|[A-Z]{1,3})$/.test(q.t.trim()))[0];if(!t||(c.r>6.5&&t.t.trim()==='M'))continue;`);
/* 6. ABC-015 / 016: the lower MAN boxes (and others) are drawn TWICE at the same place (two identical rectangles) = two MAN blocks writing the same nets: keep one */
rep(`function anModel(S){
 const nets=S.nets,TX=S.tx,blk=S.blk=[];let uid=0;`,`function anModel(S){
 S.shp=S.shp.filter((s,i,a)=>a.findIndex(t=>t.ty===s.ty&&Math.abs(t.x0-s.x0)<.05&&Math.abs(t.y0-s.y0)<.05&&Math.abs(t.x1-s.x1)<.05&&Math.abs(t.y1-s.y1)<.05)===i);
 const nets=S.nets,TX=S.tx,blk=S.blk=[];let uid=0;`);
/* 7. MAN: the PV wire runs under the box and shows a stub on its left edge: that touch is not an output. A MAN output pin on a net that another block (the transmitter, AI) already drives is dropped */
rep(` /* a net can never be both the in and the out of the same block: the in wins when an arrow is on it */`,` for(const b of blk)if(b.k==='MAN')b.pins=b.pins.filter(p=>!(p.role==='out'&&blk.some(q=>q!==b&&q.k!=='MAN'&&q.pins&&q.pins.some(x=>x.n===p.n&&x.role==='out'))));
 /* a net can never be both the in and the out of the same block: the in wins when an arrow is on it */`);
fs.writeFileSync(process.argv[2]||'logic-sim-v1.14.3.html',h);console.log('wip written',h.length);
