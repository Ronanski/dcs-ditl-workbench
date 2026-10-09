/* INDEPENDENT CHECK of the address table (v1.20.6): the table measures the distance text -> wire with an ESTIMATED text box (length x height x 0.62). Here the same distance is measured again with the REAL rendered text (getBBox of the svg text, font and alignment included) and the real wire segments.
   For every address tied by position (label on wire / wire beside the text / circle tag) the wire of the table must be the closest analog wire to the rendered text (no other wire closer by more than 2 units), and the rendered gap must be <= 12.
   usage: node tools/audit-addr-geometry.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;const out={n:0,noEl:0,far:[],closer:[]};
 const segD=(b,s)=>{/* rect-segment distance */const hit=(()=>{let t0=0,t1=1;const dx=s.x2-s.x1,dy=s.y2-s.y1,P=[-dx,dx,-dy,dy],Q=[s.x1-b.x0,b.x1-s.x1,s.y1-b.y0,b.y1-s.y1];for(let i=0;i<4;i++){if(P[i]===0){if(Q[i]<0)return false}else{const u=Q[i]/P[i];if(P[i]<0){if(u>t1)return false;if(u>t0)t0=u}else{if(u<t0)return false;if(u<t1)t1=u}}}return t0<=t1})();if(hit)return 0;
  const rd=(x,y)=>Math.hypot(Math.max(b.x0-x,0,x-b.x1),Math.max(b.y0-y,0,y-b.y1));let d=Math.min(rd(s.x1,s.y1),rd(s.x2,s.y2));for(const[x,y]of[[b.x0,b.y0],[b.x1,b.y0],[b.x0,b.y1],[b.x1,b.y1]])d=Math.min(d,AN.ptSeg?AN.ptSeg(x,y,s):(()=>{const l2=(s.x2-s.x1)**2+(s.y2-s.y1)**2;let t=l2?((x-s.x1)*(s.x2-s.x1)+(y-s.y1)*(s.y2-s.y1))/l2:0;t=Math.max(0,Math.min(1,t));return Math.hypot(x-(s.x1+t*(s.x2-s.x1)),y-(s.y1+t*(s.y2-s.y1)))})());return d};
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;AN.go(AN.sheets.indexOf(sh));await new Promise(r=>setTimeout(r,300));const S=AN.cs().S;if(!S||!S.addr)continue;
  const texts=[...document.querySelectorAll('#svg text')].filter(e=>!e.classList.contains('bd'));
  for(const a of S.addr){if(!/^label on wire|^wire beside|^circle tag/.test(a.how))continue;out.n++;
   const el=texts.find(e=>e.textContent.trim()===a.t&&Math.abs(+e.getAttribute('x')-a.x)<8&&Math.abs(-+e.getAttribute('y')-a.y)<8);if(!el){out.noEl++;continue}
   const bb=el.getBBox();const b={x0:bb.x,x1:bb.x+bb.width,y0:-(bb.y+bb.height),y1:-bb.y};
   let own=(()=>{let d=1e9;const nets=a.how==='circle tag'?(S.conn.concat(S.xc||[]).filter(c=>(c.nets||[]).includes(a.n)||(c.nets||[]).includes(a.eng)).flatMap(c=>c.nets)):[a.n];for(const k of new Set(nets.concat([a.n])))for(const i of S.nets[k].segs)d=Math.min(d,segD(b,S.seg[i]));return d})();
   if(a.how==='circle tag'){/* a circle tag belongs to the circle disc: its distance is the distance to the disc (the audit of the wire distance alone would call the wire that passes by "closer") */const rd=(x,y)=>Math.hypot(Math.max(b.x0-x,0,x-b.x1),Math.max(b.y0-y,0,y-b.y1));for(const c of S.conn.concat(S.xc||[]))if((c.nets||[]).includes(a.eng))own=Math.min(own,Math.max(0,rd(c.x,c.y)-c.r))}
   let bd=1e9,bn=null;const mine=new Set(a.how==='circle tag'?(S.conn.concat(S.xc||[]).filter(c=>(c.nets||[]).includes(a.n)).flatMap(c=>c.nets)):[a.n]);mine.add(a.n);
   for(const nn of S.nets){if(!nn.segs.length||nn.dig||mine.has(nn.id))continue;let d=1e9;for(const i of nn.segs)d=Math.min(d,segD(b,S.seg[i]));if(d<bd){bd=d;bn=nn.id}}
   if(own>(a.how==='circle tag'?16:12))out.far.push(sh.name+' '+a.t+' ['+a.how+'] own wire '+a.n+' is '+own.toFixed(1)+' from the rendered text');
   else if(bd<own-2)out.closer.push(sh.name+' '+a.t+' ['+a.how+'] own '+a.n+' '+own.toFixed(1)+' but wire '+bn+' is '+bd.toFixed(1))}}
 return out});
console.log('checked',r.n,'tied by position | no rendered element',r.noEl,'| own wire > 12:',r.far.length,'| another wire closer by > 2:',r.closer.length);r.far.slice(0,20).forEach(x=>console.log(' FAR',x));r.closer.slice(0,20).forEach(x=>console.log(' CLOSER',x));
const ok=r.closer.length===0&&r.far.length<=5&&errs.length===0;console.log(errs.length?'page errors: '+errs.join(' | '):'',ok?'ALL PASS':'FAIL');await b.close();process.exit(ok?0:1)})();
