/* Tags that are a user input on one sheet but are DRIVEN on another sheet and are not linked (a signal that should arrive but does not). usage: node tools/audit-tags.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const res=await p.evaluate(()=>{const drv={},out=[];let nExt=0,nLinked=0;
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;let S;try{S=AN.ensure(sh)}catch(e){continue}AN.linksOf(sh);
  for(const nt of S.nets){const n=nt.id;const l=S.lab[n];if(!l||!(S.drv[n]||[]).some(d=>d.k!=='LINK'))continue;(drv[l.t]=drv[l.t]||[]).push(sh.name)}}
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;const S=sh.S;if(!S)continue;
  for(const n of S.ext){nExt++;if(S.xlk&&S.xlk[n]){nLinked++;continue}const l=S.lab[n];if(!l)continue;const t=l.t;const src=(drv[t]||[]).filter(x=>x!==sh.name);if(src.length)out.push(sh.name+' net'+n+' "'+t+'" is an input here, driven on '+src.join(', ')+' (not linked)')}}
 return {out,nExt,nLinked}});
console.log('user inputs (ext):',res.nExt,' fed from another sheet:',res.nLinked,' unlinked tags that ARE driven elsewhere:',res.out.length);res.out.forEach(x=>console.log('  '+x));await b.close()})();
