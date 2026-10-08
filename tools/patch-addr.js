/* v1.20.1: EVERY address text has its value beside it - analog AND digital (user 2026-10-08: "dapat address at wires, hindi wires lang", "analog man o digital").
   v1.20.0 audit (tools/audit-addr-values.js): 2316 address / tag texts on the 51 sheets, only 876 had a value beside them (277 analog and 1163 digital did not: the digital wires were only coloured, and a net with several texts got ONE badge).
   Now: for every text that names a wire (S.lab, S.tagN) a badge (1 / 0 for digital, number for analog) is placed at the end of THAT text unless a value of the same wire is already beside it. The badge belongs to the address: it is not a "bare wire value" (toggle Wire values does not hide it). */
module.exports=(rep)=>{
rep(String.raw` svg.append(g0,go_,gleg,gd,gfg,gf,gp,gt,gcj,L.selg,gb);
 const av=AN.av[sh.name];`,String.raw` {const done=new Set(),bx=q=>+q.t.getAttribute('x'),by=q=>-+q.t.getAttribute('y'),has=(n,x,y)=>L.bd.some(q=>q.n===n&&!q.wire&&!q.skip&&Math.hypot(bx(q)-x,by(q)-y)<45),put=(n,t,x,y,h)=>{if(n==null||!S.nets[n]||!S.nets[n].segs.length)return;const k=n+'|'+t+'|'+Math.round(x)+'|'+Math.round(y);if(done.has(k))return;done.add(k);const ex=x+String(t).trim().length*(h||3)*.62+1.5;if(has(n,ex,y))return;
   const e=el('text',{x:ex,y:-(y+bs*.2),class:'bd'+(S.nets[n].dig?' dg':''),'text-anchor':'start'},gb);e.dataset.n=n;L.bd.push({n,t:e,last:null,skip:false,wire:false,addr:true})};
  S.lab.forEach((l,n)=>{if(l&&l.t)put(n,l.t,l.x,l.y,l.h)});(S.tagN||[]).forEach(q=>{const tx=S.tx.find(z=>z.t===q.t);if(tx)put(q.n,q.t,tx.x,tx.y,tx.h)})}
 svg.append(g0,go_,gleg,gd,gfg,gf,gp,gt,gcj,L.selg,gb);
 const av=AN.av[sh.name];`);
};
