/* Reader fixes found by the user's screenshots (2026-10-08).
   H-31: ABC-002 AIFG1122 / AIFG1123: the average select circuit got 0.00 although the two O2 transmitters read 4.30 and 4.60 (SI0048 must be 4.45). The wire that leaves the junction next to the SIG.AB box was cut from the analog trunk (the SIG.AB rule) and then fed the select circuit as if it were its input, so the select circuit read the FLAG (0). A select circuit takes the analog value: its input is the transmitter wire (the AI that sits at that junction); the SIG.AB box stays the "signal abnormal" flag of that transmitter. */
module.exports=(rep)=>{
rep(String.raw`function anCompile(S){`,String.raw`function anSelIn(S,blk,n){const g=(S.sigab||[]).find(q=>q.net===n);if(!g||!g.d2)return n;let best=null,bd=60;for(const a of blk){if(a.k!=='AI')continue;const d=Math.hypot(a.cx-g.d2.x,a.cy-g.d2.y);if(d<bd){bd=d;best=a}}const o=best&&best.pins.find(p=>p.role==='out');return o?o.n:n}
function anCompile(S){`);
rep(String.raw`case 'SEL':{const s2=ins.slice().sort((p,q)=>p.x-q.x);b.i=s2.map(p=>p.n);`,String.raw`case 'SEL':{const s2=ins.slice().sort((p,q)=>p.x-q.x);b.i=s2.map(p=>anSelIn(S,blk,p.n));`);
/* the flag of the second transmitter of ABC-002 (AI0433 <-> B.0701) is 46.8 away: the pairing limit 45 -> 50 (checked: it adds this one pair and no other on the 51 sheets) */
rep(String.raw`const d=anD(a.cx,a.cy,g.cx,g.cy);if(d<=45)pr.push({a,g,d})`,String.raw`const d=anD(a.cx,a.cy,g.cx,g.cy);if(d<=50)pr.push({a,g,d})`);
/* H-32: an ARROW whose tip touches the side of another wire (no junction dot) is a connection: the signal flows into that wire (ABC-003E: the orange loop wire ends with an arrow in the grey wire that feeds the DEV block and the T switch; the grey wire was left without a source). */
rep(String.raw`if(e2||par||S.dot.some(d=>anD(d.x,d.y,x,y)<=d.r+.5))un(i,j)}}});`,String.raw`if(e2||par||S.dot.some(d=>anD(d.x,d.y,x,y)<=d.r+.5)||(s.ar&&x===s.x1&&y===s.y1))un(i,j)}}});`);
};
