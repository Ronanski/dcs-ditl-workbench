/* F(X) input scaling (user 2026-10-10, findings 9 / 10 and the LN29 screenshot): a table whose X is in % ("RANGE (%)") takes its input as a PERCENT OF THE RANGE OF THE SIGNAL that feeds it:
   - the signal has a written range (AI / MAN / external input text): X = (value - lo) / (hi - lo) x 100   (LN1: MAN 8000 ~ 12000 Kcal/Kg; LN14: MAN -50 ~ 50 T/H; LN21: MAN 0.8 ~ 1.2)
   - the signal is a ratio (a / b, "1.0 (100%)"): X = ratio x 100                                           (LN29: SI0049 = a / b)
   - the signal is a PID output / already 0 ~ 100 %: X = value
   - the source cannot be traced to one of these without a guess: the value is NOT scaled and the block is flagged SCALE (NEEDS REVIEW) in the panel and with a "scale?" mark on the drawing.
   The output (Y) of the table stays as the LINEAR file gives it (ratio tables are already 0.8 ~ 1.2 = LY / 100). */
module.exports=(rep,repAll)=>{
rep(`function anFXs(P,x){`,`function anFXIn(S,b){const t=b.p&&b.p.tbl;if(!t||!/%/.test(t.xu||''))return null;
 const same=(p,q)=>p.k===q.k&&p.lo===q.lo&&p.hi===q.hi;
 const src=(S,n,d,seen)=>{const key=S.name+'|'+n;if(d>14||seen.has(key))return null;seen.add(key);const dr=(S.drv[n]||[]).find(q=>q.k!=='LINK');
  if(!dr){if(S.ext.includes(n)){/* a signal from another sheet: follow the link to the sheet that drives it */if(!S.xlk){const shh=AN.sheets.find(z=>z.S===S);if(shh)try{linksOf(shh)}catch(e){}}const l=S.xlk&&S.xlk[n];if(l&&l.from&&l.from.S){const FS=l.from.S,fn=l.fromNets.find(m=>(FS.drv[m]||[]).some(q=>q.k!=='LINK'));if(fn!==undefined){const q=src(FS,fn,d+1,seen);if(q)return q}}
    const r=anExtRange(S,n);return r?(r.lo===0&&r.hi===100?{k:'id'}:{k:'rng',lo:r.lo,hi:r.hi,u:r.u||''}):null}return null}
  const bl=dr.i===undefined&&dr.id!==undefined?S.blk.find(z=>z.id===dr.id):dr;if(!bl)return null;const k=bl.k;
  if(k==='PID'||k==='PIDV')return{k:'id'};
  if(k==='DIV')return{k:'ratio'};
  if(k==='AI'||k==='MAN'){const r=anNetRange(S,n);return r?(r.lo===0&&r.hi===100?{k:'id'}:{k:'rng',lo:r.lo,hi:r.hi,u:r.u||''}):null}
  if(k==='FX'){const y=bl.p&&bl.p.tbl&&bl.p.tbl.yr;return y&&y[0]===0&&y[1]===100?{k:'id'}:null}
  if(['LAG','LINK','RATE','RAMPB','ABS','LIM','HLIM','LLIM','AMT','SW','HS','LS','SEL'].includes(k)){let res=null;for(const m of bl.i){if(S.nets[m]&&S.nets[m].dig)continue;const q=src(S,m,d+1,seen);if(!q)continue;if(res&&!same(res,q))return null;res=q}return res}
  return null};
 return src(S,b.i[0],0,new Set())||{k:'?'}}
function anFXRe(sh){const S=sh.S;if(!S)return;for(const b of S.blk)if(b.k==='FX'&&b.p.tbl){const q=anFXIn(S,b);b.fxin=q&&q.k!=='?'&&q.k!=='id'?q:null;b.fxrev=!!(q&&q.k==='?')}}
function anFXs(P,x){`);
rep(`try{linksOf(sh)}catch(e){console.error(e)}drawSheet(sh);`,`try{linksOf(sh)}catch(e){console.error(e)}try{anFXRe(sh)}catch(e){console.error(e)}drawSheet(sh);`);
rep(`case 'FX':{const r=anFXs(P,rd(b.i[0]));s.fxs=r.st;out(r.y);break}`,`case 'FX':{let x=rd(b.i[0]);const q=b.fxin;if(q){if(q.k==='ratio')x=x*100;else if(q.k==='rng')x=(x-q.lo)/(q.hi-q.lo)*100}s.fxx=x;const r=anFXs(P,x);s.fxs=r.st==='OK'&&b.fxrev?'SCALE':r.st;out(r.y);break}`);
/* set after the table is known (ensure), before the first settle */
rep(`if(r.t)Object.defineProperty(b.p,'tbl',{value:r.t,writable:true,enumerable:false,configurable:true});`,`if(r.t){Object.defineProperty(b.p,'tbl',{value:r.t,writable:true,enumerable:false,configurable:true});const q=anFXIn(S,b);b.fxin=q&&q.k!=='?'&&q.k!=='id'?q:null;b.fxrev=!!(q&&q.k==='?')}`);
rep(`fs_==='NAN'?'the input is not a number':`,`fs_==='NAN'?'the input is not a number':fs_==='SCALE'?'the table takes a PERCENT of a range but the range of the source signal could not be traced without a guess: the input is NOT scaled':`);
rep(`if(b.k==='FX'&&!(b.p.tbl&&(b.p.tbl.p2||b.p.tbl.pts))&&!(window.ANLN&&window.ANLN[b.p.ln]))m.push([b.x0,b.y0,b.x1,b.y1,'no table']);`,`if(b.k==='FX'&&!(b.p.tbl&&(b.p.tbl.p2||b.p.tbl.pts))&&!(window.ANLN&&window.ANLN[b.p.ln]))m.push([b.x0,b.y0,b.x1,b.y1,'no table']);
  if(b.k==='FX'&&b.fxrev)m.push([b.x0,b.y0,b.x1,b.y1,'scale?']);`);
/* panel: how the input reaches the table */
rep(`  if(P.lnWarn)d.append(h$('small',{style:'color:#ffb24a',txt:'⚠ '+P.lnWarn}));`,`  if(P.lnWarn)d.append(h$('small',{style:'color:#ffb24a',txt:'⚠ '+P.lnWarn}));
  if(tb&&/%/.test(tb.xu||'')){const q=b.fxin;d.append(h$('small',{style:'display:block;color:'+(b.fxrev?'#ff6b6b':'#8fd3ff'),txt:q?(q.k==='ratio'?'Input to the table (%): ratio x 100 (1.0 = 100 %)':'Input to the table (%): (value - '+q.lo+') / ('+q.hi+' - '+q.lo+') x 100   [source range '+q.lo+' ~ '+q.hi+' '+q.u+']'):b.fxrev?'Input to the table (%): source range not traced - NOT scaled (NEEDS REVIEW)':'Input to the table (%): the source is already 0 ~ 100 %'}));const sx=(cs().S.rt.st[b.id]||{}).fxx;if(sx!==undefined)d.append(h$('small',{style:'display:block',txt:'Table X now: '+(+sx).toFixed(2)+' %'}))}`);
/* exposed for the verification tools */
rep(`Object.assign(AN,{go,cs,paint,`,`Object.assign(AN,{fxIn:anFXIn,netRange:anNetRange,extRange:anExtRange,go,cs,paint,`);
};
