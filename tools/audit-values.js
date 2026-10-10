/* Live-value placement audit (user rules, LOGICSIM_EU_REPORT_FINDINGS): every visible number must NOT cover any text, block, wire / net or another number.
   Counts per sheet: overlaps with text / block / wire / other number.  usage: node tools/audit-values.js file.html [sheet] */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const names=await p.evaluate(()=>AN.sheets.map(s=>s.name).filter(n=>!/ABC-000/.test(n)));const only=process.argv[3];await p.evaluate(()=>{const r=[...document.querySelectorAll('#anbar button')].find(x=>/Run/.test(x.textContent));r&&r.click()});await p.waitForTimeout(500);const RECS=[];const tot={badges:0,text:0,block:0,wire:0,badge:0,align:0,placed:0};const rows=[];
for(const n of names){if(only&&n!==only)continue;await p.evaluate(n=>AN.go(AN.sheets.findIndex(x=>x.name===n)),n);await p.waitForTimeout(350);
 const r=await p.evaluate(()=>{const sh=AN.cs(),S=sh.S,L=AN.dbgL,R=sh.R;
  const vis=L.bd.filter(q=>!q.skip&&q.t.style.display!=='none'&&q.t.textContent);
  const bx=vis.map(q=>{const g=q.t.getBBox();return{q,b:[g.x,g.y,g.x+g.width,g.y+g.height],n:q.n}});
  const svg=[...document.querySelectorAll('svg')].sort((x,y)=>y.getBoundingClientRect().width-x.getBoundingClientRect().width)[0],inv=svg.getScreenCTM().inverse(),pt=svg.createSVGPoint();
  /* glyph-tight box: the browser box of a text includes line-height / descender air: shrink 22 % at top and bottom */const toS=r=>{pt.x=r.left;pt.y=r.top;const a=pt.matrixTransform(inv);pt.x=r.right;pt.y=r.bottom;const c=pt.matrixTransform(inv);const sh=(c.y-a.y)*.22;return[a.x+.1,a.y+sh,c.x-.1,c.y-sh]};
  const bdset=new Set(vis.map(q=>q.t));
  const TB=[...svg.querySelectorAll('text')].filter(t=>!t.classList.contains('bd')&&t.textContent.trim()&&getComputedStyle(t).display!=='none').map(t=>{const r=toS(t.getBoundingClientRect());return[r[0],r[1],r[2],r[3],t.textContent.trim()]});
  /* the badge boxes by the same method (screen box -> svg) */
  for(const o of bx)o.b=toS(o.q.t.getBoundingClientRect());
  const BB=S.blk.map(b=>[b.x0,-b.y1,b.x1,-b.y0]);
  const ov=(a,c)=>Math.min(a[2],c[2])-Math.max(a[0],c[0])>.35&&Math.min(a[3],c[3])-Math.max(a[1],c[1])>.35;
  const segHit=(a,s)=>{const x1=s.x1,y1=-s.y1,x2=s.x2,y2=-s.y2;const mx=Math.min(x1,x2),Mx=Math.max(x1,x2),my=Math.min(y1,y2),My=Math.max(y1,y2);if(Mx<a[0]+.2||mx>a[2]-.2||My<a[1]+.2||my>a[3]-.2)return false;if(Math.abs(x1-x2)<.01||Math.abs(y1-y2)<.01)return true;const m=(y2-y1)/(x2-x1);for(const x of[a[0],a[2]]){const y=y1+m*(x-x1);if(y>a[1]&&y<a[3]&&x>=mx&&x<=Mx)return true}return false};
  const o={det:[],badges:bx.length,text:0,block:0,wire:0,badge:0,align:0,placed:0,ex:[]};
  for(let i=0;i<bx.length;i++){const a=bx[i].b;let t=false,bl=false,w=false,bb=false;
   for(const q of TB){if(ov(a,q)){t=true;if(o.ex.length<3)o.ex.push('text "'+q[4]+'" under '+bx[i].q.t.textContent);break}}
   for(const q of BB)if(ov(a,q)){bl=true;break}
   for(const s of S.seg)if(segHit(a,s)){w=true;break}
   for(let j=0;j<bx.length;j++)if(j!==i&&ov(a,bx[j].b)){bb=true;break}
   {const t_=bx[i].q.t,al=t_.dataset.al;if(al){o.placed++;const cx=(a[0]+a[2])/2,cy=(a[1]+a[3])/2,ax=+t_.dataset.ax,ay=+t_.dataset.ay;const bad=(al==='r'||al==='l')?Math.abs(cy-ay)>.9:Math.abs(cx-ax)>1.2;if(bad){o.align++;if(o.det.length<6)o.det.push('ALIGN '+al+' '+bx[i].q.t.textContent)}}}
   if(t)o.text++;if(bl)o.block++;if(w)o.wire++;if(bb)o.badge++;if((t||bl||w||bb)&&o.det.length<6)o.det.push((bx[i].q.addr?'A':bx[i].q.circ?'C':'W')+' '+bx[i].q.t.textContent+' @'+Math.round(bx[i].b[0])+','+Math.round(-bx[i].b[1])+(t?' T':'')+(bl?' B':'')+(w?' L':'')+(bb?' N':''))}
  return o});
 for(const k of['badges','text','block','wire','badge','align','placed'])tot[k]+=r[k];RECS.push({sheet:n,block:'live values ('+r.badges+' numbers)',source:'user rules (LOGICSIM_EU_REPORT_FINDINGS): do not cover text / block / wire / other number; level at the side, centred above / below',input:'all numbers visible while running',expected:'0 overlaps, all aligned',actual:'text '+r.text+', block '+r.block+', wire '+r.wire+', number '+r.badge+', misaligned '+r.align,status:(r.text+r.block+r.badge+r.align===0&&r.wire<=2)?'PASS':'NEEDS REVIEW',evidence:r.det.join(' | ')});rows.push(n+' badges='+r.badges+' text='+r.text+' block='+r.block+' wire='+r.wire+' badge='+r.badge+' align='+r.align+'  '+r.det.join(' | '))}
console.log(rows.join('\n'));console.log('TOTAL',JSON.stringify(tot));if(process.argv[4]){const rec=RECS;require('fs').writeFileSync(process.argv[4]+'.json',JSON.stringify(rec,null,1))}await b.close()})();
