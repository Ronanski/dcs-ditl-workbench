/* v1.15.2 WIP, T1: Trace follows the OUTPUTS into the sheets that receive them (before: only inputs jumped back to the source sheet).
   In the "Feeds" list every wire that leaves the sheet through a link gets an extra row "▶ continues in sheet X"; click = go to that sheet with the receiving wire selected (the trace goes on there, ↩ Back returns).
   The ◀ rows (inputs) now also select the sending wire on the source sheet. */
module.exports=(rep)=>{
rep(String.raw`r.onclick=()=>{if(x&&AN.sheets.indexOf(x.from)>=0&&AN.sheets.indexOf(x.from)!==AN.i){AN._bk=AN.i;go(AN.sheets.indexOf(x.from));return}AN.sel={net:n};selBox();paint();panelUpd(true)};return r};`,
String.raw`r.onclick=()=>{if(x&&AN.sheets.indexOf(x.from)>=0&&AN.sheets.indexOf(x.from)!==AN.i){const FS=x.from.S||ensure(x.from);AN._bk=AN.i;trJump(x.from,x.fromNets.find(m=>FS.drv[m].some(d=>d.k!=='LINK'))??x.fromNets[0]);return}AN.sel={net:n};selBox();paint();panelUpd(true)};return r};
 const xr=n=>{let ls=[];try{ls=(linksOf(sh)||[]).filter(l=>l.from===sh&&l.fromNets.includes(n))}catch(e){}return ls.map(l=>{const r=h$('div',{cls:'r tr',title:'Follow the signal into the next sheet (the trace goes on there; Back returns)'},[h$('span',{cls:'n',style:'color:#ff8ad8',txt:'   ▶ continues in sheet '+l.to.name+' (circle '+l.num+')'})]);r.onclick=()=>{AN._bk=AN.i;trJump(l.to,l.toNets[0])};return r})};`);
rep(String.raw`const cap=60;d.append(h$('small',{txt:'Driven by (upstream, blue glow): '`,String.raw`{const sn=AN.sel&&(AN.sel.net!=null?[AN.sel.net]:(AN.sel.blk?AN.sel.blk.o:[]));sn.forEach(n=>{if(S.xlk&&S.xlk[n])d.append(row(n));xr(n).forEach(r=>d.append(r))})}
 const cap=60;d.append(h$('small',{txt:'Driven by (upstream, blue glow): '`);
rep(String.raw`T.upL.slice(0,cap).forEach(n=>d.append(row(n)));`,String.raw`T.upL.slice(0,cap).forEach(n=>d.append(row(n),...xr(n)));`);
rep(String.raw`T.dnL.slice(0,cap).forEach(n=>d.append(row(n)));`,String.raw`T.dnL.slice(0,cap).forEach(n=>d.append(row(n),...xr(n)));`);
rep(String.raw`'This sheet only: use the ◀ rows to jump to the sheet an input comes from. Trace to other sheets going out is not done yet.'`,
String.raw`'◀ row = the input comes from another sheet, ▶ row = the signal goes on in another sheet: click it to follow the trace there (↩ Back returns).'`);
rep(String.raw`function whyTxt(S,b){`,String.raw`function trJump(tsh,net){const i=AN.sheets.indexOf(tsh);if(i<0)return;if(tsh!==cs()){const c0=cs();AN.hist.push({name:c0.name,view:(AN.av[c0.name]||[]).slice()});updBack()}go(i);const s2=cs();if(!s2||!s2.S)return;AN.sel={net};selBox();paint();panelUpd(true)}
function whyTxt(S,b){`);
rep(String.raw`Object.assign(AN,{go,cs,paint,fitView,settle,setCat,reset,ensure,pick,linksOf,actSet});`,String.raw`Object.assign(AN,{go,cs,paint,fitView,settle,setCat,reset,ensure,pick,linksOf,actSet,panelUpd,selBox});`);
};
