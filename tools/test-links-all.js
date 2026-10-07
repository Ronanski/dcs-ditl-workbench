/* Every link between sheets (numbered / letter / name+sheet / FROM-TO circles and signal tags) carries a signal: force the sending wire to 1 / 0 (digital) or 37.5 / 12.5 (analog) and read the receiving wire on the other sheet.  usage: node tools/test-links-all.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const res=await p.evaluate(()=>{const seen=new Set(),all=[];for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;try{AN.ensure(sh)}catch(e){continue}}
 for(const sh of AN.sheets){if(!sh.S)continue;for(const l of AN.linksOf(sh)){if(seen.has(l))continue;seen.add(l);all.push(l)}}
 const out={links:all.length,groups:0,carry:0,fail:[],stub:[],skipped:[]};
 /* one circle pair can appear several times (stub nets of the circles): a group passes when ONE of its links carries the signal to a wire that has consumers */
 const groups=new Map();for(const l of all){if(l.from===l.to)continue;const k=l.from.name+'>'+l.to.name+'|'+l.num+(l.tag?'|tag':'');if(!groups.has(k))groups.set(k,[]);groups.get(k).push(l)}
 for(const [k,ls] of groups){out.groups++;let carried=false,tried=false,why=[];
  for(const l of ls){const FS=l.from.S,TS=l.to.S;if(!FS||!TS)continue;
   const tn=l.toNets.find(n=>(TS.cns[n]||[]).length&&(TS.ext.includes(n)||(TS.xlk&&TS.xlk[n])));if(tn===undefined)continue;
   const dg=TS.nets[tn].dig,fn=l.fromNets.find(n=>(FS.drv[n]||[]).length&&FS.nets[n].dig===dg)??l.fromNets.find(n=>FS.ext.includes(n)&&FS.nets[n].dig===dg);if(fn===undefined){why.push(l.fromNets.some(n=>(FS.drv[n]||[]).length||FS.ext.includes(n))?'sending wire is '+(dg?'analog':'digital')+' but the receiving wire is '+(dg?'digital':'analog'):'no sending wire that is driven or a user input');continue}
   tried=true;const dig=FS.nets[fn].dig;let good=true;const rs=[];
   for(const val of dig?[1,0,1]:[37.5,12.5]){FS.rt.force[fn]=val;AN.go(AN.sheets.indexOf(l.from));for(let i=0;i<8;i++)AN.settle();AN.go(AN.sheets.indexOf(l.to));for(let i=0;i<12;i++)AN.settle();const got=TS.rt.v[tn];rs.push(val+'->'+(+got).toFixed(2));if(Math.abs(got-val)>1e-3)good=false}
   delete FS.rt.force[fn];if(good){carried=true;break}else why.push('['+rs.join(', ')+'] net'+fn+' -> net'+tn)}
  if(carried)out.carry++;else if(tried)out.fail.push(k+' '+why.join(' ; '));else out.stub.push(k+' '+(why.join(' ; ')||'no receiving wire with consumers on the target sheet'))}
 return out});
console.log('links',res.links,'| circle pairs / tag links (groups)',res.groups,'| carry the signal',res.carry,'| FAIL (receiver exists, value does not arrive)',res.fail.length,'| link ends with no wire that feeds anything',res.stub.length);res.fail.forEach(x=>console.log('  FAIL '+x));res.stub.forEach(x=>console.log('  stub '+x));console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
