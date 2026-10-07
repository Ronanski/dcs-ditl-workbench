/* Do the wires on the screen show what the simulation computes? For every sheet, 3 input patterns: digital wire is lit (live colour) only when its value is 1 and grey when 0 (or when a T switch has cut it off); analog wires are coloured; a wire that is forced is marked.  usage: node tools/test-paint.js file.html [sheet-filter] */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const flt=process.argv[3]||'';await p.evaluate(()=>{AN.view=false});
const n=await p.evaluate(()=>AN.sheets.length);let tot={sheets:0,dig:0,lit1:0,grey0:0,litWrong:0,greyWrong:0,greyCut:0,ana:0,anaGrey:0,noEl:0},bad=[];
for(let i=0;i<n;i++){const info=await p.evaluate(i=>({name:AN.sheets[i].name}),i);if(/ABC-000/.test(info.name)||(flt&&!info.name.includes(flt)))continue;tot.sheets++;
 for(const seed of [1,2,3]){
  const r=await p.evaluate(([i,seed])=>{AN.go(i);const sh=AN.cs(),S=sh.S;let x=seed*7919;const rnd=()=>{x=(x*1103515245+12345)&0x7fffffff;return x/0x7fffffff};
   S.rt.force={};for(const k of S.ext){if(S.xlk&&S.xlk[k])continue;if(S.nets[k].dig)S.rt.ext[k]=rnd()>.5?1:0;else S.rt.ext[k]=rnd()*100}
   for(let t=0;t<30;t++)AN.settle();
   const L=AN.dbgL;const out={dig:0,lit1:0,grey0:0,litWrong:[],greyWrong:[],greyCut:0,ana:0,anaGrey:0,noEl:0};
   if(!L)return {err:'no layer'};
   for(const nt of S.nets){if(!nt.segs.length||nt.pn)continue;const e=L.nets[nt.id];if(!e){out.noEl++;continue}const c=e.getAttribute('stroke'),v=S.rt.v[nt.id];
    if(nt.dig){out.dig++;const lit=c!=='#3b4651';const one=v>.5;
     if(lit&&one)out.lit1++;else if(!lit&&!one)out.grey0++;else if(lit&&!one)out.litWrong.push(sh.name+' net'+nt.id+' value '+v+' is drawn lit');else{out.greyCut++;out.cutList=(out.cutList||[]);out.cutList.push(sh.name+' net'+nt.id+' value 1 drawn grey; drivers '+(S.drv[nt.id]||[]).map(d=>d.k+'#'+d.id).join(',')+' consumers '+(S.cns[nt.id]||[]).map(d=>d.k+'#'+d.id).join(','))}}
    else{out.ana++;if(c==='#3b4651')out.anaGrey++}}
   return out},[i,seed]);
  if(r.err){bad.push(info.name+': '+r.err);continue}
  tot.dig+=r.dig;tot.lit1+=r.lit1;tot.grey0+=r.grey0;tot.greyCut+=r.greyCut;tot.ana+=r.ana;tot.anaGrey+=r.anaGrey;tot.noEl+=r.noEl;tot.litWrong+=r.litWrong.length;(r.cutList||[]).forEach(x=>{if(!bad.includes(x))bad.push(x)});r.litWrong.slice(0,3).forEach(x=>bad.push(x))}}
console.log(JSON.stringify(tot));console.log('lit but value 0:',tot.litWrong,'| grey with value 1 (cut off by a T switch / not selected):',tot.greyCut,'| nets without a drawn wire:',tot.noEl);bad.slice(0,20).forEach(x=>console.log('  '+x));console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
