/* browser test: cross-sheet tag links exist, values flow source -> target, no JS errors. usage: node test-links.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1400,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+require('path').resolve(process.argv[2]));await p.waitForTimeout(3000);
await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(5000);
const r=await p.evaluate(()=>{const o={sheets:AN.sheets.length,tagLinks:0,circleLinks:0,computed:0,ext:0,samples:[],flow:null};
 for(const sh of AN.sheets){const S=AN.ensure(sh);const L=AN.linksOf(sh);for(const l of L){if(l.to!==sh)continue;l.tag?o.tagLinks++:o.circleLinks++}o.ext+=S.ext.length;o.computed+=Object.keys(S.xlk||{}).length}
 // flow test: first digital tag link
 for(const sh of AN.sheets){const l=(sh.lk||[]).find(q=>q.tag&&q.to===sh&&sh.S.nets[q.toNets[0]].dig);if(!l)continue;
  const FS=l.from.S,TS=sh.S,fn=l.fromNets[0],tn=l.toNets[0];
  const res=[];for(const val of [1,0,1]){FS.rt.force[fn]=val;for(let i=0;i<8;i++)AN.settle&&0;AN.go(AN.sheets.indexOf(sh));for(let i=0;i<10;i++){/*step via public path*/AN.settle()}res.push({set:val,target:TS.rt.v[tn]})}
  delete FS.rt.force[fn];o.flow={tag:l.num,from:l.from.name,to:sh.name,res};break}
 return o});
console.log(JSON.stringify(r,null,1));console.log('ERRS',errs.length,errs.slice(0,5));await b.close()})();
