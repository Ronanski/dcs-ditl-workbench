/* link circles: how many two-line circles found / linked, which are not, and does a value cross the link? usage: node test-circles.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(process.argv[2]));await p.waitForTimeout(3000);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(4000);await p.evaluate(()=>{if(AN.view)document.querySelector('button[title^=\"View mode\"]').click()});
const r=await p.evaluate(()=>{let tot=0,nol=0,lk=0,circ=0;const bad=[];for(const sh of AN.sheets){const S=AN.ensure(sh);const L=AN.linksOf(sh);for(const c of S.xc||[]){tot++;if(c.nolink){nol++;bad.push(sh.name+' #'+c.num+' -> '+c.tgt)}}lk+=L.filter(l=>l.to===sh&&!l.tag).length}
 // propagation test on the first digital circle link whose source net has a driver
 let flow=null;for(const sh of AN.sheets){const l=(sh.lk||[]).find(q=>!q.tag&&q.to===sh&&sh.S.nets[q.toNets[0]].dig&&q.from.S.drv[q.fromNets.find(n=>q.from.S.drv[n].length)??q.fromNets[0]].length);if(!l)continue;
  const FS=l.from.S,TS=sh.S,fn=l.fromNets.find(n=>FS.drv[n].length)??l.fromNets[0],tn=l.toNets[0];const res=[];AN.go(AN.sheets.indexOf(sh));for(const val of [1,0,1]){FS.rt.force[fn]=val;for(let i=0;i<10;i++)AN.settle();res.push(TS.rt.v[tn])}delete FS.rt.force[fn];flow={num:l.num,from:l.from.name,to:sh.name,res};break}
 return {tot,nol,lk,bad,flow}});
console.log('two-line circles',r.tot,'| NOT linked',r.nol,'| links made',r.lk);console.log(r.bad.join(' ; '));console.log('flow test',JSON.stringify(r.flow));console.log('errs',errs);await b.close()})();
