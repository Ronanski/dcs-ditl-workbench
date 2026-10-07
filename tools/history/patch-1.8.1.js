/* v1.8.0 -> v1.8.1 : link circles. Two-line circles: the LOWER text is the sheet it goes to (003E, 061 ...); the upper text can be a number OR a name (TOF, SAT ...). Before only number / number circles were read and 003E-type targets never matched. */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.8.0.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,90));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.8.0</title>','<title>DITL Logic Workbench v1.8.1</title>');
rep(`const AN_PV=9;`,`const AN_PV=10;`);
/* reader */
rep(`const ins=TX.filter(q=>q.x>=c.x-c.r&&q.x<=c.x+c.r&&q.y>=c.y-c.r&&q.y<=c.y+c.r&&/^\\d{1,4}$/.test(q.t.trim())).sort((a,b)=>b.y-a.y);
  let num,tgt=null;
  if(ins.length===2&&c.r>=3){num=+ins[0].t;tgt=ins[1].t.trim()}`,`const ins=TX.filter(q=>q.x>=c.x-c.r&&q.x<=c.x+c.r&&q.y>=c.y-c.r&&q.y<=c.y+c.r&&/^[A-Za-z0-9][A-Za-z0-9\\-]{0,7}$/.test(q.t.trim())).sort((a,b)=>b.y-a.y);
  let num,tgt=null;
  if(ins.length===2&&c.r>=3&&/^\\d{3,4}[A-Z]?$/.test(ins[1].t.trim())){const u=ins[0].t.trim();num=/^\\d+$/.test(u)?+u:u;tgt=ins[1].t.trim()}`);
/* linking */
rep(`const effSink=(sh,c)=>c.sink||c.nets.some(n=>sh.S.drv[n].some(d=>d.k!=='LINK'));`,`const codeOf=n=>String(n).replace(/^ABC-/,''),hasL=t=>/[A-Z]$/.test(String(t)),posCmp=(a,b)=>b.y-a.y||a.x-b.x;
/* sheets a circle points to: exact code (003E) or, for a bare number (061), the sheet of that number */
const tgtOf=(c,sh)=>AN.sheets.filter(p=>p!==sh&&(codeOf(p.name)===String(c.tgt)||(!hasL(c.tgt)&&famOf(p.name)===parseInt(c.tgt,10)&&!AN.sheets.some(z=>codeOf(z.name)===String(c.tgt)))));
const pointsTo=(q,sh)=>String(q.tgt)===codeOf(sh.name)||(!hasL(q.tgt)&&parseInt(q.tgt,10)===famOf(sh.name));
/* true = this end sends the signal out, false = it receives, null = cannot tell */
const role=(sh,c)=>{if(c.sink||c.nets.some(n=>sh.S.drv[n].some(d=>d.k!=='LINK')))return true;if(c.nets.some(n=>sh.S.cns[n].length))return false;return null};
/* both ends say 'sends out' (or both 'receives'): the end whose wire has consumers in its sheet is the receiving one */
const pairRoles=(sh,c,p,pc)=>{let a=role(sh,c),b=role(p,pc);if(a!==null&&a===b){const ca=c.nets.some(n=>sh.S.cns[n].length),cb=pc.nets.some(n=>p.S.cns[n].length);if(ca&&!cb){a=false;b=true}else if(cb&&!ca){b=false;a=true}}return[a,b]};
const effSink=(sh,c)=>role(sh,c)===true;`);
rep(`function addLink(out,sh,c,p,pc){const a=effSink(sh,c),b=effSink(p,pc);if(a===b)return;const f=a?{sh,c}:{sh:p,c:pc},t=a?{sh:p,c:pc}:{sh,c};`,`function addLink(out,sh,c,p,pc){const[a,b]=pairRoles(sh,c,p,pc);if(a!==null&&a===b)return;const here=a===true||b===false?true:(b===true||a===false?false:null);if(here===null)return;const f=here?{sh,c}:{sh:p,c:pc},t=here?{sh:p,c:pc}:{sh,c};`);
rep(`for(const c of S.xc||[]){const cand=AN.sheets.filter(p=>p!==sh&&famOf(p.name)===+c.tgt);let hit=null;for(const p of cand){let PS;try{PS=ensure(p)}catch(e){continue}const pc=(PS.xc||[]).find(q=>q.num===c.num&&+q.tgt===my&&effSink(p,q)!==effSink(sh,c));if(pc){hit=[p,pc];break}}if(hit)addLink(out,sh,c,hit[0],hit[1]);else c.nolink=1}`,`for(const c of S.xc||[]){let hit=null;for(const p of tgtOf(c,sh)){let PS;try{PS=ensure(p)}catch(e){continue}
   const mine=(S.xc||[]).filter(q=>q.num===c.num&&String(q.tgt)===String(c.tgt)).sort(posCmp),idx=mine.indexOf(c);
   let theirs=(PS.xc||[]).filter(q=>q.num===c.num&&pointsTo(q,sh)).sort(posCmp);if(!theirs.length)theirs=(PS.conn||[]).filter(q=>q.num===c.num).sort(posCmp);
   if(theirs.length){const pc=theirs[Math.min(idx,theirs.length-1)],[a,b]=pairRoles(sh,c,p,pc);if(a===null||b===null||a!==b){hit=[p,pc];break}}}
  if(hit)addLink(out,sh,c,hit[0],hit[1]);else c.nolink=1}`);
rep(`const cand=AN.sheets.filter(p=>p!==sh&&famOf(p.name)===+c.tgt);
  if(cand.length){`,`const cand=tgtOf(c,sh);
  if(cand.length){`);
rep(`const q=(PS.xc||[]).find(z=>z.num===c.num&&+z.tgt===famOf(sh.name))||(PS.xc||[]).find(z=>z.num===c.num);`,`const q=(PS.xc||[]).find(z=>z.num===c.num&&pointsTo(z,sh))||(PS.xc||[]).find(z=>z.num===c.num)||(PS.conn||[]).find(z=>z.num===c.num);`);
fs.writeFileSync('ditl-workbench-v1.8.1.html',h);console.log('written',h.length);
