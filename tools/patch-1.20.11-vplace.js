/* LIVE VALUE PLACEMENT (user rules of LOGICSIM_EU_REPORT_FINDINGS, priority of 2026-10-10):
   - a number must NOT cover any text, block, wire / net, symbol line, or another number;
   - at the SIDE of its anchor it is level with it (vertically centred), ABOVE / BELOW it is horizontally centred.
   One pass after all the badges exist: every badge is re-placed from its anchor (the address text, the circle tag, or the point on the wire),
   candidates in order of preference, the first free one wins; real text boxes (getBBox) are the obstacles, not estimates. */
module.exports=(rep,repAll)=>{
/* remember the anchors */
rep(`L.bd.push({n,t,last:null,skip:sk,wire:!S.lab[n]})};`,`L.bd.push({n,t,last:null,skip:sk,wire:!S.lab[n],pin:[ax,ay]})};`);
rep(`L.bd.push({n,t,last:null,skip:false,wire:false,circ:true})}`,`L.bd.push({n,t,last:null,skip:false,wire:false,circ:true,anc:tt})}`);
rep(`function drawSheet(sh){`,`function vplace(R,S,L,bs){
 const rot=(r,t)=>{const A=-t.r*Math.PI/180,cx=t.x,cy=-t.y,pts=[[r[0],r[1]],[r[2],r[1]],[r[2],r[3]],[r[0],r[3]]].map(([x,y])=>[cx+(x-cx)*Math.cos(A)-(y-cy)*Math.sin(A),cy+(x-cx)*Math.sin(A)+(y-cy)*Math.cos(A)]);return[Math.min(...pts.map(p=>p[0])),Math.min(...pts.map(p=>p[1])),Math.max(...pts.map(p=>p[0])),Math.max(...pts.map(p=>p[1]))]};
 const TX=[];(L.txe||new Map()).forEach((e,t)=>{let b;try{b=e.getBBox()}catch(x){b=null}if(!b||(!b.width&&!b.height)){const w=t.t.length*t.h*.6,hh=t.h;b={x:t.x,y:-(t.y+hh),width:w,height:hh*1.1}}let r=[b.x,b.y,b.x+b.width,b.y+b.height];if(t.r&&Math.abs(Math.sin(t.r*Math.PI/180))>.2)r=rot(r,t);const sh=(r[3]-r[1])*.18;TX.push({r:[r[0]+.1,r[1]+sh,r[2]-.1,r[3]-sh],t:t.t.trim(),x:t.x,y:-t.y,full:r})});
 const BLK=S.blk.map(b=>[b.x0-.3,-b.y1-.3,b.x1+.3,-b.y0+.3]);
 const SG=[];for(const s of[].concat(R.seg,S.seg,S.gl||[],S.edge||[]))SG.push([s.x1,-s.y1,s.x2,-s.y2]);
 const SH=[];for(const c of R.ci||[])SH.push([c.x-c.r,-c.y-c.r,c.x+c.r,-c.y+c.r]);for(const p of R.pl||[]){const xs=p.p.map(q=>q[0]),ys=p.p.map(q=>-q[1]);SH.push([Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)])}
 const W=6*bs*.62,H=bs*.95,GAP=[.9,1.7,2.8,4.2,6,8.5,12];
 const ov=(a,c)=>{const w=Math.min(a[2],c[2])-Math.max(a[0],c[0]),h=Math.min(a[3],c[3])-Math.max(a[1],c[1]);return w>.05&&h>.05?w*h:0};
 const lb=(x1,y1,x2,y2,r)=>{let t0=0,t1=1;const dx=x2-x1,dy=y2-y1;for(const[p,q]of[[-dx,x1-r[0]],[dx,r[2]-x1],[-dy,y1-r[1]],[dy,r[3]-y1]]){if(Math.abs(p)<1e-9){if(q<0)return false}else{const t=q/p;if(p<0){if(t>t1)return false;if(t>t0)t0=t}else{if(t<t0)return false;if(t<t1)t1=t}}}return true};
 const PB=[];const near=(A,r,m)=>A.filter(q=>q[2]>r[0]-m&&q[0]<r[2]+m&&q[3]>r[1]-m&&q[1]<r[3]+m);
 const score=(r,own)=>{let s=0;const ex=[r[0]-.45,r[1]-.45,r[2]+.45,r[3]+.45];for(const t of TX)if(t!==own)s+=ov(r,t.r)*40;for(const q of BLK)s+=ov(r,q)*30;for(const q of PB)s+=ov(r,q)*60;for(const q of SH)s+=ov(r,q)*20;let n=0;for(const q of SG){if(q[0]>ex[2]&&q[2]>ex[2])continue;if(q[0]<ex[0]&&q[2]<ex[0])continue;if(q[1]>ex[3]&&q[3]>ex[3])continue;if(q[1]<ex[1]&&q[3]<ex[1])continue;if(lb(q[0],q[1],q[2],q[3],ex))n++}return s+n*12};
 const put=(b,r,al,ax,ay)=>{PB.push(r);const t=b.t;if(al==='r'){t.setAttribute('x',r[0]);t.setAttribute('text-anchor','start')}else if(al==='l'){t.setAttribute('x',r[2]);t.setAttribute('text-anchor','end')}else{t.setAttribute('x',(r[0]+r[2])/2);t.setAttribute('text-anchor','middle')}t.setAttribute('y',(r[1]+r[3])/2);t.setAttribute('dominant-baseline','central');t.dataset.al=al;t.dataset.ax=ax;t.dataset.ay=ay;b.al=al};
 /* a box anchor (the text of an address / tag): right, below, above, left; level / centred */
 const around=(b,T,own)=>{let best=null;const cx=(T[0]+T[2])/2,cy=(T[1]+T[3])/2;for(const g of GAP)for(const[al,r,ax,ay]of[['r',[T[2]+g,cy-H/2,T[2]+g+W,cy+H/2],T[2],cy],['b',[cx-W/2,T[3]+g*.6,cx+W/2,T[3]+g*.6+H],cx,T[3]],['t',[cx-W/2,T[1]-g*.6-H,cx+W/2,T[1]-g*.6],cx,T[1]],['l',[T[0]-g-W,cy-H/2,T[0]-g,cy+H/2],T[0],cy]]){const s=score(r,own)+g*.3+(al==='r'?0:al==='b'?.4:al==='t'?.8:1.2);if(!best||s<best.s)best={s,r,al,ax,ay};if(best.s<.9)break}if(best){put(b,best.r,best.al,best.ax,best.ay);b.t.dataset.at=own?own.t:''}};
 /* a point on a wire: along the wire, beside a vertical piece (level), above / below a horizontal one (centred) */
 const alongNet=(b)=>{const n=b.n,segs=(S.nets[n].segs||[]).map(i=>S.seg[i]).filter(Boolean);if(!segs.length){if(b.pin)around(b,[b.pin[0]-.3,-b.pin[1]-.3,b.pin[0]+.3,-b.pin[1]+.3],null);return}const pin=b.pin||[segs[0].x1,segs[0].y1],px=pin[0],py=-pin[1];let best=null;
  for(const s of segs){const x1=s.x1,y1=-s.y1,x2=s.x2,y2=-s.y2,L_=Math.hypot(x2-x1,y2-y1);const hz=Math.abs(y1-y2)<=Math.abs(x1-x2);const ts=[];for(let d=1.5;d<L_-.8;d+=1.8)ts.push(d/L_);ts.push(.5);
   /* beyond each end of the piece (a short stub has no room beside it): level with a horizontal end, centred under / over a vertical end */
   for(const[ex,ey,sx,sy]of[[x1,y1,Math.sign(x1-x2),Math.sign(y1-y2)],[x2,y2,Math.sign(x2-x1),Math.sign(y2-y1)]])for(const g of[.9,1.7,3,4.6,6.6,9,12]){let c;if(hz)c=sx>=0?[['r',[ex+g,ey-H/2,ex+g+W,ey+H/2]]]:[['l',[ex-g-W,ey-H/2,ex-g,ey+H/2]]];else c=sy>=0?[['b',[ex-W/2,ey+g,ex+W/2,ey+g+H]]]:[['t',[ex-W/2,ey-g-H,ex+W/2,ey-g]]];for(const[al,r]of c){const s_=score(r)+Math.hypot(ex-px,ey-py)*.35+g*.3+.5;if(!best||s_<best.s)best={s:s_,r,al,ax:ex,ay:ey}}}
   for(const t of ts){const qx=x1+(x2-x1)*t,qy=y1+(y2-y1)*t,dist=Math.hypot(qx-px,qy-py);for(const g of[.9,1.7,3,4.6,6.6,9,12]){const c=hz?[['b',[qx-W/2,qy+g,qx+W/2,qy+g+H],qx,qy],['t',[qx-W/2,qy-g-H,qx+W/2,qy-g],qx,qy]]:[['r',[qx+g,qy-H/2,qx+g+W,qy+H/2],qx,qy],['l',[qx-g-W,qy-H/2,qx-g,qy+H/2],qx,qy]];for(const[al,r,ax,ay]of c){const s=score(r)+dist*.35+g*.3;if(!best||s<best.s)best={s,r,al,ax,ay}}}}}
  if(!best&&b.pin)around(b,[px-.3,py-.3,px+.3,py+.3],null);if(best){put(b,best.r,best.al,best.ax,best.ay);b.vs=best.s;(L.vbad=L.vbad||[]).push&&best.s>=1&&L.vbad.push({n:b.n,s:+best.s.toFixed(1),pin:b.pin,segs:segs.length})}};
 const rp=new Map();for(const q of L.addrRep||[])rp.set(q.b,q);
 const boxOf=(txt,x,y)=>{let bst=null,bd=1e9;for(const t of TX){if(t.t!==txt)continue;const d=Math.hypot(t.x-x,t.y-y);if(d<bd){bd=d;bst=t}}return bst};
 const A=[],C=[],Wb=[],K=[];for(const b of L.bd){if(!b.t||!b.t.isConnected)continue;if(b.addr&&rp.has(b))A.push(b);else if(b.circ)C.push(b);else if(b.skip)K.push(b);else Wb.push(b)}
 for(const b of A){const q=rp.get(b),T=boxOf(String(q.t).trim(),q.x,-q.y);if(T)around(b,T.full,T);else if(b.pin)alongNet(b)}
 for(const b of C){const T=b.anc&&boxOf(String(b.anc.t).trim(),b.anc.x,-b.anc.y);if(T)around(b,T.full,T)}
 for(const b of Wb)alongNet(b);for(const b of K)alongNet(b)}
function drawSheet(sh){`);
rep(`svg.append(g0,go_,gleg,gd,gfg,gf,gp,gt,gcj,L.selg,gb,gx);`,`/* rules 7 / 8: an analog wire that has no number yet (driven by a bare connector / junction, so no block output pin gave it one) gets one */
 for(let n=0;n<S.nets.length;n++){const nt=S.nets[n];if(!nt||nt.dig||!nt.segs||!nt.segs.length||placed.has(n))continue;const D=S.drv[n]||[],C=S.cns[n]||[];if(!D.length&&!C.length)continue;if((L.addrN&&L.addrN.has(n))||skipB(n))continue;const s0=S.seg[nt.segs[0]];if(!s0)continue;placed.add(n);const t=el('text',{x:s0.x1,y:-s0.y1,class:'bd'},gb);t.dataset.n=n;L.bd.push({n,t,last:null,skip:false,wire:true,pin:[s0.x1,s0.y1]})}
 svg.append(g0,go_,gleg,gd,gfg,gf,gp,gt,gcj,L.selg,gb,gx);try{vplace(R,S,L,bs)}catch(e){console.error('vplace',e)}`);
};
