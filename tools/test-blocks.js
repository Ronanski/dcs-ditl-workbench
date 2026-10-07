/* Function blocks against docs/FUNCTIONALITY.md: integrators, select circuits, divide by zero / square root of a negative, TP, PO, and the instructions written on the drawing (SET SIxxxx => TAG.SV).  usage: node tools/test-blocks.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let tot=0,bad=0;
const ok=(c,msg)=>{tot++;if(!c){bad++;console.log('FAIL',msg)}else if(process.env.V)console.log('ok  ',msg)};
const sheet=n=>build(E,rows.find(x=>x.name===n));
const run=(S,secs,dt=.5)=>{for(let i=0;i<secs/dt;i++)E.anStep(S,dt)};
/* SUMA: 3600 per hour for 1 s = 1 */
{let n=0;for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);for(const b of S.blk)if(b.k==='SUMA'){n++;S.rt.force={};S.rt.force[b.i[0]]=3600;E.anSettle(S,3);run(S,10);const t=S.rt.st[b.id].tot;ok(Math.abs(t-10)<.6,r.name+' SUMA#'+b.id+' input 3600/h for 10 s -> total '+t.toFixed(2)+' (10)');S.rt.force[b.i[0]]=0;run(S,10);ok(Math.abs(S.rt.st[b.id].tot-t)<1e-9,r.name+' SUMA#'+b.id+' keeps its total when the input is 0')}}ok(n>=10,'SUMA blocks found: '+n)}
/* SEL modes */
{for(const [n,id,md,exp] of [['ABC-009A',21,'PRI',0],['ABC-009A',21,'SEC',1],['ABC-009A',21,'AVG',null]]){const S=sheet(n),b=S.blk[id];S.rt.force={};S.rt.force[b.i[0]]=10;S.rt.force[b.i[1]]=30;b.p.mode=md;E.anSettle(S,5);const y=S.rt.v[b.o[0]];const want=exp==null?20:[10,30][exp];ok(Math.abs(y-want)<1e-6,n+' SEL#'+id+' mode '+md+' inputs 10 / 30 -> '+y+' ('+want+')')}
 const S=sheet('ABC-006'),b=S.blk[41];S.rt.force={};b.i.forEach((x,k)=>S.rt.force[x]=[40,60][k]);E.anSettle(S,5);ok(Math.abs(S.rt.v[b.o[0]]-50)<1e-6,'ABC-006 AVERAGE SELECT 40 / 60 -> 50');
 const S3=sheet('ABC-050'),b3=S3.blk[39];S3.rt.force={};b3.i.forEach((x,k)=>S3.rt.force[x]=[30,60,90][k]);E.anSettle(S3,5);ok(Math.abs(S3.rt.v[b3.o[0]]-60)<1e-6,'ABC-050 AVERAGE SELECT (A+B+C)/3: 30 / 60 / 90 -> 60 (legend Y=(A+B+C)/3)')}
/* DIV / SQRT invalid */
{const S=sheet('ABC-002');const d=S.blk.find(b=>b.k==='DIV');S.rt.force={};S.rt.force[d.nu]=50;S.rt.force[d.de]=10;E.anSettle(S,5);ok(Math.abs(S.rt.v[d.o[0]]-5)<1e-6&&!S.rt.st[d.id].bad,'DIV 50 / 10 = 5');S.rt.force[d.de]=0;E.anSettle(S,5);ok(S.rt.st[d.id].bad===1&&Math.abs(S.rt.v[d.o[0]]-5)<1e-6,'DIV by zero: flagged invalid, holds the last good value 5');
 const q=build(E,rows.find(x=>x.blk&&0)||rows.find(x=>x.name==='ABC-003B')).blk.find(b=>b.k==='SQRT');}
{const S=sheet('ABC-003B');const q=S.blk.find(b=>b.k==='SQRT');S.rt.force={};S.rt.force[q.i[0]]=25;E.anSettle(S,5);ok(Math.abs(S.rt.v[q.o[0]]-50)<1e-6,'SQRT 25 % -> 50 % (100*sqrt(x/100))');S.rt.force[q.i[0]]=-4;E.anSettle(S,5);ok(S.rt.st[q.id].bad===1&&S.rt.v[q.o[0]]===0,'SQRT of a negative: flagged invalid, output 0')}
/* TP */
{const S=sheet('ABC-003B');const t=S.blk.find(b=>b.k==='TP');S.rt.force={};S.rt.force[t.tpd]=40;S.rt.force[t.tpt]=100;t.p.tref=null;E.anSettle(S,5);ok(Math.abs(S.rt.v[t.o[0]]-40)<1e-6,'TP without operating temperature passes the DP (40)');t.p.tref=20;E.anSettle(S,5);const kt=(100+273.15)/(20+273.15);ok(Math.abs(S.rt.v[t.o[0]]-40/kt)<1e-6,'TP T = 100, operating 20: DP / Kt = '+(40/kt).toFixed(3))}
/* PO: pulses come in cycles (assumed cycle 2 s, stroke 60 s, shortest pulse 0.2 s) */
{const S=sheet('ABC-054');const p=S.blk.find(b=>b.k==='PO');ok(p.p.cyc===2&&p.p.stroke===60&&p.p.minp===.2,'PO assumed defaults cycle 2 s / stroke 60 s / shortest pulse 0.2 s');
 S.rt.force={};S.rt.force[p.i[0]]=10;E.anSettle(S,5);run(S,4);S.rt.force[p.i[0]]=20;let up=0,dn=0;for(let i=0;i<12;i++){E.anStep(S,.5);if(S.rt.st[p.id].up)up++;if(S.rt.st[p.id].dn)dn++}
 ok(up>0&&dn===0,'PO: a rise of the demand = raise pulses (got '+up+' raise, '+dn+' lower in 6 s)');
 run(S,10);S.rt.force[p.i[0]]=5;up=0;dn=0;for(let i=0;i<12;i++){E.anStep(S,.5);if(S.rt.st[p.id].up)up++;if(S.rt.st[p.id].dn)dn++}
 ok(dn>0&&up===0,'PO: a fall = lower pulses (got '+up+' raise, '+dn+' lower in 6 s)');
 run(S,16);let n=0;for(let i=0;i<10;i++){E.anStep(S,.5);if(S.rt.st[p.id].up||S.rt.st[p.id].dn)n++}ok(n<=2,'PO: demand = position, no more pulses (got '+n+')')}
/* defaults that are not on the drawing (tools/assumed-data.js) */
{const D=require('./assumed-data.js');let nA=0,nT=0,nR=0;for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);for(const b of S.blk){
  if(b.k==='ALM'){nA++;const e=b.dflt&&b.dflt.e;ok(!!e&&b.p.hh===e.hh&&b.p.h===e.h&&b.p.l===e.l&&b.p.ll===e.ll,r.name+' ALM#'+b.id+' '+(b.txt||[])[1]+' has its assumed limits');
   if(e){const n=b.i[0];const lv=x=>{S.rt.force={};S.rt.force[n]=x;return E.anSettle?0:0};
    const a=(x)=>{const P=b.p;return P.hh!=null&&x>=P.hh?'HH':P.h!=null&&x>=P.h?'H':P.ll!=null&&x<=P.ll?'LL':P.l!=null&&x<=P.l?'L':'N'};
    if(e.hh!=null&&e.h!=null)ok(e.hh>e.h,r.name+' '+e.tag+' HH above H');if(e.l!=null&&e.ll!=null)ok(e.ll<e.l,r.name+' '+e.tag+' LL below L');if(e.h!=null&&e.l!=null)ok(e.h>e.l,r.name+' '+e.tag+' H above L')}}
  if(b.k==='TP'){nT++;ok(b.dflt&&b.dflt.k==='TP'&&b.p.tref===b.dflt.e.top,r.name+' TP#'+b.id+' operating temperature from the Compensation file ('+(b.dflt&&b.dflt.e.top)+')');
   S.rt.force={};S.rt.force[b.tpd]=40;S.rt.force[b.tpt]=b.dflt.e.top;E.anSettle(S,5);ok(Math.abs(S.rt.v[b.o[0]]-40)<1e-6,r.name+' TP at operating temperature = DP unchanged');
   S.rt.force[b.tpt]=b.dflt.e.top+100;E.anSettle(S,5);const kt=(b.dflt.e.top+100+273.15)/(b.dflt.e.top+273.15);ok(Math.abs(S.rt.v[b.o[0]]-40/kt)<1e-6,r.name+' TP +100 °C: DP / Kt = '+(40/kt).toFixed(3));
   /* the file's at / bt: Kt = at * (T / span) + bt */
   const e=b.dflt.e;ok(Math.abs(e.at-(e.tfs-e.tbs)/(e.top+273.15))<2e-3&&Math.abs(e.bt-(e.tbs+273.15)/(e.top+273.15))<2e-3,r.name+' TP at / bt of the file agree with the operating temperature')}
  if(b.dflt&&b.dflt.k==='RATE'){nR++;const S2=build(E,r),b2=S2.blk[b.id];S2.rt.force={};S2.rt.force[b2.main]=0;if(b2.byp>=0)S2.rt.force[b2.byp]=0;E.anSettle(S2,5);S2.rt.force[b2.main]=100;for(let i=0;i<4;i++)E.anStep(S2,.5);const y=S2.rt.v[b2.o[0]];ok(Math.abs(y-b2.p.rate*2)<1e-6,r.name+' RATE#'+b.id+' ramps at its assumed '+b2.p.rate+' per s (2 s -> '+y+')')}}}
 ok(nA===D.ALM.length+0||nA>=100,'ALM blocks with defaults: '+nA+' (table entries '+D.ALM.length+')');ok(nT===8,'8 TP blocks: '+nT);ok(nR===8,'8 ramp boxes with an assumed rate: '+nR)}
/* instructions on the drawing */
{let found=0;for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);for(const q of S.sets||[]){found++;ok(q.src>=0&&q.ctl>=0&&q.tgt>=0,r.name+' "'+q.text+'" / "'+q.cond+'": source net '+q.src+', condition net '+q.ctl+', target net '+q.tgt)}}ok(found===8,'instructions SET ... => ... found: '+found+' (8 on the drawings)')}
{const S=sheet('ABC-013'),q=S.sets.find(x=>/PICMS1002/.test(x.text));S.rt.force={};S.rt.force[q.src]=77;S.rt.force[q.ctl]=0;E.anSettle(S,5);const v0=S.rt.v[q.tgt];S.rt.force[q.ctl]=1;E.anSettle(S,5);ok(Math.abs(S.rt.v[q.tgt]-77)<1e-6,'ABC-013 IF M.0252 = 1: SI0361 (77) is written into the SV of PICMS1002 (SV net '+q.tgt+' was '+v0+')');S.rt.force[q.ctl]=0;E.anSettle(S,5);ok(Math.abs(S.rt.v[q.tgt]-77)>1e-6||S.ext.includes(q.tgt),'ABC-013 condition 0: no longer written (unless the SV is an operator value, then the written value stays)')}
{const S=sheet('ABC-001A'),q=S.sets.find(x=>/AB0117/.test(x.text));S.rt.force={};S.rt.force[q.src]=123;S.rt.force[q.ctl]=1;E.anSettle(S,5);ok(Math.abs(S.rt.v[q.tgt]-123)<1e-6,'ABC-001A IF HIC-ULD.MAN = 1: SI0200 (123) is written into the manual value AB0117')}
console.log('block tests:',tot,'failures:',bad);
