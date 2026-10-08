/* Path (breadcrumbs) + signal map: many hops without getting lost. usage: node tools/test-path.js <html> */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');let fail=0;const ck=(n,ok,x)=>{console.log((ok?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!ok)fail++};
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1700,height:950}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await AN.data;const w=ms=>new Promise(r=>setTimeout(r,ms));const o={};
 const sel=async(name,net)=>{AN.go(AN.sheets.findIndex(s=>s.name===name));await w(120);AN.sel={net};AN.selBox();AN.paint();AN.panelUpd(true);await w(120)};
 /* 1. a deep chain: the link source whose map goes deepest; follow the route with the ▶ rows */
 let best=null;for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;let ls=[];try{ls=AN.linksOf(sh).filter(l=>l.from===sh)}catch(e){continue}for(const l of ls){const R=AN.trMap(sh,l.fromNets.slice(0,1)),mx=Math.max(...R.filter(x=>!x.again).map(x=>x.depth));if(!best||mx>best.mx)best={sh,l,R,mx}}}
 const R=best.R.filter(x=>!x.again),last=R.find(x=>x.depth===best.mx);const route=[last.sh.name];let cur=last;while(cur.depth>0){const pn=/^(ABC-[0-9A-Z]+)/.exec(cur.via)[1];cur=R.find(x=>x.sh.name===pn&&x.depth===cur.depth-1);route.unshift(cur.sh.name)}
 o.route=route;o.depth=best.mx;AN.allLegs=true;AN.trPath=[];AN.hist.length=0;await sel(route[0],best.l.fromNets[0]);o.start=route[0];
 for(let i=1;i<route.length;i++){const rows=[...document.querySelectorAll('#ansel .tr')].filter(x=>x.textContent.includes('continues in sheet '+route[i]+' ')||x.textContent.includes('▶ '+route[i]+' (circle'));if(!rows.length){o.stuck=route[i];break}rows[0].click();await w(180)}
 o.at=AN.cs().name;o.pathNow=(AN.trPath||[]).map(q=>q.name);o.hops=route.length-1;
 /* loop: go back to a sheet already in the path through a ▶ row if there is one: the path must be cut, not grow */
 const before=(AN.trPath||[]).length;
 const crumbs=[...document.querySelectorAll('#ansel button')].filter(x=>/Back to start/.test(x.textContent));o.hasStart=crumbs.length===1;
 if(crumbs.length){crumbs[0].click();await w(200)}o.afterStart=AN.cs().name;o.selAfter=!!AN.sel&&AN.sel.net===best.l.fromNets[0];
 /* 2. a crumb in the middle */
 await sel(route[0],best.l.fromNets[0]);AN.trPath=[];for(let i=1;i<route.length;i++){const rows=[...document.querySelectorAll('#ansel .tr')].filter(x=>x.textContent.includes('continues in sheet '+route[i]+' ')||x.textContent.includes('▶ '+route[i]+' (circle'));if(!rows.length)break;rows[0].click();await w(180)}
 const P=AN.trPath.map(q=>q.name);const mid=[...document.querySelectorAll('#ansel button')].filter(x=>x.title&&/Go back to this sheet/.test(x.title));o.crumbs=P;if(mid.length>=3){mid[1].click();await w(200);o.midAt=AN.cs().name;o.midExpected=P[1];o.pathAfterMid=AN.trPath.length}
 /* loop test: A -> B -> A: the sheet is not added twice */
 const sa=AN.sheets.find(s=>s.name==='ABC-003E'),la=AN.linksOf(sa).find(l=>l.from===sa&&l.to.name==='ABC-003B');await sel('ABC-003E',la.fromNets[0]);AN.trPath=[];[...document.querySelectorAll('#ansel .tr')].find(x=>x.textContent.includes('continues in sheet ABC-003B ')).click();await w(180);
 const back=[...document.querySelectorAll('#ansel .tr')].filter(x=>x.textContent.includes('continues in sheet ABC-003E '));o.loopRows=back.length;if(back.length){back[0].click();await w(180)}o.loopPath=(AN.trPath||[]).map(q=>q.name);
 /* 2b. the same in RUN mode (no Trace lists there): exits list, path, back to start, signal map */
 document.querySelector('button.on')&&0;[...document.querySelectorAll('button')].find(x=>/Run/.test(x.textContent)&&!/Pause/.test(x.textContent)&&x.offsetParent).click();await w(400);o.runMode=!AN.view&&AN.run;
 AN.trPath=[];AN.hist.length=0;await sel(route[0],best.l.fromNets[0]);o.runExits=/leaves the sheet/.test(document.getElementById('ansel').textContent);
 for(let i=1;i<route.length;i++){const rows=[...document.querySelectorAll('#ansel .tr')].filter(x=>x.textContent.includes('▶ '+route[i]+' (circle'));if(!rows.length){o.runStuck=route[i];break}rows[0].click();await w(200)}
 o.runAt=AN.cs().name;o.runPath=(AN.trPath||[]).map(q=>q.name);const rb=[...document.querySelectorAll('#ansel button')].find(x=>/Back to start/.test(x.textContent));if(rb){rb.click();await w(250)}o.runBack=AN.cs().name;
 const mb2=[...document.querySelectorAll('#ansel button')].find(x=>/Map: where does this signal go/.test(x.textContent));o.runMapBtn=!!mb2;o.runTrend=!!document.querySelector('#ansel canvas');o.runValues=AN.run;
 [...document.querySelectorAll('button')].find(x=>/Pause/.test(x.textContent)&&x.offsetParent).click();await w(200);
 /* 3. map for every link source: finishes, <=80 nodes, every sheet once */
 let maps=0,bad=[],maxN=0,t0=performance.now();for(const sh of AN.sheets){if(/ABC-000/.test(sh.name))continue;let ls=[];try{ls=AN.linksOf(sh).filter(l=>l.from===sh)}catch(e){continue}const seen=new Set();for(const l of ls){const k=l.fromNets.join(',');if(seen.has(k))continue;seen.add(k);try{const R=AN.trMap(sh,l.fromNets.slice(0,1));maps++;maxN=Math.max(maxN,R.length);const names=R.filter(x=>!x.again).map(x=>x.sh.name);if(new Set(names).size!==names.length||R.length>80)bad.push(sh.name+':'+l.num)}catch(e){bad.push(sh.name+':'+l.num+' '+e.message)}}}
 o.maps=maps;o.maxN=maxN;o.bad=bad.slice(0,5);o.ms=Math.round(performance.now()-t0);
 /* 4. the map in the panel */
 await sel('ABC-003E',la.fromNets[0]);const mb=[...document.querySelectorAll('#ansel button')].find(x=>/Map: where does this signal go/.test(x.textContent));o.mapBtn=!!mb;if(mb){mb.click();await w(200);o.mapLines=[...document.querySelectorAll('#ansel .tr')].filter(x=>/feeds|already listed/.test(x.textContent)).length}
 return o});
console.log(JSON.stringify(r));
ck('follows the deepest chain ('+r.depth+' hops) with the ▶ rows',r.hops>=2&&!r.stuck&&r.at===r.route[r.route.length-1],JSON.stringify(r.route));ck('path = the sheets visited, in order',JSON.stringify(r.pathNow)===JSON.stringify(r.route),JSON.stringify(r.pathNow));ck('A → B → A does not grow the path (cut back to A)',r.loopRows===0||(r.loopPath.length<=1),JSON.stringify(r.loopPath)+' rows back '+r.loopRows);
ck('one click "Back to start" returns to the first sheet and its wire',r.hasStart&&r.afterStart===r.start&&r.selAfter,r.afterStart+' '+r.hasStart);
ck('a crumb in the middle returns there and drops the rest',r.midAt===r.midExpected&&r.pathAfterMid===2,JSON.stringify([r.midAt,r.midExpected,r.pathAfterMid]));
ck('signal map for every link source (each sheet once, <= 80 lines)',r.maps>100&&r.bad.length===0,r.maps+' maps, max '+r.maxN+' lines, '+r.ms+' ms '+JSON.stringify(r.bad));
ck('RUN mode: exits list, follows the whole route, Back to start, map button, NO trend on a wire (user rule), still running',r.runMode&&r.runExits&&!r.runStuck&&r.runAt===r.route[r.route.length-1]&&r.runBack===r.route[0]&&r.runMapBtn&&!r.runTrend,JSON.stringify([r.runMode,r.runExits,r.runStuck,r.runAt,r.runBack,r.runMapBtn,r.runTrend]));ck('signal map in the panel',r.mapBtn&&r.mapLines>=4,r.mapLines);ck('no page errors',errs.length===0,errs.slice(0,3).join('|'));console.log(fail?fail+' FAIL':'ALL PASS');await b.close();process.exit(fail?1:0)})();
