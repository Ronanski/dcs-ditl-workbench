/* every T switch: drive the legs with different values, drive each selector, the output must be the leg named by the selector label ("1:b" = leg b), and the lit letter (rt.st.pk) must agree. usage: node tools/test-switch.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let ok=0,skip=0;const bad=[];
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 for(const b of S.blk){if(b.k!=='SW'&&b.k!=='AMT')continue;const ins=b.pins.filter(p=>p.role==='in');
  const leg=l=>ins.find(p=>(p.lab||'').toLowerCase()===l);const A=leg('a'),B=leg('b');const ctl=ins.filter(p=>/^\d\s*:\s*[ab]$/i.test((p.lab||'').replace(/\s/g,'')));
  if(!A||!B||!ctl.length||!b.o.length||A.n===B.n){skip++;continue}
  const dig=S.nets[A.n].dig;const va=dig?1:11,vb=dig?0:22;let all=true;const why=[];
  const reset=()=>{for(const p of ins)delete S.rt.force[p.n]};
  for(const c of ctl){const want=/b$/i.test(c.lab.replace(/\s/g,''))?B:A;const other=want===A?B:A;
   for(const[x,y]of dig?[[1,0],[0,1]]:[[11,22]]){reset();for(const q of ctl)S.rt.force[q.n]=0;S.rt.force[A.n]=x;S.rt.force[B.n]=y;S.rt.force[c.n]=1;E.anSettle(S,8);
    const out=S.rt.v[b.o[0]],exp=want===A?x:y,pk=(S.rt.st[b.id]||{}).pk;
    if(Math.abs(out-exp)>1e-6){all=false;why.push('control '+c.lab+' -> out '+out+' expected '+exp+' (leg '+(want===A?'a':'b')+')')}
    if(pk&&pk!==(want===A?'A':'B')){all=false;why.push('lit letter '+pk+' expected '+(want===A?'A':'B'))}}}
  reset();if(all)ok++;else bad.push(r.name+' '+b.k+'#'+b.id+': '+why.slice(0,2).join('; '))}}
// pass 2: model level (all switches incl. COS manual leg and y/n): control c.A selects leg a, otherwise leg b
let ok2=0,skip2=0;const bad2=[];
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 for(const b of S.blk){if(b.k!=='SW'&&b.k!=='AMT')continue;if(b.a<0||b.b<0||!b.cs||!b.cs.length||!b.o.length||b.a===b.b){skip2++;continue}
  const dig=S.nets[b.a].dig;let all=true;
  for(const c of b.cs){for(const[x,y]of dig?[[1,0],[0,1]]:[[11,22]]){for(const q of b.cs)S.rt.force[q.n]=0;S.rt.force[b.a]=x;S.rt.force[b.b]=y;S.rt.force[c.n]=1;E.anSettle(S,8);const out=S.rt.v[b.o[0]],exp=c.A?x:y;if(Math.abs(out-exp)>1e-6)all=false;delete S.rt.force[c.n]}}
  for(const q of b.cs)delete S.rt.force[q.n];delete S.rt.force[b.a];delete S.rt.force[b.b];if(all)ok2++;else bad2.push(r.name+' '+b.k+'#'+b.id)}}
console.log('model level (all T with 2 legs + a control, incl. COS leg):',ok2,'ok',bad2.length,'problems',skip2,'not testable');bad2.forEach(x=>console.log('  '+x));
console.log('T switches that pick the leg named by their selector:',ok,' problems:',bad.length,' not testable (no a/b/selector pins):',skip);bad.forEach(x=>console.log('  '+x));
