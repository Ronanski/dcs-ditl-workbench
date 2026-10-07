/* Does every signal reach where it must? Per sheet (browser, real link code):
   DEAD END  = a net that is driven but feeds nothing, goes to no other sheet and is not a terminal output (AO / ALM / PO / SUMA / SUMP / "TO DITL" ...);
   ORPHAN    = a net that feeds logic, has no driver, is not a user input (S.ext), not linked from another sheet and not preset.
   usage: node tools/audit-reach.js file.html [--all] */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const res=await p.evaluate(()=>{const out={mbit:[],dead:[],orphan:[],stat:{nets:0,reached:0,xsheet:0,terminal:0,ditl:0,sigabOnly:0,dup:0,inner:0,ctk:0,ann:0,mbit:0,dead:0,inputs:0,drivenIn:0,ext:0,constText:0,xin:0,orphan:0}};
 const TERM=new Set(['AO','ALM','PO','SUMA','SUMP','FIELD','IP','UNK','VLV','ACT','MAN','SIGAB','COS']);
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;let S;try{S=AN.ensure(sh)}catch(e){continue}const lk=AN.linksOf(sh);
  const outN=new Set(),inN=new Set();for(const l of lk){if(l.from===sh)(l.fromNets||[]).forEach(n=>outN.add(n));if(l.to===sh)(l.toNets||[]).forEach(n=>inN.add(n))}
  const lkSrc=new Set(),lkDst=new Set();for(const q of S.link||[]){lkSrc.add(q[1]);lkDst.add(q[0])}
  const ext=new Set(S.ext||[]);
  const ditl=S.tx.filter(t=>/TO DITL|FROM DITL|DITL/i.test(t.t));
  const nearDitl=n=>{const nt=S.nets[n];let best=1e9;for(const i of nt.segs||[]){const sg=S.seg[i];if(!sg)continue;for(const t of ditl)for(const [x,y] of [[sg.x1,sg.y1],[sg.x2,sg.y2]]){const d=Math.hypot(t.x-x,t.y-y);if(d<best)best=d}}return best<=80};
  for(const nt of S.nets){const n=nt.id;if(!(nt.segs||[]).length)continue;out.stat.nets++;
   const dr=(S.drv[n]||[]),cn=(S.cns[n]||[]);const realD=dr.filter(d=>d.k!=='LINK'),realC=cn.filter(d=>d.k!=='LINK');
   const lab=S.lab[n]?S.lab[n].t:'';
   if(realD.length||dr.length){if(realC.length||cn.length){out.stat.reached++;continue}
    if(outN.has(n)||lkSrc.has(n)){out.stat.xsheet++;continue}
    if(realD.every(d=>TERM.has(d.k))){out.stat.terminal++;continue}
    if(nearDitl(n)){out.stat.ditl++;continue}
    if(realD.every(d=>(d.k==='PID'||d.k==='PIDV')&&d.o.some(m=>m!==n&&(S.cns[m]||[]).length))){out.stat.dup++;continue}
    {const cnt={};for(const i of nt.segs){const q=S.seg[i];for(const [x,y] of [[q.x1,q.y1],[q.x2,q.y2]]){const k=x.toFixed(1)+','+y.toFixed(1);cnt[k]=(cnt[k]||0)+1}}
     const ends=Object.keys(cnt).filter(k=>cnt[k]===1).map(k=>k.split(',').map(Number));let sg=false;
     for(const [x,y] of ends)for(const bb of S.blk)if(bb.k==='SIGAB'){const dx=Math.max(bb.x0-x,0,x-bb.x1),dy=Math.max(bb.y0-y,0,y-bb.y1);if(Math.hypot(dx,dy)<8)sg=true}
     if(sg){out.stat.sigabOnly++;continue}}
    /* a stub drawn inside its own driver block (box lines, pin stubs) is not a signal */
    if(realD.length&&realD.every(d=>d.x0!=null&&nt.segs.every(i=>{const q=S.seg[i];return q.x1>=d.x0-2&&q.x2>=d.x0-2&&q.x1<=d.x1+2&&q.x2<=d.x1+2&&q.y1>=d.y0-2&&q.y2>=d.y0-2&&q.y1<=d.y1+2&&q.y2<=d.y1+2}))){out.stat.inner++;continue}
    /* CTK = the contact of an instruction text ("IF M.xxxx = 1 SET SIxxxx => TAG.SV"): done by S.sets, not by the net */
    if(realD.every(d=>d.k==='CTK')){out.stat.ctk++;continue}
    /* annunciator / other-sheet exit written next to the end of the wire */
    {let hit=false;for(const i of nt.segs){const q=S.seg[i];for(const [x,y] of [[q.x1,q.y1],[q.x2,q.y2]])for(const t of S.tx)if(Math.hypot(t.x-x,t.y-y)<40&&/CRT|ANN|TO ABC|TO DITL|ALARM|HMI/i.test(t.t))hit=true}if(hit){out.stat.ann++;continue}}
    /* the source of an instruction text ("SET SIxxxx => TAG.SV"): written into the SV by S.sets */
    if((S.sets||[]).some(q=>q.src===n)){out.stat.ctk++;continue}
    /* destination written as a text under the end of the wire (( TO TCS )) */
    {let hit=false;for(const i of nt.segs){const q=S.seg[i];for(const [x,y] of [[q.x1,q.y1],[q.x2,q.y2]])for(const t of S.tx)if(Math.hypot(t.x-x,t.y-y)<45&&/\(\s*TO\s+[A-Z]/i.test(t.t))hit=true}if(hit){out.stat.ann++;continue}}
    /* the end of the wire touches the contact of an instruction text (CTK) */
    {let hit=false;for(const i of nt.segs){const q=S.seg[i];for(const [x,y] of [[q.x1,q.y1],[q.x2,q.y2]])for(const bb of S.blk)if(bb.k==='CTK'&&Math.hypot(bb.cx-x,bb.cy-y)<12)hit=true}if(hit){out.stat.ctk++;continue}}
    /* a memory bit / address written at the end of the wire (M.xxxx, B.xxxx, I.xxxx) or a "TO ..." text on the same row: an exit that this simulator has no reader for (DITL, HMI, TCS) */
    {let hit=false;for(const i of nt.segs){const q=S.seg[i];for(const [x,y] of [[q.x1,q.y1],[q.x2,q.y2]])for(const t of S.tx)if(Math.abs(t.y-y)<8&&Math.abs(t.x-x)<70&&/^[MBI]\.[0-9A-F]{4}$|^-?M\.[0-9A-F]{4}|TO (TCS|DITL|HMI)/i.test(t.t.trim()))hit=true}if(hit){out.stat.mbit++;out.mbit.push(sh.name+' net'+n+' "'+lab+'" <- '+realD.map(d=>d.k+'#'+d.id).join(','));continue}}
    out.stat.dead++;out.dead.push(sh.name+' net'+n+' "'+lab+'"'+(nt.dig?' D':' A')+' <- '+realD.map(d=>d.k+'#'+d.id).join(',')+(nt.sigab?' (sig.ab)':''))}
   else if(realC.length||cn.length){out.stat.inputs++;if(ext.has(n)){out.stat.ext++;continue}if(inN.has(n)||lkDst.has(n)){out.stat.xin++;continue}if(S.pre&&S.pre[n]){out.stat.xin++;continue}if(S.kn&&S.kn[n]!==undefined){out.stat.constText++;continue}
    out.stat.orphan++;out.orphan.push(sh.name+' net'+n+' "'+lab+'"'+(nt.dig?' D':' A')+' -> '+realC.map(d=>d.k+'#'+d.id).join(','))}}}
 return out});
console.log(JSON.stringify(res.stat));console.log('EXITS WRITTEN AS A MEMORY BIT / TO TCS / DITL (no reader here):',res.mbit.length);if(process.argv.includes('--all'))res.mbit.forEach(x=>console.log('  '+x));console.log('DEAD ENDS',res.dead.length);res.dead.forEach(x=>console.log('  '+x));console.log('ORPHANS',res.orphan.length);res.orphan.forEach(x=>console.log('  '+x));await b.close()})();
