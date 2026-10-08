/* v1.15.3 WIP, H-18: a connector circle that says "( TO ABC-001D ) ( TO ABC-020 )" (several destinations) made ONE link only (the best scoring sheet); now one link per destination sheet
   (example: ABC-001B circle MWD -> ABC-001D and ABC-020; ABC-003E M.008F -> 003A / B / C / D). */
module.exports=(rep)=>{
rep(String.raw`   let best=null;for(const p of AN.sheets){if(p===sh||!((c.ref.codes||[c.ref.code]).includes(codeOf(p.name))||(!hasL(c.ref.code)&&famOf(p.name)===parseInt(c.ref.code,10))))continue;let PS;try{PS=ensure(p)}catch(e){continue}
    for(const q of PS.conn.filter(z=>z.num===c.num)){const[a,b]=pairRoles(sh,c,p,q),sc=(c.tags||[]).filter(t=>(q.tags||[]).includes(t)).length*4+(q.ref&&((q.ref.codes||[q.ref.code]).includes(codeOf(sh.name))||(!hasL(q.ref.code)&&+q.ref.code===my))?2:0)+(a!==null&&b!==null&&a!==b?1:0);if(!best||sc>best.sc)best={sc,p,q}}}
   if(best&&best.sc>=1)addLink(out,sh,c,best.p,best.q,c.ref.dir==='FROM'?'in':'out')}}`,
String.raw`   const bests=[];for(const p of AN.sheets){if(p===sh||!((c.ref.codes||[c.ref.code]).includes(codeOf(p.name))||(!hasL(c.ref.code)&&famOf(p.name)===parseInt(c.ref.code,10))))continue;let PS;try{PS=ensure(p)}catch(e){continue}let best=null;
    for(const q of PS.conn.filter(z=>z.num===c.num)){const[a,b]=pairRoles(sh,c,p,q),sc=(c.tags||[]).filter(t=>(q.tags||[]).includes(t)).length*4+(q.ref&&((q.ref.codes||[q.ref.code]).includes(codeOf(sh.name))||(!hasL(q.ref.code)&&+q.ref.code===my))?2:0)+(a!==null&&b!==null&&a!==b?1:0);if(!best||sc>best.sc)best={sc,p,q}}
    if(best&&best.sc>=1)bests.push(best)}
   for(const best of bests)addLink(out,sh,c,best.p,best.q,c.ref.dir==='FROM'?'in':'out')}}`);
};
