/* finding 2 of the user's xlsx: a FORCED value must look different from a SIMULATED (typed / slider) input and from a COMPUTED value.  Green = computed by the logic, cyan = input typed or slid by the engineer (analog), amber = FORCED. Shown on the badge beside the wire / address; also listed in the legend. */
module.exports=(rep,repAll)=>{
rep(`.bd.dg{fill:var(--vcol,#8dffb8)}`,`.bd.dg{fill:var(--vcol,#8dffb8)}.bd.inp{fill:#6ad7ff}.bd.frc{fill:#ffb04d}`);
rep(`if(b.last!==x){b.last=x;b.t.textContent=x}}
 const t=S.rt.t;`,`if(b.last!==x){b.last=x;b.t.textContent=x}
  {const es=S._extSet||(S._extSet=new Set(S.ext)),ck=S.rt.force[b.n]!==undefined?'f':(es.has(b.n)&&!S.nets[b.n].dig)?'i':'';if(b.ck!==ck){b.ck=ck;b.t.classList.toggle('frc',ck==='f');b.t.classList.toggle('inp',ck==='i')}}}
 const t=S.rt.t;`);
rep(`<b>Wires</b><div class="it"><svg width="24" height="13"><line x1="0" y1="6" x2="24" y2="6" stroke="var(--live)"`,`<b>Numbers</b><div class="it"><span style="color:#8dffb8;font-weight:700">12.3</span>&nbsp;computed by the logic</div><div class="it"><span style="color:#6ad7ff;font-weight:700">12.3</span>&nbsp;simulated input (typed or slider)</div><div class="it"><span style="color:#ffb04d;font-weight:700">12.3</span>&nbsp;FORCED value</div><b>Wires</b><div class="it"><svg width="24" height="13"><line x1="0" y1="6" x2="24" y2="6" stroke="var(--live)"`);
};
