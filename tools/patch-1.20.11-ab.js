/* user (2026-10-10): a transmitter with Bad Signal (SIG.AB) forced, going straight into a logic block: the receiving block must receive ZERO and the B.xxxx flag address must trigger (1).  Select circuits keep excluding the bad input by its flag (their own logic).
   Review marks: the small glyph inside a recognised block (the triangle of the deviation block ...) was marked "?" (91 false marks); SIG.AB has one input and no output block pin by design (151 false "pin?"). The legend sheets ABC-000 are not marked. */
module.exports=(rep,repAll)=>{
rep(`function anNetRange(S,n){`,`function aiBad(S,id){const a=S.blk.find(z=>z.id===id),q=a&&a.sig&&S.rt.st[a.sig.id];return !!(q&&q.val>.5)}
function anNetRange(S,n){`);
rep(`else s.act=slew(s.act,s.val,sp);out(s.act);break}`,`else s.act=slew(s.act,s.val,sp);s.bad=b.sig&&rt.st[b.sig.id]&&rt.st[b.sig.id].val>.5?1:0;out(s.bad?0:s.act);break}`);
rep(`S.rt.force[b.n]===undefined?fmt(S.rt.st[b.ai].act)`,`S.rt.force[b.n]===undefined&&!aiBad(S,b.ai)?fmt(S.rt.st[b.ai].act)`);
rep(`Forces the SIG.AB flag of this transmitter ON (FORCED BAD) or back to normal. Nothing is written to a DCS.`,`Forces the SIG.AB flag of this transmitter ON (FORCED BAD) or back to normal. While ON, the logic receives 0 from this transmitter and the B.xxxx flag is 1. Nothing is written to a DCS.`);
rep(`for(const s of S.shp)if(!used.has(s)&&s.w>2.5&&s.h>2.5&&s.w<30&&s.h<30&&!(S.gate||[]).some(q=>q.box===s))m.push([s.x0,s.y0,s.x1,s.y1,'?']);`,`if(/^ABC-000/.test(sh.name)){if(g._k!=='leg'){g._k='leg';g.textContent=''}return}
 for(const s of S.shp)if(!used.has(s)&&s.w>2.5&&s.h>2.5&&s.w<30&&s.h<30&&!(S.gate||[]).some(q=>q.box===s)&&!S.blk.some(b=>b.sh!==s&&(s.x0+s.x1)/2>=b.x0-.3&&(s.x0+s.x1)/2<=b.x1+.3&&(s.y0+s.y1)/2>=b.y0-.3&&(s.y0+s.y1)/2<=b.y1+.3))m.push([s.x0,s.y0,s.x1,s.y1,'?']);`);
repAll(`CONST:[0,1],SIGAB:[0,1]};`,`CONST:[0,1],SIGAB:[1,0]};`,2);
rep(`const unk=S.shp.filter(s=>!used.has(s)&&s.w>2.5&&s.h>2.5&&s.w<30&&s.h<30&&!(S.gate||[]).some(g=>g.box===s));`,`const unk=S.shp.filter(s=>!used.has(s)&&s.w>2.5&&s.h>2.5&&s.w<30&&s.h<30&&!(S.gate||[]).some(g=>g.box===s)&&!S.blk.some(b=>b.sh!==s&&(s.x0+s.x1)/2>=b.x0-.3&&(s.x0+s.x1)/2<=b.x1+.3&&(s.y0+s.y1)/2>=b.y0-.3&&(s.y0+s.y1)/2<=b.y1+.3));`);
/* an AMT / T switch whose B input is the COS diamond beside it has one wire only (the manual value is the COS); an AI with an INPUT pin and no output wire is a feedback transmitter (address only) */
rep(`if(i<e[0]||(e[1]&&!o&&b.k!=='AO'))m.push([b.x0,b.y0,b.x1,b.y1,'pin?'])`,`if(i<e[0]-((b.k==='AMT'||b.k==='SW')&&S.blk.some(c=>c.k==='COS'&&Math.hypot(c.cx-b.cx,c.cy-b.cy)<14)?1:0)||(e[1]&&!o&&b.k!=='AO'&&!(b.k==='AI'&&i>=1)))m.push([b.x0,b.y0,b.x1,b.y1,'pin?'])`);
rep(`if(i<e[0]||(e[1]&&!o&&!['AO'].includes(b.k)))r.push(`,`if(i<e[0]-((b.k==='AMT'||b.k==='SW')&&S.blk.some(c=>c.k==='COS'&&Math.hypot(c.cx-b.cx,c.cy-b.cy)<14)?1:0)||(e[1]&&!o&&!['AO'].includes(b.k)&&!(b.k==='AI'&&i>=1)))r.push(`);
};
