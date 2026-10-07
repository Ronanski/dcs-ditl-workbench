/* Per-sheet reader audit against the arrows of the drawing: pin role vs arrow direction, pins per block kind, floating inputs, dead outputs, unparsed parameters.  usage: node tools/audit-sheets.js file.html [sheet]  (prints one line per finding; every finding = a place to LOOK at on the drawing: node tools/shot-region.js file.html ABC-xxx x y 60 out.png) */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);const only=process.argv[3];
const F=[];const add=(sheet,type,b,txt,x,y)=>F.push({sheet,type,blk:b?b.k+'#'+b.id:'',x:Math.round(x??(b?b.cx:0)),y:Math.round(y??(b?b.cy:0)),txt});
const NEEDIN={SUM:2,SUB:2,ADD:2,MUL:2,DIV:2,DEV:2,SW:2,AMT:2,SEL:2,AND:2,OR:2,FF:2,PID:1,PIDV:1,HC:1,LC:1,HLC:1,FX:1,SQRT:1,LAG:1,RATE:1,ABS:1,NOT:1,TON:1,TOF:1,TPS:1,AO:1};
const NEEDOUT={SUM:1,SUB:1,ADD:1,MUL:1,DIV:1,DEV:1,SW:1,AMT:1,SEL:1,AND:1,OR:1,FF:1,PID:1,PIDV:1,HC:1,LC:1,HLC:1,FX:1,SQRT:1,LAG:1,RATE:1,ABS:1,NOT:1,TON:1,TOF:1,TPS:1,AI:1,MAN:1,RAMPB:1};
for(const r of rows){if(/ABC-000/.test(r.name)||(only&&r.name!==only))continue;const S=build(E,r);const ext=new Set(S.ext);
 for(const b of S.blk){if(!b.pins||!b.pins.length||['VLV','ACH','TXD','COS','FIELD','CONST','IP','ACT'].includes(b.k))continue;
  /* A. arrow vs role */
  for(const p of b.pins){const nt=S.nets[p.n];if(!nt)continue;for(const a of nt.arrows){if(Math.hypot(a.x-p.x,a.y-p.y)>2.6)continue;const into=((b.cx-a.x)*a.dx+(b.cy-a.y)*a.dy)>0;
    if(p.role==='out'&&into&&!['AI','AO'].includes(b.k))add(r.name,'ARROW into an OUT pin',b,'net'+p.n+(S.lab[p.n]?' "'+S.lab[p.n].t+'"':'')+' pin@'+Math.round(p.x)+','+Math.round(p.y),p.x,p.y);
    if(p.role==='in'&&!into&&!['PID','PIDV','MAN','AI','AND','OR'].includes(b.k))add(r.name,'ARROW away from an IN pin',b,'net'+p.n+(S.lab[p.n]?' "'+S.lab[p.n].t+'"':'')+' pin@'+Math.round(p.x)+','+Math.round(p.y),p.x,p.y);break}}
  /* B. pins per kind */
  const ni=b.pins.filter(p=>p.role==='in').length,no=b.pins.filter(p=>p.role==='out').length;
  if(NEEDIN[b.k]!=null&&ni<NEEDIN[b.k])add(r.name,'too few IN pins',b,ni+' in, needs '+NEEDIN[b.k]);
  if(NEEDOUT[b.k]!=null&&no<NEEDOUT[b.k])add(r.name,'no OUT pin',b,no+' out');
  /* D. floating inputs */
  for(const n of b.i||[]){if((S.drv[n]||[]).length||ext.has(n)||!S.nets[n].segs.length)continue;add(r.name,'FLOATING input (nothing drives it, user cannot set it)',b,'net'+n+(S.lab[n]?' "'+S.lab[n].t+'"':''))}
  /* C. dead outputs */
  if(!['AO','AI','PO','FOUT','SIGAB'].includes(b.k))for(const n of b.o||[]){if((S.cns[n]||[]).length||!S.nets[n].segs.length)continue;const hasText=(S.lab[n]&&S.lab[n].t)||S.nets[n].txt&&S.nets[n].txt.length;add(r.name,'output goes nowhere (no block reads it)',b,'net'+n+(S.lab[n]?' "'+S.lab[n].t+'"':''))}
  /* E. unparsed parameters */
  const P=b.p||{};
  if(['HC','LC','HLC'].includes(b.k)&&!P.found&&P.ref==null&&P.sp===0)add(r.name,'comparator set point not read',b,JSON.stringify(P).slice(0,80));
  if(['TON','TOF','TPS'].includes(b.k)&&!(P.sec>0))add(r.name,'timer time not read',b,JSON.stringify(P).slice(0,80));
  if(b.k==='FX'&&!(b.tbl||P.tbl||P.ln!=null))add(r.name,'FX without LN number / table',b,JSON.stringify(P).slice(0,80));
 }}
const by={};F.forEach(f=>{by[f.type]=(by[f.type]||0)+1});console.log('FINDINGS',F.length,JSON.stringify(by));
F.sort((a,b)=>a.type.localeCompare(b.type)||a.sheet.localeCompare(b.sheet));F.forEach(f=>console.log([f.type,f.sheet,f.blk,'@'+f.x+','+f.y,f.txt].join(' | ')));
