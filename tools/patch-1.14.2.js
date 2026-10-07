/* v1.14.1 -> v1.14.2 (WIP, not released). Reader fixes from the logic scan A. DITL page untouched.  usage: node tools/patch-1.14.2.js [out.html]  (default: wip file in the cwd) */
const fs=require('fs');let h=fs.readFileSync('logic-sim-v1.14.1.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.14.1</title>','<title>Logic Sim v1.14.2</title>');
/* 1. NOT (⊠) on a wire that is part of a multi-branch net: the net-wide "has an arrow" test picked the wrong pin (ABC-004A/B/C: ⊠ on the 1:BYPASS wire became a second driver of M.0146). Use the arrows on the pin's own straight wire, beyond the box: pointing away = OUT, pointing at the box = IN */
rep(`if(ha!==hb)first=ha?q:p;/* the wire`,`const loc=pp=>{let s=0;for(const ar of nets[pp.n].arrows){const vx=hz?Math.sign(pp.x-b.cx):0,vy=hz?0:Math.sign(pp.y-b.cy);if(hz?Math.abs(ar.y-pp.y)>1.5:Math.abs(ar.x-pp.x)>1.5)continue;if((ar.x-b.cx)*vx+(ar.y-b.cy)*vy<=0)continue;s+=(ar.dx*vx+ar.dy*vy)>0?1:-1}return s},lp=loc(p),lq=loc(q);if(lp!==lq)first=lp>lq?q:p;/* no local arrow: left to right / top to bottom (the old net-wide arrow test picked the wrong pin on ABC-055 #29, ABC-003E TR256) */ /* the wire`);
/* 2. AND with a tall body (4 inputs, ABC-003E #45 chain: bar + box 15 high): the closing line was limited to < 8; it must only match the distance between the two box sides */
rep(`&&len(s)<8&&len(s)>3);
   if(cl){S.gate.push({k:'AND'`,`&&len(s)>3&&Math.abs(len(s)-(v?Math.abs(t.y1-u.y1):Math.abs(t.x1-u.x1)))<1.2);
   if(cl){S.gate.push({k:'AND'`);
/* 3. AND whose body is ONE closed rectangle (polyline, no separate side lines) touching the bar (ABC-003E: 4 inputs M.3412 / 3413 / 3418 / 3419 -> M.0090 "ALL BURNER IN SERVICE") */
rep(`[b,t,u,cl].forEach(s=>s.use=2)}}}
 /* NOT: square with X`,`[b,t,u,cl].forEach(s=>s.use=2)}}
  else{const rc=(S.shp||[]).find(sh=>sh.ty==='rect'&&!sh.taken&&sh.w>3&&sh.w<8.5&&sh.h>3&&!R.tx.some(t=>t.x>=sh.x0&&t.x<=sh.x1&&t.y>=sh.y0&&t.y<=sh.y1)&&(v?(Math.abs(sh.x0-bp)<.6||Math.abs(sh.x1-bp)<.6)&&sh.y0>=a0-.6&&sh.y1<=a1+.6:(Math.abs(sh.y0-bp)<.6||Math.abs(sh.y1-bp)<.6)&&sh.x0>=a0-.6&&sh.x1<=a1+.6));
   if(rc){const sd=v?(rc.cx>bp?1:-1):(rc.cy>bp?1:-1);const far=v?(sd>0?rc.x1:rc.x0):(sd>0?rc.y1:rc.y0);const mid=v?(rc.y0+rc.y1)/2:(rc.x0+rc.x1)/2;rc.taken=1;
    S.gate.push({k:'AND',v,bar:b,bp,a0,a1,side:sd,out:v?{x:far,y:mid}:{x:mid,y:far},body:{x0:Math.min(bp,far),x1:Math.max(bp,far),y0:v?rc.y0:Math.min(bp,far),y1:v?rc.y1:Math.max(bp,far)},used:[b]});b.use=2}}}
 /* NOT: square with X`);
/* 4. DCMP outputs whose wire makes an elbow (ABC-001D #19: ">= 2 MW" / "< 0.3 MW" are written over the far end of the wire, at the FF, not at the box): look for the test text near the arrow end of the output wire too */
rep(`for(const p of outs2)for(const q of tl){const dx=p.x-q.x,dy=q.y-p.y;if(dy>-8&&dy<9&&dx>-14&&dx<60)pr.push({p,q,d:Math.abs(dy)+Math.abs(dx)*.2})}`,`for(const p of outs2)for(const q of tl){const dx=p.x-q.x,dy=q.y-p.y;if(dy>-8&&dy<9&&dx>-14&&dx<60)pr.push({p,q,d:Math.abs(dy)+Math.abs(dx)*.2});for(const ar of nets[p.n].arrows){const ex=ar.x-q.x,ey=q.y-ar.y;if(ey>-1&&ey<9&&ex>-14&&ex<10)pr.push({p,q,d:Math.abs(ey)+Math.abs(ex)*.2+3})}}`);
fs.writeFileSync(process.argv[2]||'wip-1.14.2.html',h);console.log('wip written',h.length);
