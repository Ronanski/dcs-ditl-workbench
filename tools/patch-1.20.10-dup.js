/* "double" live values (user 2026-10-10: "bakit andaming parang doble doble?").  Causes found on the 54 sheets:
   1. a circle tag (TOF 003A, TCF 004A ...) is tied to two nets (stub + signal wire): the address table gave BOTH an entry at the same text, so two numbers stacked at one tag
   2. a controller block prints its bare tag (HICFA1005), its .MV tag and the AO address on ONE net: three numbers
   3. the same address text twice on one net a few units apart
   4. a circle badge + a wire badge on one net
   Rule kept (xlsx rule 3): every real label of a net shows the same value; but ONE number per label and none on a bare controller tag when the net has another label. */
module.exports=(rep,repAll)=>{
rep(`const an_=L.addrN=new Set();
  for(const a of S.addr||[]){const n=a.n,s=a.t;`,`const an_=L.addrN=new Set();
  const prefer=n=>(S.drv[n]||[]).some(d=>d.k!=='LINK')?3:S.ext.includes(n)?2:(S.cns[n]||[]).length?1:0,AD0=S.addr||[],cnt={};AD0.forEach(a=>{cnt[a.n]=(cnt[a.n]||0)+1});
  const AD=AD0.filter((a,i)=>{
   if(/^circle tag/.test(a.how)){const g=AD0.filter(q=>q.t===a.t&&q.x===a.x&&q.y===a.y&&/^circle tag/.test(q.how));if(g.length>1){let best=g[0];for(const q of g)if(prefer(q.n)>prefer(best.n))best=q;if(best!==a)return false}}
   if(/^controller tag/.test(a.how)&&!/\\.(MV|SV|PV|OUT)$/i.test(String(a.t).trim())&&AD0.some(q=>q!==a&&q.n===a.n))return false;
   const rk=q=>/^[A-Z]{2}\d{4}$/.test(String(q.t).trim())?0:/\.(MV|SV|PV)$/i.test(String(q.t).trim())?1:2;
   /* the same text twice on a net, or two labels of one net closer than 22 units: ONE number (the module address first) */
   return !AD0.some((q,j)=>q.n===a.n&&j!==i&&(q.t===a.t?(j<i&&Math.hypot(q.x-a.x,q.y-a.y)<25):Math.hypot(q.x1-a.x1,q.y-a.y)<22&&(rk(q)<rk(a)||(rk(q)===rk(a)&&j<i))))});
  for(const a of AD){const n=a.n,s=a.t;`);
/* a circle (connector) ties its stub and its signal wire: the address beside the circle covers all of them (no second number a few units below) */
rep(`an_.add(n);if(a.eng!=null)an_.add(a.eng);`,`an_.add(n);if(a.eng!=null)an_.add(a.eng);if(/^circle tag/.test(a.how))for(const c of(S.conn||[]).concat(S.xc||[]))if(c.nets&&Math.hypot(c.x-a.x,c.y-a.y)<c.r+14)c.nets.forEach(k=>{if(S.nets[k]&&!S.nets[k].dig)an_.add(k)});`);
rep(`for(const q of oldB)if(!used.has(q)&&!q.circ){q.wire=true}L.nUn=nUn}`,`for(const q of oldB)if(!used.has(q)&&!q.circ){q.wire=true}
  for(const q of oldB)if(q.circ&&!q.addr&&an_.has(q.n)){q.skip=true;q.t.style.display='none'}
  L.nUn=nUn}`);
};
