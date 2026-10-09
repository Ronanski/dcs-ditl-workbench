/* v1.20.1: every ANALOG address text has its live value beside it (user 2026-10-08: "dapat address at wires"; then: "analog lang may LIVE value, ung digital kahit wala na" - digital stays as wire colour only).
   v1.20.0 audit (tools/audit-addr-values.js): 2316 address / tag texts on the 51 sheets, only 876 had a value beside them (277 analog and 1163 digital did not: the digital wires were only coloured, and a net with several texts got ONE badge).
   Now: for every text that names a wire (S.lab, S.tagN) a badge (1 / 0 for digital, number for analog) is placed at the end of THAT text unless a value of the same wire is already beside it. The badge belongs to the address: it is not a "bare wire value" (toggle Wire values does not hide it). */
const fs=require('fs'),path=require('path');
module.exports=(rep)=>{
/* v1.20.6: THE ADDRESS TABLE. anAddr(S) (tools/addr-table-src.js) is put into the analog script above anWire and exported for the tests. */
rep(String.raw`function anWire(S){`,fs.readFileSync(path.join(__dirname,'addr-table-src.js'),'utf8')+'\nfunction anWire(S){');
rep(`anProcList,anPins};`,`anProcList,anPins,anAddr};`);
/* LINK TO THE DITL PAGE (user: "ung link sa DITL, di gumagana"): a "FROM / TO DITL pp-nn" reference opens the DITL page at sheet pp. From the DITL signals list (click the reference) and from the circle that carries the text (click the circle). The DITL page itself is not changed. */
rep(String.raw`function connClick(c){const sh=cs(),S=sh.S;AN.sel={net:c.nets[0]};selBox();paint();panelUpd(true);`,String.raw`function dsGoRef(r){const m=/(?:DITL\s*)?([0-9]{2}[A-Z]?)\s*-\s*(\d+)/i.exec(String(r));if(!m){msg('DITL reference not understood: '+r);return false}const code=m[1].toUpperCase(),nn=m[2];let i=S.sheets.findIndex(x=>new RegExp('DITL-'+code+'$','i').test(x.name));if(i<0)i=S.sheets.findIndex(x=>new RegExp('DITL-'+code.replace(/[A-Z]$/,'')+'$','i').test(x.name));if(i<0){msg('DITL sheet '+code+' ('+r+') is not in the DITL page');return false}setCat('dig');S.cur=i;sel=null;render();msg('DITL page: '+S.sheets[i].name+' (reference '+r+', item '+nn+')');return true}
function connClick(c){const sh=cs(),S=sh.S;AN.sel={net:c.nets[0]};selBox();paint();panelUpd(true);
 {const dt=S.tx.filter(t=>/DITL\s*[0-9]{2}[A-Z]?\s*-\s*\d+/i.test(t.t)&&Math.hypot(t.x-c.x,t.y-c.y)<c.r+16).sort((a,b)=>Math.hypot(a.x-c.x,a.y-c.y)-Math.hypot(b.x-c.x,b.y-c.y))[0];const own=dt&&(S.conn||[]).concat(S.xc||[]).slice().sort((a,b)=>Math.hypot(a.x-dt.x,a.y-dt.y)-Math.hypot(b.x-dt.x,b.y-dt.y))[0];const lk0=linksOf(sh).find(l=>l.at.c===c);if(dt&&own===c&&!(lk0&&lk0.to===sh&&lk0.from!==sh&&lk0.peer&&lk0.peer.sh&&lk0.peer.c)){const m=/DITL\s*([0-9]{2}[A-Z]?)\s*-\s*(\d+)/i.exec(dt.t);if(m&&dsGoRef('DITL '+m[1]+'-'+m[2]))return}}`);
rep(String.raw`cell(dir==='FROM'?'◀ FROM':'→ TO'),cell(refs.join(', ')),`,String.raw`cell(dir==='FROM'?'◀ FROM':'→ TO'),h$('td',{style:'padding:2px 6px;border-bottom:1px solid var(--line,#334)'},refs.map(r=>h$('a',{href:'#',txt:r,title:'Open the DITL page at this sheet',style:'margin-right:6px;color:var(--acc)',onclick:ev=>{ev.preventDefault();dsGoRef(r)}}))),`);
/* THE ADDRESS OWNS THE VALUE (engine): the same SI / AI address written at several places of one sheet is ONE signal. v1.20.1 only merged the nets that the reader had named; a text that the reader had not tied to a wire (ABC-002 SI0061: 3 texts, 1 named wire) left its wire undriven = 0 beside a driven wire of the same address. Now every SI / AI text without a wire is tied to the nearest analog wire that no text names (25 units), and the source is chosen: real driver > circle link > input. */
rep(String.raw`for(const k in G){const g=G[k];if(g.length<2)continue;const src=g.find(n=>S.drv[n].length&&nets[n].dig===nets[g[0]].dig&&!S.drv[n].some(d=>d.k==='LINK'))??-1;
   const master=src>=0?src:g.find(n=>!S.drv[n].length&&S.cns[n].length);`,String.raw`{/* THE ADDRESS TABLE (v1.20.6, tools/addr-table-src.js): built once here; the engine merges the nets of one address from it and the display (below) reads the same table. Nothing is tied to "the nearest free wire" any more. */
   S.tagN=(S.tagN||[]).filter(q=>!q.by);anAddr(S);
   for(const a of S.addr){const k=a.how==='circle tag'?'circle':a.how==='AO block input'?'AO':/^wire beside/.test(a.how)?'addr':null;if(!k)continue;add(a.t,a.eng);(S.tagN=S.tagN||[]).push({t:a.t,n:a.eng,d:k==='circle'?0:k==='AO'?9:a.gap,by:k})}}
  for(const k in G){const g=G[k];if(g.length<2)continue;const dg=nets[g[0]].dig,isL=n=>S.link.some(x=>x[0]===n);const src=g.find(n=>S.drv[n].length&&nets[n].dig===dg&&!S.drv[n].some(d=>d.k==='LINK'))??g.find(n=>isL(n))??-1;
   const master=src>=0?src:g.find(n=>!S.drv[n].length&&S.cns[n].length);`);
rep(String.raw` svg.append(g0,go_,gleg,gd,gfg,gf,gp,gt,gcj,L.selg,gb);
 const av=AN.av[sh.name];`,String.raw` {/* ONE live value per analog address text, read from the ADDRESS TABLE S.addr (built once by anAddr, the same table the engine uses). A text that the table could not tie without guessing has NO value (it is listed in S.addrUn / L.addrUn for the engineer). An old badge near the text is ADOPTED, the others are hidden (they are "wire values"). */
  const bx=q=>+q.t.getAttribute('x'),by=q=>-+q.t.getAttribute('y'),oldB=L.bd.filter(q=>!q.addr),used=new Set();
  const rp=L.addrRep=[],un=L.addrUn=[];let nUn=0;
  for(const u of S.addrUn||[]){nUn++;un.push(u.t+'@'+Math.round(u.x)+','+Math.round(u.y))}
  for(const a of S.addr||[]){const n=a.n,s=a.t;if(!S.nets[n]||(S.nets[n].dig&&a.ai==null))continue;
   const ex=a.x1+1.5;let ad=oldB.filter(q=>q.n===n&&!used.has(q)&&Math.abs(by(q)-a.y)<7&&Math.abs(bx(q)-ex)<40).sort((p,c)=>Math.hypot(bx(p)-ex,by(p)-a.y)-Math.hypot(bx(c)-ex,by(c)-a.y))[0];
   if(ad){if(a.ai!=null)ad.ai=a.ai;ad.t.dataset.how=a.how;used.add(ad);ad.wire=false;ad.skip=false;ad.addr=true;ad.t.style.display='';rp.push({t:s,n,b:ad,x:a.x,y:a.y,how:a.how});continue}
   const e=el('text',{x:ex,y:-(a.y+bs*.2),class:'bd','text-anchor':'start'},gb);e.dataset.n=n;e.dataset.how=a.how;const nb={n,t:e,last:null,skip:false,wire:false,addr:true,ai:a.ai!=null?a.ai:null};L.bd.push(nb);rp.push({t:s,n,b:nb,x:a.x,y:a.y,how:a.how})}
  for(const q of oldB)if(!used.has(q)&&!q.circ){q.wire=true;q.skip=false}L.nUn=nUn}
 svg.append(g0,go_,gleg,gd,gfg,gf,gp,gt,gcj,L.selg,gb);
 const av=AN.av[sh.name];`);
rep(String.raw`for(const n of g){if(n===master||S.drv[n].length||nets[n].dig!==nets[master].dig)continue;S.link.push([n,master])}}}`,String.raw`for(const n of g){if(n===master||S.drv[n].length||nets[n].dig!==nets[master].dig||S.link.some(x=>x[0]===n))continue;S.link.push([n,master])}}}`);
/* READER: a link circle with a long name ("PAF-MV" over "007": ABC-008, radius > 8.3) was not a circle at all, so the wire stayed without a source. Circles up to radius 12 are taken when they hold TWO texts, the lower one a sheet number. */
rep(String.raw` for(const c of R.ci){if(c.r<2.2||c.r>8.3)continue;`,String.raw` for(const c of R.ci){if(c.r<2.2||c.r>12)continue;if(c.r>8.3&&!(TX.filter(q=>q.x>=c.x-c.r&&q.x<=c.x+c.r&&q.y>=c.y-c.r&&q.y<=c.y+c.r&&/^[A-Za-z0-9][A-Za-z0-9\-]{0,7}$/.test(q.t.trim())).length===2&&TX.some(q=>q.x>=c.x-c.r&&q.x<=c.x+c.r&&q.y>=c.y-c.r&&q.y<=c.y+c.r&&/^\d{3,4}[A-Z]?$/.test(q.t.trim()))))continue;`);
/* READER: a "PRI / SEC / AVG SELECT CIRCUIT" box wider than 46 units (ABC-001C 50, ABC-008, ABC-031) was skipped, the select block did not exist: its inputs went nowhere and its output wire had no source. Select boxes up to 64 wide are taken. */
rep(String.raw` for(const sh of S.shp){const t=txIn(sh),sg=sigOf(sh);if(sh.w>46||sh.h>46)continue;let k=gk(sh,t,sg);`,String.raw` for(const sh of S.shp){const t=txIn(sh),sg=sigOf(sh);if(sh.h>46||(sh.w>46&&!(sh.w<=64&&t.some(q=>/SELECT\s*CIRCUIT|AVERAGE/i.test(q.t)))))continue;let k=gk(sh,t,sg);`);
rep(String.raw`plOpen,plClose,plAIs,plRes,plVal});`,String.raw`plOpen,plClose,plAIs,plRes,plVal,dsGoRef,connClick,addrTable:nm=>{const sh=AN.sheets.find(s=>s.name===nm)||cs(),S=ensure(sh);return{table:S.addr,notTied:S.addrUn}}});`);
rep(String.raw`(S.nets[b.n].dig?(v[b.n]>.5?'1':'0'):fmt(v[b.n]))`,String.raw`(b.ai!=null&&S.rt.st[b.ai]?fmt(S.rt.st[b.ai].act):S.nets[b.n].dig?(v[b.n]>.5?'1':'0'):fmt(v[b.n]))`);
/* BETA v1.20.5 (user: "non-sense na may wire values pa; ang dapat makita lang ay ang values na address"): the toolbar button "Wire values" is gone and the bare-wire numbers are never shown; only the value beside an address text is shown. */
rep(String.raw`bFit,bVal,bWv,sLv,`,String.raw`bFit,bVal,sLv,`);
rep(String.raw`AN.wireVals?'':'none'`,String.raw`'none'`);
};
