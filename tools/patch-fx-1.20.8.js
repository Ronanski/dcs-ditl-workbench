/* Group A (LINEAR FX): no silent pass-through, no silent clamp.
   anFXs(P,x) -> {y,st}. st: 'OK' | 'NOTABLE' (no table or no points: y = x is only a placeholder, the block is NEEDS REVIEW) | 'OUT' (x outside the domain of the table: the end value is held, the block is NEEDS REVIEW) | 'NAN' (input not a number). A table chosen with a warning (lnWarn: station fallback) is NEEDS REVIEW too. The status is stored in the block state (S.rt.st[id].fxs) and shown in the block panel and in the Health table. The table points are in the units of the table (xu / yu of the LINEAR file); the table domain already includes its own extension beyond the range (for % tables -20 .. 120). */
module.exports=(rep)=>{
rep(`function anFX(P,x){const ln=P.ln,t=((typeof window!=='undefined'&&window.ANLN)||{})[ln]||(P.tbl&&(P.tbl.p2||P.tbl.pts));if(!t||!t.length)return x;if(x<=t[0][0])return t[0][1];`,
`function anFXs(P,x){const ln=P.ln,t=((typeof window!=='undefined'&&window.ANLN)||{})[ln]||(P.tbl&&(P.tbl.p2||P.tbl.pts));if(!t||!t.length)return{y:x,st:'NOTABLE'};if(!(x===x))return{y:x,st:'NAN'};const w=P.lnWarn&&!(typeof window!=='undefined'&&window.ANLN&&window.ANLN[ln])?'WARN':'OK';if(x<t[0][0])return{y:t[0][1],st:'OUT'};if(x>t[t.length-1][0])return{y:t[t.length-1][1],st:'OUT'};return{y:anFX(P,x),st:w}}
function anFX(P,x){const ln=P.ln,t=((typeof window!=='undefined'&&window.ANLN)||{})[ln]||(P.tbl&&(P.tbl.p2||P.tbl.pts));if(!t||!t.length)return x;if(x<=t[0][0])return t[0][1];`);
rep(`case 'FX':out(anFX(P,rd(b.i[0])));break;`,`case 'FX':{const r=anFXs(P,rd(b.i[0]));s.fxs=r.st;out(r.y);break}`);
/* export for the tests */
rep(`anCompile,anInit,anFX,anStep,`,`anCompile,anInit,anFX,anFXs,anStep,`);
/* panel: red NEEDS REVIEW line */
rep(`if(P.lnWarn)d.append(h$('small',{style:'color:#ffb24a',txt:'⚠ '+P.lnWarn}));`,`if(P.lnWarn)d.append(h$('small',{style:'color:#ffb24a',txt:'⚠ '+P.lnWarn}));
   {const fs_=(cs().S.rt.st[b.id]||{}).fxs,why=fs_==='NOTABLE'?'no table: the output is only a placeholder (y = x), it is NOT a converted value':fs_==='OUT'?'the input is outside the domain of the table: the end value of the table is held':fs_==='NAN'?'the input is not a number':P.lnWarn?'the table was chosen with a warning (see above)':'';if(why)d.append(h$('div',{style:'color:#ff6b6b;font-weight:bold;margin:3px 0',txt:'NEEDS REVIEW: '+why}))}`);
/* Health table: one more column */
rep(`['Sheet','Blocks','External inputs','Unknown shapes','Pin issues']`,`['Sheet','Blocks','External inputs','Unknown shapes','Pin issues','LINEAR review']`);
rep(`h$('td',{cls:o.h.issues.length?'bad':'',txt:o.h.issues.length}))}`,`h$('td',{cls:o.h.issues.length?'bad':'',txt:o.h.issues.length}),(()=>{const n=o.sh.S.blk.filter(q=>q.k==='FX'&&(!(q.p.tbl&&(q.p.tbl.p2||q.p.tbl.pts))&&!(window.ANLN&&window.ANLN[q.p.ln])||q.p.lnWarn)).length;return h$('td',{cls:n?'bad':'',title:'FX blocks without a table or with a table chosen by a warning = NEEDS REVIEW',txt:n})})())}`);
};
