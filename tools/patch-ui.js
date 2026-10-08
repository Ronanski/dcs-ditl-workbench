/* v1.16.1 WIP: the right panel has an AUTO width: never narrower than before (300 px), wider when its content needs it (up to 60 % of the window); inside one selection it only grows, so it does not jump while the numbers change. */
module.exports=(rep)=>{
rep(String.raw`body.an #anp{display:block;width:300px;flex:none;overflow:auto;`,String.raw`body.an #anp{display:block;width:min-content;min-width:300px;max-width:60vw;flex:none;overflow:auto;`);
rep(String.raw`function panelUpd(sel){const sh=cs();if(!sh||!sh.S)return;`,String.raw`function anpWidth(sel){if(anp.classList.contains('min'))return;if(sel||anp._mw==null){anp._mw=300;anp.style.minWidth='300px'}const w=Math.ceil(anp.scrollWidth)+2,mx=Math.floor(innerWidth*.6);if(w>anp._mw){anp._mw=Math.min(w,mx);anp.style.minWidth=anp._mw+'px'}}
function panelUpd(sel){const sh=cs();if(!sh||!sh.S)return;try{anpWidth(sel)}catch(e){}`);
rep(String.raw`function buildPanel(){const sh=cs(),S=sh.S;anp.innerHTML='';`,String.raw`function buildPanel(){const sh=cs(),S=sh.S;anp.innerHTML='';anp._mw=300;anp.style.minWidth='300px';`);
};
