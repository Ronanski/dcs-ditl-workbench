/* v1.20.10: F(X) tables whose X is in %: the input is a percent of the range of the source signal (user findings 9 / 10, LN29 screenshot).  usage: node tools/test-fxscale.js file.html */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const R=await p.evaluate(()=>{const out=[];const run=(sheet,id,cases)=>{AN.go(AN.sheets.findIndex(s=>s.name===sheet));const S=AN.cs().S,x=S.blk.find(z=>z.id===id);
  for(const [raw,exp,why] of cases){S.rt.force[x.i[0]]=raw;for(let k=0;k<8;k++)AN.settle();const act=S.rt.v[x.o[0]],st=(S.rt.st[x.id]||{}).fxs,xx=(S.rt.st[x.id]||{}).fxx;delete S.rt.force[x.i[0]];
   out.push({n:sheet+' '+x.p.ln+' input '+raw+' -> table X '+(+xx).toFixed(2)+' %',exp,act,ok:Math.abs(act-exp)<1e-6&&st==='OK',st,why})}};
 run('ABC-002',43,[[1.0,50,'ratio 1.0 = 100 % (the user\'s screenshot: was 0.00)'],[0.8,0,'80 %'],[1.2,100,'120 %']]);
 run('ABC-002',70,[[8000,0.8,'MAN 8000 ~ 12000 Kcal/Kg: low = 0 %'],[10000,1.0,'50 %'],[12000,1.2,'100 %']]);
 run('ABC-002',46,[[-50,-30,'MAN -50 ~ 50 T/H'],[0,0,'50 %'],[50,30,'100 %']]);
 run('ABC-002',74,[[-4,-4,'MAN -4 ~ 4 %'],[0,0,''],[4,4,'']]);
 run('ABC-003A',68,[[0.8,0.8,'MAN 0.8 ~ 1.2 ratio range'],[1.0,1.0,''],[1.2,1.2,'']]);
 AN.go(AN.sheets.findIndex(s=>s.name==='ABC-051'));const S5=AN.cs().S,f=S5.blk.find(z=>z.id===48);S5.rt.force[f.i[0]]=50;for(let k=0;k<8;k++)AN.settle();const st5=(S5.rt.st[48]||{}).fxs;delete S5.rt.force[f.i[0]];
 out.push({n:'ABC-051 LN33 (source range not traced)',exp:'SCALE',act:st5,ok:st5==='SCALE',st:st5,why:'flagged NEEDS REVIEW, not guessed'});
 return out});
let bad=0;for(const r of R){console.log((r.ok?'PASS ':'FAIL ')+r.n+'  expected '+r.exp+'  actual '+r.act+'  ('+r.why+')');if(!r.ok)bad++}
console.log(bad?'FAILED '+bad:'ALL PASS',errs.length?errs:'');await b.close();process.exit(bad?1:0)})();
