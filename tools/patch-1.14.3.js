/* v1.14.2 -> v1.14.3 (WIP, not released). Reader fixes from the logic verification. DITL page untouched.  usage: node tools/patch-1.14.3.js [out.html]  (reads logic-sim-v1.14.2.html, or archive/html/ once it was moved) */
const fs=require('fs');const src=fs.existsSync('logic-sim-v1.14.2.html')?'logic-sim-v1.14.2.html':'archive/html/logic-sim-v1.14.2.html';let h=fs.readFileSync(src,'utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.14.2</title>','<title>Logic Sim v1.14.3</title>');
/* 1. NOT whose OUT net is already driven by another block while its IN net has no other driver = the pins are swapped (flow right to left through a NOT with an elbow: ABC-055 M.0319 -> NOT -> AND, ABC-007 M.0188, ABC-020 M.017C): swap */
rep(` /* a net can never be both the in and the out of the same block: the in wins when an arrow is on it */`,` for(const b of blk)if(b.k==='NOT'&&b.pins.length===2){const o=b.pins.find(x=>x.role==='out'),i=b.pins.find(x=>x.role==='in');if(!o||!i)continue;const dr=n=>blk.some(q=>q!==b&&q.pins&&q.pins.some(x=>x.n===n&&x.role==='out'));if(dr(o.n)&&!dr(i.n)){o.role='in';i.role='out'}}
 /* a net can never be both the in and the out of the same block: the in wins when an arrow is on it */`);
/* 2. OR bar drawn as two overlapping pieces touching the same circle (ABC-009A M.0308, ABC-009B M.0328): two OR gates were made on one circle = two drivers on one net. Merge: one gate with the union of the bars */
rep(`if(side&&along>=a0-.5&&along<=a1+.5){S.gate.push({k:'OR'`,`if(side&&along>=a0-.5&&along<=a1+.5){const pg=c.used?S.gate.find(q=>q.k==='OR'&&q.body&&q.body.cx===c.x&&q.body.cy===c.y):null;if(pg){pg.a0=Math.min(pg.a0,a0);pg.a1=Math.max(pg.a1,a1);pg.used.push(b);b.use=2;break}S.gate.push({k:'OR'`);
fs.writeFileSync(process.argv[2]||'logic-sim-v1.14.3.html',h);console.log('wip written',h.length);
