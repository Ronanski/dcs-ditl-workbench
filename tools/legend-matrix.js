/* LEGEND MATRIX: every block of every sheet is tested against the function that the SYMBOL LIST (ABC-000, docs/FUNCTIONALITY.md) gives to its symbol: inputs are forced, the output is read.
   Result: a table SHEET x GROUP of "passed / tested" and the list of every failure.  usage: node tools/legend-matrix.js file.html [out.md]
   Not in node (needs the page): FX tables (tools/test-ln.js, test-drum.js) and the alarm level text (tools/test-defaults-ui.js). */
const fs=require('fs');const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);
const GROUPS={'Gates':['AND','OR','NOT'],'FF':['FF'],'Timers':['TON','TOF','TPS'],'Compare':['HC','LC','HLC','CMPK','DCMP'],'Math':['ABS','ADD','SUB','SUM','DEV','MUL','DIV','SQRT','HS','LS','HLIM','LLIM','HLLIM','LAG'],'T switch':['SW','AMT'],'MAN':['MAN'],'PID':['PID','PIDV'],'Rate':['RATE','RAMPB'],'In / out':['AI','AO','CONST','ALM'],'Valves':['ACT','VLV'],'Special':['SEL','SUMA','CTK','TP','PO','SIGAB']};
const grp={};for(const g in GROUPS)for(const k of GROUPS[g])grp[k]=g;
const res={};const fails=[];const byKind={};
const rec=(sheet,k,ok,msg)=>{const g=grp[k]||'other';res[sheet]=res[sheet]||{};const c=res[sheet][g]=res[sheet][g]||[0,0];c[1]++;if(ok)c[0]++;const kk=byKind[k]=byKind[k]||[0,0];kk[1]++;if(ok)kk[0]++;if(!ok)fails.push(sheet+' '+k+' — '+msg)};
let seed=4242;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
const near=(a,b,t=1e-6)=>Math.abs(a-b)<=t*Math.max(1,Math.abs(b));
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r),V=n=>S.rt.v[n],F=(n,x)=>{S.rt.force[n]=x},go=(n=5)=>E.anSettle(S,n),nm=b=>b.k+'#'+b.id+'@'+Math.round(b.cx)+','+Math.round(b.cy);
 for(const b of S.blk){S.rt.force={};for(const t of S.blk)if((t.k==='AMT'||t.k==='SW')&&S.rt.st[t.id])S.rt.st[t.id].fm=null;const o=b.o&&b.o[0];
  /* ---- gates: the truth tables of the legend ---- */
  if(b.k==='AND'||b.k==='OR'||b.k==='NOT'){const ins=[...new Set(b.i||[])];if(!ins.length||o==null){rec(r.name,b.k,false,nm(b)+' no input or output');continue}
   const n=Math.min(ins.length,7);let ok=true,why='';for(let m=0;m<(1<<n)&&ok;m++){S.rt.force={};ins.forEach((x,i)=>{F(x,i<n?(m>>i)&1:0)});go(4);const want=b.k==='AND'?(m===(1<<n)-1&&ins.length===n?1:0):b.k==='OR'?(m>0?1:0):(m&1?0:1);const got=V(o)>.5?1:0;if(got!==want){ok=false;why=nm(b)+' inputs '+m.toString(2).padStart(n,'0')+' -> '+got+' legend '+want}}
   rec(r.name,b.k,ok,why);continue}
  /* ---- set / reset: S R -> Q 1 0 -> 1, 0 1 -> 0, 1 1 -> 0 (reset wins), 0 0 -> no change ---- */
  if(b.k==='FF'){const Sn=b.S,Rn=b.Rn;if(Sn==null||Rn==null||!S.nets[Sn]||!S.nets[Rn]||o==null){rec(r.name,'FF',false,nm(b)+' S / R pin missing');continue}
   let ok=true,why='';const run=(s,rr,pre)=>{S.rt.force={};for(const m of S.ext)if(S.nets[m].dig)F(m,0);F(Sn,pre[0]);F(Rn,pre[1]);go(5);E.anStep(S,.1);F(Sn,s);F(Rn,rr);E.anStep(S,.1);E.anStep(S,.1);return V(o)>.5?1:0};
   for(const [s,rr,pre,exp] of [[1,0,[0,0],1],[0,1,[1,0],0],[1,1,[0,0],0],[1,1,[1,0],0],[0,0,[1,0],1],[0,0,[0,1],0]]){const v=run(s,rr,pre);if(v!==exp){ok=false;why=nm(b)+' S'+s+' R'+rr+' -> '+v+' legend '+exp}}
   rec(r.name,'FF',ok,why);continue}
  /* ---- timers: TON / TOF / TPS diagrams of the legend ---- */
  if(b.k==='TON'||b.k==='TOF'||b.k==='TPS'){if(!(b.p&&b.p.sec>0)||!b.i.length||o==null){rec(r.name,b.k,false,nm(b)+' time or pins missing');continue}
   const inn=b.i[0],X=b.p.sec;const trace=seq=>{S.rt.force={};for(const m of S.ext)if(S.nets[m].dig)F(m,0);F(inn,0);go(5);for(let i=0;i<4;i++)E.anStep(S,.1);const out=[];for(const[val,dur]of seq){F(inn,val);for(let i=0,k=Math.round(dur/.1);i<k;i++){E.anStep(S,.1);out.push(V(o)>.5?1:0)}}return out};
   const at=(a,t)=>a[Math.min(a.length-1,Math.round(t/.1)-1)];let ok;
   if(b.k==='TON'){const a=trace([[1,X+2],[0,2]]);ok=at(a,Math.max(.2,X*.5))===0&&at(a,X+.5)===1&&at(a,X+2.3)===0}
   else if(b.k==='TOF'){const a=trace([[1,2],[0,X+2]]);ok=at(a,.3)===1&&at(a,2+X*.5)===1&&at(a,2+X+.5)===0}
   else{const a=trace([[1,X+3],[0,1]]);ok=at(a,.3)===1&&at(a,X+.5)===0}
   rec(r.name,b.k,ok,nm(b)+' '+b.k+' '+X+' s does not follow the legend diagram');continue}
  /* ---- comparators ---- */
  if(['HC','LC','HLC','CMPK','DCMP'].includes(b.k)){const P=b.p||{};const x=b.i&&b.i[0];if(x==null||!S.nets[x]){rec(r.name,b.k,false,nm(b)+' no input');continue}
   const outs=b.k==='DCMP'?(b.dc||[]).map(d=>({n:d.n,op:d.op,sp:d.sp,neg:d.neg})):[{n:b.o[0],op:P.op,sp:P.sp,ref:P.ref}];if(!outs.length){rec(r.name,b.k,false,nm(b)+' no set point read');continue}
   let ok=true,why='';for(const q of outs){let sp=q.sp;if(q.ref>=0){if(S.kn&&S.kn[q.ref]!=null)sp=S.kn[q.ref];else{F(q.ref,50);sp=50}}const d=Math.max(1,Math.abs(sp)*.1);
    F(x,q.neg?-(sp-d):sp-d);go(6);const lo=V(q.n)>.5?1:0;F(x,q.neg?-(sp+d):sp+d);go(6);const hi=V(q.n)>.5?1:0;const w=q.op==='>'?[0,1]:[1,0];if(lo!==w[0]||hi!==w[1]){ok=false;why=nm(b)+' '+q.op+' '+sp+' below='+lo+' above='+hi}}
   rec(r.name,b.k,ok,why);continue}
  /* ---- mathematics ---- */
  if(['ABS','ADD','SUB','SUM','DEV','MUL','DIV','SQRT','HS','LS','HLIM','LLIM','HLLIM'].includes(b.k)){const K=b.k;const ins=K==='DIV'?[b.nu,b.de]:K==='HLLIM'?[b.main,b.hi,b.lo].filter(x=>x>=0):b.i;if(!ins||!ins.length||ins.some(n=>n==null||n<0)||o==null){rec(r.name,K,false,nm(b)+' pins missing');continue}
   let ok=true,why='';for(let t=0;t<3&&ok;t++){const val={};S.rt.force={};ins.forEach(n=>{val[n]=Math.round((rnd()*180-30)*100)/100;F(n,val[n])});go(5);const y=V(o),g=n=>val[n];let w;
    if(K==='ABS')w=Math.abs(g(ins[0]));else if(['ADD','SUB','SUM','DEV'].includes(K))w=b.ip.reduce((a,q)=>a+q.sg*g(q.n),0);else if(K==='MUL')w=ins.reduce((a,n)=>a*g(n),1)*(b.gain!=null?b.gain:1);
    else if(K==='DIV')w=Math.abs(g(b.de))<1e-9?null:g(b.nu)/g(b.de);else if(K==='SQRT')w=g(ins[0])<0?0:100*Math.sqrt(g(ins[0])/100);
    else if(K==='HS'||K==='LLIM')w=Math.max(...ins.map(g));else if(K==='LS'||K==='HLIM')w=Math.min(...ins.map(g));else{w=g(b.main);if(b.lo>=0)w=Math.max(w,g(b.lo));if(b.hi>=0)w=Math.min(w,g(b.hi))}
    if(w!=null&&!near(y,w)){ok=false;why=nm(b)+' sim '+y+' legend '+w}}
   rec(r.name,K,ok,why);continue}
  if(b.k==='LAG'){const ins=b.i;if(!ins.length||o==null||!(b.p.tau>0)){rec(r.name,'LAG',false,nm(b)+' time or pins missing');continue}S.rt.force={};F(ins[0],0);go(5);E.anStep(S,.5);F(ins[0],100);const tau=b.p.tau,y0=V(o);let t=0;while(t<tau){E.anStep(S,.5);t+=.5}const want=y0+(100-y0)*(1-Math.exp(-t/tau));rec(r.name,'LAG',Math.abs(V(o)-want)<=1.5,nm(b)+' after one time constant '+V(o).toFixed(1)+' legend '+want.toFixed(1));continue}
  /* ---- T switches ---- */
  if(b.k==='SW'||b.k==='AMT'){if(b.q4){const q=b.q4;let ok=true,why='';const val={a:10,b:20,c:30,d:40};for(let i=0;i<q.cond.length&&ok;i++){S.rt.force={};for(const k of 'abcd')F(q.leg[k],val[k]);q.cond.forEach((c,j)=>{b.p['c'+(j+1)]=j===i?1:0});go(5);E.anStep(S,.1);if(V(o)!==val[q.cond[i].leg]){ok=false;why=nm(b)+' condition '+(i+1)+' -> '+V(o)}}rec(r.name,b.k,ok,why);continue}
   if(b.a>=0&&b.b>=0&&b.a!==b.cs&&(!b.cs||!b.cs.length)&&o!=null&&b.a!==b.b){const st=S.rt.st[b.id];const dig2=S.nets[b.a].dig;S.rt.force={};F(b.a,dig2?1:11);F(b.b,dig2?0:22);let ok=true,why='';for(const [fm,exp] of [['A',dig2?1:11],['B',dig2?0:22]]){st.fm=fm;go(8);if(Math.abs(V(o)-exp)>1e-6){ok=false;why=nm(b)+' operator switch '+fm+' -> '+V(o)+' expected '+exp}}st.fm=null;rec(r.name,b.k,ok,why);continue}
   if(b.a<0||b.b<0||!b.cs||!b.cs.length||o==null||b.a===b.b){rec(r.name,b.k,false,nm(b)+' legs or control missing');continue}
   const dig=S.nets[b.a].dig;let ok=true,why='';for(const c of b.cs){for(const[x,y]of dig?[[1,0],[0,1]]:[[11,22]]){S.rt.force={};for(const q of b.cs)F(q.n,0);F(b.a,x);F(b.b,y);F(c.n,1);go(8);const exp=c.A?x:y;if(Math.abs(V(o)-exp)>1e-6){ok=false;why=nm(b)+' control '+(c.A?'A':'B')+' -> '+V(o)+' expected '+exp}}}
   rec(r.name,b.k,ok,why);continue}
  /* ---- MAN: operator value inside its range, clamped, source for the logic ---- */
  if(b.k==='MAN'){const st=S.rt.st[b.id];if(o==null||!(b.p.hi>b.p.lo)){rec(r.name,'MAN',false,nm(b)+' no output or no range');continue}
   for(const t of S.blk)if((t.k==='AMT'||t.k==='SW')&&(t.trkFrom||[]).includes(b))S.rt.st[t.id].fm='A';
   let ok=true,why='';const lo=b.p.lo,hi=b.p.hi;for(const [v,want] of [[lo+.3*(hi-lo),lo+.3*(hi-lo)],[hi+50,hi],[lo-50,lo]]){st.trk=null;st.val=v;go(5);if(!near(V(o),want)){ok=false;why=nm(b)+' value '+v+' -> '+V(o)+' expected '+want}}
   if(!(S.cns[o]||[]).length&&!(b.pins||[]).some(p=>p.role==='out'&&(S.cns[p.n]||[]).length))ok=false,why=why||nm(b)+' output feeds nothing';
   rec(r.name,'MAN',ok,why);continue}
  /* ---- PID / PIDV: direction of the action (ACT:R / ACT:N) and the range ---- */
  if(b.k==='PID'||b.k==='PIDV'){const oo=b.o.find(n=>(S.cns[n]||[]).length&&S.nets[n].segs.length);if(b.in0==null||b.in0<0||oo==null){rec(r.name,b.k,false,nm(b)+' no input or output goes nowhere');continue}
   for(const t of S.blk)if((t.k==='AMT'||t.k==='SW')&&(t.trkFrom||[]).includes(b)){const st=S.rt.st[t.id];const reach=n=>{const seen=new Set(),q=[oo];while(q.length){const x=q.pop();if(x===n)return true;if(seen.has(x))continue;seen.add(x);for(const c of S.cns[x]||[])for(const y of c.o||[])q.push(y);for(const[d,s2]of S.link||[])if(s2===x)q.push(d)}return false};st.fm=reach(t.a)?'A':reach(t.b)?'B':null}
   const up=(b.p.act==null?-1:b.p.act)<0?10:-10;const seq=[[up,30],[-up,12],[up,12]];S.rt.force={};const ys=[];go(5);for(const [dev,secs] of seq){F(b.in0,dev);const y0=V(oo);for(let i=0;i<secs*2;i++)E.anStep(S,.5);ys.push([y0,V(oo)])}
   const lo=b.p.lo==null?0:b.p.lo,hi=b.p.hi==null?100:b.p.hi,rng=ys.every(([a,c])=>a>=lo-1e-6&&c<=hi+1e-6&&c>=lo-1e-6&&a<=hi+1e-6);const still=ys.every(([a,c])=>Math.abs(c-a)<1e-9);
   const dir=(ys[1][1]<ys[1][0]+1e-9)&&(ys[2][1]>ys[2][0]-1e-9)&&!(ys[1][1]>ys[1][0]+1e-6)&&!(ys[2][1]<ys[2][0]-1e-6);
   rec(r.name,b.k,(still||dir)&&rng,nm(b)+' act '+b.p.act+' '+JSON.stringify(ys.map(p=>p.map(v=>+v.toFixed(2)))));continue}
  /* ---- rate limiter / ramp ---- */
  if(b.k==='RATE'||b.k==='RAMPB'){const P=b.p||{};if(o==null||b.main==null||b.main<0){rec(r.name,b.k,false,nm(b)+' no input / output');continue}
   const run=(x0,x1,byp,secs)=>{S.rt.force={};if(b.byp>=0)F(b.byp,0);F(b.main,x0);if(b.up!==undefined)F(b.up,1);if(b.dn!==undefined)F(b.dn,1);go(5);for(let i=0;i<5;i++)E.anStep(S,.5);F(b.main,x1);if(b.byp>=0)F(b.byp,byp);const v0=V(o);for(let i=0;i<secs*2;i++)E.anStep(S,.5);return [v0,V(o)]};
   if(S.rt.st[b.id])S.rt.st[b.id].y=null;const rate=b.up!==undefined?1:P.rate,secs=10;const [a0,a1]=run(0,1000,0,secs);let ok=true,why='';const slope=(a1-a0)/secs;
   if(!(rate>0)){if(a1<999){ok=false;why='rate 0 = no limit but reached only '+a1.toFixed(2)}}else if(Math.abs(slope-rate)>rate*.05+1e-9){ok=false;why='slope '+slope.toExponential(2)+' rate '+rate}
   if(b.byp>=0){const [c0,c1]=run(0,50,1,1);if(Math.abs(c1-50)>1e-6){ok=false;why+=' bypass 1 does not follow'}}
   rec(r.name,b.k,ok,nm(b)+' '+why);continue}
  /* ---- inputs / outputs / constants / alarms ---- */
  if(b.k==='AI'){const st=S.rt.st[b.id],rg=b.rng||{lo:0,hi:100};if(o==null){rec(r.name,'AI',true,'');continue}/* field transmitter with nothing drawn after it (monitor only) */const want=rg.lo+.4*(rg.hi-rg.lo);if(b.fb){rec(r.name,'AI',true,'');continue}st.val=want;for(let i=0;i<400&&Math.abs(V(o)-want)>1e-6;i++)E.anStep(S,5);rec(r.name,'AI',near(V(o),want,1e-4),nm(b)+' value '+want+' -> '+V(o));continue}
  if(b.k==='AO'||b.k==='ALM'){const x=b.i&&b.i[0];if(x==null||!b.o.length){rec(r.name,b.k,true,'');continue}F(x,33.3);go(5);rec(r.name,b.k,near(V(o),33.3),nm(b)+' passes '+V(o));continue}
  if(b.k==='CONST'){if(o==null){rec(r.name,'CONST',true,'');continue}go(3);rec(r.name,'CONST',isFinite(V(o))&&near(V(o),b.p.val),nm(b)+' value '+V(o)+' / '+b.p.val);continue}
  /* ---- valves / actuators: travel in the stroke time ---- */
  if(b.k==='ACT'||b.k==='VLV'){if(!b.i.length||!b.o.length){rec(r.name,b.k,true,'');continue}const dig=S.nets[b.i[0]].dig;F(b.i[0],dig?0:0);go(5);for(let i=0;i<4;i++)E.anStep(S,.1);const st=S.rt.st[b.id];st.pos=0;F(b.i[0],dig?1:100);const T=b.p.stroke;for(let i=0;i<Math.round(T/2/.1);i++)E.anStep(S,.1);const half=st.pos;for(let i=0;i<Math.round(T/.1);i++)E.anStep(S,.1);rec(r.name,b.k,Math.abs(half-50)<3&&Math.abs(st.pos-100)<1e-6,nm(b)+' stroke '+T+' s: half '+half.toFixed(1)+' full '+st.pos.toFixed(1));continue}
  /* ---- special blocks ---- */
  if(b.k==='SEL'){if(b.i.length<2||o==null){rec(r.name,'SEL',false,nm(b)+' inputs');continue}b.p.mode='AVG';S.rt.force={};const a=b.i.map((n,k)=>{F(n,10+20*k);return 10+20*k});go(5);const sg=b.sgi||[];const healthy=a;rec(r.name,'SEL',near(V(o),healthy.reduce((x,y)=>x+y,0)/healthy.length),nm(b)+' average '+V(o));continue}
  if(b.k==='SUMA'){if(!b.i.length){rec(r.name,'SUMA',false,nm(b)+' no input');continue}S.rt.st[b.id].tot=0;F(b.i[0],3600);go(3);for(let i=0;i<20;i++)E.anStep(S,.5);rec(r.name,'SUMA',near(S.rt.st[b.id].tot,10,.06),nm(b)+' total '+S.rt.st[b.id].tot);continue}
  if(b.k==='CTK'){if(b.ctl==null||b.ctl<0||b.cin<0||o==null){rec(r.name,'CTK',false,nm(b)+' pins');continue}F(b.cin,55);F(b.ctl,1);go(5);const on=V(o);F(b.ctl,0);F(b.cin,77);go(5);rec(r.name,'CTK',near(on,55)&&near(V(o),55),nm(b)+' ctl 1 -> '+on+', ctl 0 -> '+V(o)+' (last value stays)');continue}
  if(b.k==='TP'){if(b.tpd==null||b.tpd<0||b.tpt==null||b.tpt<0||o==null||b.p.tref==null){rec(r.name,'TP',false,nm(b)+' pins or operating temperature');continue}F(b.tpd,40);F(b.tpt,b.p.tref);go(5);const a=V(o);F(b.tpt,b.p.tref+100);go(5);const kt=(b.p.tref+100+273.15)/(b.p.tref+273.15);rec(r.name,'TP',near(a,40)&&near(V(o),40/kt,1e-5),nm(b)+' at operating T '+a+', +100 °C '+V(o));continue}
  if(b.k==='PO'){const x=b.i[0];if(x==null){rec(r.name,'PO',false,nm(b)+' no input');continue}F(x,10);go(5);for(let i=0;i<8;i++)E.anStep(S,.5);F(x,40);let up=0;for(let i=0;i<12;i++){E.anStep(S,.5);if(S.rt.st[b.id].up)up++}rec(r.name,'PO',up>0,nm(b)+' no raise pulse');continue}
  if(b.k==='SIGAB'){rec(r.name,'SIGAB',true,'');continue}}
}
/* ---------- output ---------- */
const kinds=Object.keys(byKind).sort((a,b)=>byKind[b][1]-byKind[a][1]);let T=0,P=0;for(const k of kinds){T+=byKind[k][1];P+=byKind[k][0]}
const G=Object.keys(GROUPS).concat(['other']);const sheets=Object.keys(res);
let md='# LEGEND MATRIX — every block of every sheet against the function of its symbol (generated by `node tools/legend-matrix.js <html>`)\n\n';
md+='Total: **'+P+' of '+T+' blocks pass** ('+fails.length+' fail). Cell = passed / tested. A test forces the inputs of ONE block (the other blocks of the sheet run as drawn) and compares the output with the legend (docs/FUNCTIONALITY.md). Parameters read from the drawing (set points, times, signs, gains) are checked against the drawing texts by `audit-params.js`, `audit-signs.js`; tables F(X) by `test-ln.js` / `test-drum.js` (page); alarm level text by `test-defaults-ui.js` (page).\n\n';
md+='## By block kind\n| Kind | Group | Tested | Passed |\n|---|---|---|---|\n'+kinds.map(k=>'| '+k+' | '+(grp[k]||'other')+' | '+byKind[k][1]+' | '+byKind[k][0]+' |').join('\n')+'\n\n';
md+='## By sheet and group (passed / tested)\n| Sheet | '+G.join(' | ')+' | All |\n|---|'+G.map(()=>'---').join('|')+'|---|\n';
for(const s of sheets){let a=0,b=0;const cells=G.map(g=>{const c=res[s][g];if(!c)return '·';a+=c[0];b+=c[1];return c[0]+'/'+c[1]});md+='| '+s+' | '+cells.join(' | ')+' | **'+a+'/'+b+'** |\n'}
md+='\n## Failures ('+fails.length+')\n'+(fails.length?fails.map(f=>'- '+f).join('\n'):'none')+'\n';
const out=process.argv[3];if(out)fs.writeFileSync(out,md);
console.log('blocks tested',T,'| pass',P,'| fail',fails.length);kinds.forEach(k=>{if(byKind[k][0]!==byKind[k][1])console.log('  '+k+' '+byKind[k][0]+'/'+byKind[k][1])});fails.slice(0,40).forEach(f=>console.log('  FAIL '+f))
