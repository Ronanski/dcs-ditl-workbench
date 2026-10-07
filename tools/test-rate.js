/* Rate limiters (RATE) and ramps (RAMPB): step the main input, bypass 0: the output must move at the rate written on the drawing (or the rate input); bypass 1: it must follow at once.  usage: node tools/test-rate.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let tot=0,bad=0;
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 for(const b of S.blk){if(!['RATE','RAMPB'].includes(b.k))continue;tot++;const P=b.p||{};const o=b.o[0];const L=n=>(S.lab[n]&&S.lab[n].t)||('net'+n);
  const info=r.name+' '+b.k+'#'+b.id+' @'+Math.round(b.cx)+','+Math.round(b.cy)+' in '+L(b.main)+' byp '+(b.byp>=0?L(b.byp):'-')+' out '+(o!=null?L(o):'NONE')+' rate '+(b.up!==undefined?'from input '+L(b.up):P.rate);
  if(o==null||b.main==null||b.main<0){bad++;console.log('PROBLEM no main input / no output |',info);continue}
  const run=(x0,x1,byp,secs)=>{S.rt.force={};if(b.byp>=0)S.rt.force[b.byp]=0;S.rt.force[b.main]=x0;if(b.up!==undefined)S.rt.force[b.up]=1;if(b.dn!==undefined)S.rt.force[b.dn]=1;E.anSettle(S,5);for(let i=0;i<5;i++)E.anStep(S,.5);S.rt.force[b.main]=x1;if(b.byp>=0)S.rt.force[b.byp]=byp;const v0=S.rt.v[o];for(let i=0;i<secs*2;i++)E.anStep(S,.5);return [v0,S.rt.v[o]]};
  const rate=b.up!==undefined?1:P.rate;const secs=10;const [a0,a1]=run(0,1000,0,secs);const slope=(a1-a0)/secs;
  let ok=true,why='';
  if(!(rate>0)){if(a1<999){ok=false;why='rate 0 = no limit expected but output only reached '+a1.toFixed(2)}}
  else if(Math.abs(slope-rate)>rate*.05+1e-9){ok=false;why='slope '+slope.toExponential(2)+' per s, drawing says '+rate}
  if(b.byp>=0){const [c0,c1]=run(0,50,1,1);if(Math.abs(c1-50)>1e-6){ok=false;why+=' | bypass 1 does not follow ('+c1.toFixed(2)+')'}}
  if(!ok){bad++;console.log('PROBLEM '+why+' |',info)}}}
console.log('rate limiters / ramps tested:',tot,'problems:',bad);
