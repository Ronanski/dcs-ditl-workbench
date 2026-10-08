/* v1.18.x WIP: the right panel has a FIXED width (380 px, a little wider than the old 300 px, user 2026-10-08: "wag na autofit"); every text wraps, nothing runs outside the panel.
   Number boxes: the up / down arrows (and the arrow keys) must APPLY the value like Enter does (user: "pag nagppindot ka ng up/down hindi sync"): the arrow changes the box and the engine / Trend / HMI still showed the old value, because the boxes only applied on Enter or on the check button. */
module.exports=(rep)=>{
rep(String.raw`body.an #anp{display:block;width:300px;flex:none;overflow:auto;`,String.raw`body.an #anp{display:block;width:380px;flex:none;overflow-x:hidden;overflow-y:auto;overflow-wrap:anywhere;word-break:break-word;`);
rep(String.raw`#anp .r>span.n{flex:1;min-width:90px;word-break:break-all}`,String.raw`#anp .r>span.n{flex:1;min-width:90px;word-break:break-all}
#anp *{max-width:100%;box-sizing:border-box;overflow-wrap:anywhere}
#anp canvas,#anp svg{max-width:100%}
#anp input[type=number]{min-width:0}
#anp .fc,#anp .r,#anp .ph{flex-wrap:wrap}
#anp small,#anp div,#anp span{white-space:normal}`);
/* arrows of a number box apply the value */
rep(String.raw`function anEdit(i){let tm=0;i._d=0;i._clr=()=>{i._d=0;clearTimeout(tm)};
 i.addEventListener('input',()=>{i._d=1;clearTimeout(tm)});`,String.raw`function anEdit(i){let tm=0;i._d=0;i._clr=()=>{i._d=0;clearTimeout(tm)};
 i.addEventListener('input',e=>{i._d=1;clearTimeout(tm);if(!e.inputType||!/^(insert|delete|history)/.test(e.inputType)){/* spinner arrows / arrow keys: apply now, like Enter */const ok=i.parentNode&&[...i.parentNode.querySelectorAll('button')].find(b=>b.textContent==='✓');if(ok)ok.click();else i.dispatchEvent(new Event('change'))}});`);
};
