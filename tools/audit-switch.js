/* every T switch (SW / AMT): pin labels, selectors, legs. Flags anything the 2-leg model cannot express. usage: node tools/audit-switch.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);const lab={},odd=[];let tot=0;
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 for(const b of S.blk){if(b.k!=='SW'&&b.k!=='AMT')continue;tot++;const ins=b.pins.filter(p=>p.role==='in');const labs=ins.map(p=>(p.lab||'-').toLowerCase());labs.forEach(l=>lab[l]=(lab[l]||0)+1);
  const legs=ins.filter(p=>/^[a-z]$/i.test(p.lab||'')),sels=ins.filter(p=>/^\d\s*:/.test(p.lab||'')),unl=ins.filter(p=>!p.lab);
  const prob=[];if(legs.length>2)prob.push('>2 legs');if(sels.some(p=>!/^\d\s*:\s*[ab]$/i.test(p.lab.replace(/\s/g,''))))prob.push('selector for another leg: '+sels.map(p=>p.lab).join(','));
  if(!sels.length&&b.sel<0)prob.push('no selector');if(b.a<0||b.b<0)prob.push('missing leg a='+b.a+' b='+b.b);if(unl.length&&unl.length!==ins.length-legs.length-sels.length)prob.push('unlabelled');
  if(prob.length)odd.push(r.name+' '+b.k+'#'+b.id+' ['+labs.join(',')+'] -> '+prob.join('; '))}}
console.log('T blocks',tot,' pin labels',JSON.stringify(lab));console.log('with something the 2-leg model cannot express:',odd.length);odd.forEach(x=>console.log('  '+x));
