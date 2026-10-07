/* SUM / SUB / ADD / DEV inputs: the "+" / "-" written beside each input pin of the drawing against the sign the simulator uses. Every sign text within 24 units of the block (outside the box) is matched to the nearest input pin (one text per pin); a pin with no text uses the simulator's default (SUB / DEV: first pin +, the others -).  usage: node tools/audit-signs.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let tot=0,pinsAll=0,pinsText=0;const A=[];
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 for(const b of S.blk){if(!b.ip||!['SUM','SUB','ADD','DEV'].includes(b.k))continue;tot++;
  const txt=S.tx.filter(t=>/^[+\-−]$/.test(t.t.trim())&&Math.hypot(t.x-b.cx,t.y-b.cy)<24&&!(t.x>=b.x0&&t.x<=b.x1&&t.y>=b.y0&&t.y<=b.y1));
  const pairs=[];for(const q of b.ip){const p=b.pins.find(x=>x.n===q.n&&x.role==='in');if(!p)continue;for(const t of txt)pairs.push({q,t,d:Math.hypot(t.x-p.x,t.y-p.y)})}
  pairs.sort((u,v)=>u.d-v.d);const uq=new Set(),ut=new Set(),asg=new Map();for(const e of pairs){if(uq.has(e.q)||ut.has(e.t))continue;uq.add(e.q);ut.add(e.t);asg.set(e.q,e.t)}
  const info=[];let flag=false;for(const q of b.ip){pinsAll++;const t=asg.get(q);const w=t?(/^\+$/.test(t.t.trim())?1:-1):0;if(t)pinsText++;info.push('net'+q.n+' drawing "'+(t?t.t.trim():'none')+'" sim '+(q.sg>0?'+':'-'));if(w&&w!==q.sg)flag=true}
  if(flag)A.push(r.name+' '+b.k+'#'+b.id+' @'+Math.round(b.cx)+','+Math.round(b.cy)+' | '+info.join(' ; '))}}
console.log('sign blocks',tot,'| input pins',pinsAll,'| pins with a sign text:',pinsText,'| blocks where the sim sign differs from the drawing:',A.length);A.forEach(x=>console.log(x));
