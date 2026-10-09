/* CONTINUITY of every analog address / tag of the 51 ABC sheets (user 2026-10-09): each must RECEIVE a value (a real driver, a circle / tag link to a source, a manual input or a link from another sheet) and GIVE it on (a block input, a circle to another sheet, a DITL output). Lists the ones that do not. usage: node tools/audit-continuity.js <html> [--list] */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await(await b.newContext({viewport:{width:1700,height:950}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;const out={n:0,noSrc:[],noSink:[],ok:0};
 for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;AN.go(AN.sheets.indexOf(sh));await new Promise(r=>setTimeout(r,300));const S=sh.S,L=AN.dbgL;if(!S||!L||!L.addrRep)continue;
  const sinkNets=new Set();for(const c of(S.conn||[]).concat(S.xc||[]))if(c.sink)(c.nets||[]).forEach(n=>sinkNets.add(n));
  const srcOf=n=>{const seen=new Set();let g=0;while(g++<30&&!seen.has(n)){seen.add(n);if((S.drv[n]||[]).some(d=>d.k!=='LINK'))return 'driver';if(S.ext.includes(n))return (S.xlk&&S.xlk[n])?'sheet-link':'input';const l=(S.link||[]).find(x=>x[0]===n);if(!l)break;n=l[1]}return null};
  const pinSink=m=>S.blk.some(b=>b.pins&&b.pins.some(p=>p.n===m&&p.role!=='out'));const hasSink=n=>{const seen=new Set([n]),q=[n];while(q.length){const m=q.pop();if((S.cns[m]||[]).length||pinSink(m))return true;if(sinkNets.has(m))return true;for(const[d,s2]of S.link||[])if(s2===m&&!seen.has(d)){seen.add(d);q.push(d)}}return false};
  const done=new Set();for(const x of L.addrRep){const k=x.n+'|'+x.t;if(done.has(k))continue;done.add(k);out.n++;const fieldAI=x.b&&x.b.ai!=null;const s=fieldAI?'field':srcOf(x.n),k2=fieldAI?true:hasSink(x.n);let bad=false;if(!s){out.noSrc.push(sh.name+' '+x.t+' net'+x.n+' @'+Math.round(x.x)+','+Math.round(x.y));bad=true}if(!k2){out.noSink.push(sh.name+' '+x.t+' net'+x.n+' @'+Math.round(x.x)+','+Math.round(x.y));bad=true}if(!bad)out.ok++}}
 return out});
const why=l=>/ FIQ\w+/.test(l)?'totalizer display (SUMA output: no consumer drawn)':/ AO\d+ net/.test(l)?'output to the field / TCS':/ ABC-052 SI0196| ABC-052 SI0254/.test(' '+l)?'SET value => TAG.SV instruction (wire ends at the SET contact)':/ ABC-002 SI0061/.test(' '+l)?'second copy of an address (follows the driven wire)':null;
const expl=r.noSink.filter(l=>why(l)),unex=r.noSink.filter(l=>!why(l));
console.log(JSON.stringify({analogAddresses:r.n,continuityOk:r.ok+expl.length,noSource:r.noSrc.length,noSinkExplained:expl.length,noSinkUnexplained:unex.length}));
console.log('no source:',r.noSrc.join(' | ')||'none');console.log('no sink, explained:',expl.map(l=>l.replace(/ net\d+ @.*/,'')+' ['+why(l)+']').join(' | '));console.log('no sink, UNEXPLAINED:',unex.join(' | ')||'none');
if(process.argv.includes('--list'))console.log(r.noSrc.concat(unex).join('\n'));
require('fs').writeFileSync('/tmp/cont.json',JSON.stringify({noSrc:r.noSrc,noSink:r.noSink}));await b.close();process.exit(r.noSrc.length||unex.length?1:0)})();
