/* High / low selector (HS, LS): only the SELECTED input is lit, the other input is dimmed (its wire, or its leg up to the first junction when the wire is shared), output = max / min.  usage: node tools/test-ui-hs.js file.html [out-prefix]
   Every HS / LS with two different inputs on every sheet. Both inputs are forced (A larger, then B larger). If the selector is idle (downstream T / AMT leg not selected) the first single T / AMT click that makes it live is found and recorded: that click is the manual step for the user. */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');const write=require('./lib-records.js');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
await p.evaluate(()=>{const r=[...document.querySelectorAll('#anbar button')].find(x=>/Run/.test(x.textContent));r&&r.click()});
const rec=await p.evaluate(()=>{const R=[];const lab=(S,n)=>(S.lab[n]&&S.lab[n].t)||('wire without address (net '+n+')');
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;AN.go(AN.sheets.indexOf(sh));const S=AN.ensure(sh);const rt=S.rt;rt.ramp=0;
  for(const b of S.blk.filter(q=>(q.k==='HS'||q.k==='LS')&&q.i.length===2&&new Set(q.i).size===2)){const ins=b.i;
   const base={sheet:sh.name,block:b.k+'#'+b.id+' at ('+Math.round(b.cx)+', '+Math.round(b.cy)+')',source:'HS = max, LS = min; unselected input dimmed like a T switch leg'};
   const paint=()=>{S._dk=null;AN.paint()};const live=()=>{paint();return !S._dead.has(b.o[0])};
   const apply=(va,vb)=>{rt.force[ins[0]]=va;rt.force[ins[1]]=vb;for(let k=0;k<8;k++)AN.settle()};
   apply(70,30);let how=null,swObj=null;
   if(live())how='default state';
   else{outer:for(const s of S.blk.filter(q=>q.k==='SW'||q.k==='AMT')){for(const leg of ['A','B']){const st=rt.st[s.id],old=st.fm;st.fm=leg;apply(70,30);if(live()){how={sw:s.k+'#'+s.id,leg,out:lab(S,s.o[0]),at:[Math.round(s.cx),Math.round(s.cy)]};swObj=s;st.fm=old;break outer}st.fm=old}}}
   if(!how){R.push({...base,input:'inputs '+ins.map(n=>lab(S,n)).join(' / '),expected:'-',actual:'selector idle in every single-switch state',status:'NOT TESTED',evidence:'no single T / AMT click makes the output live'});delete rt.force[ins[0]];delete rt.force[ins[1]];AN.settle();continue}
   if(swObj)rt.st[swObj.id].fm=how.leg;
   for(const [nm,va,vb] of [['first input larger',70,30],['second input larger',30,70]]){apply(va,vb);paint();const sel=(b.k==='HS')===(va>vb)?ins[0]:ins[1],oth=sel===ins[0]?ins[1]:ins[0],d=S._dead,legOf=n=>(AN.dbgL.legs||[]).filter(g=>g.b===b&&g.n===n);
    const dimOth=d.has(oth)||legOf(oth).some(g=>g.e.style.display!=='none'),litSel=!d.has(sel)&&legOf(sel).every(g=>g.e.style.display==='none'),out=rt.v[b.o[0]],expOut=b.k==='HS'?Math.max(va,vb):Math.min(va,vb);
    R.push({...base,input:nm+': '+lab(S,ins[0])+' = '+va+', '+lab(S,ins[1])+' = '+vb+(how==='default state'?'':' | T switch '+how.sw+' forced to leg '+how.leg+' (wire '+how.out+')'),expected:'output '+expOut+' ('+(b.k==='HS'?'max':'min')+'); lit: '+lab(S,sel)+'; dimmed: '+lab(S,oth),actual:'output '+out+'; selected lit='+litSel+'; other dimmed='+dimOth,status:dimOth&&litSel&&Math.abs(out-expOut)<1e-9?'PASS':'FAIL',evidence:'paint state of the wire / leg'})}
   if(swObj)rt.st[swObj.id].fm=undefined;delete rt.force[ins[0]];delete rt.force[ins[1]];AN.settle()}}
 return R});
const cnt=write(process.argv[3]||'docs/TEST-RESULTS-HS','High / low selector active-wire highlight - '+process.argv[2].split('/').pop(),rec,'');console.log(cnt,'errs',errs);await b.close()})();
