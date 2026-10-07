/* v1.10.1 -> v1.10.2 : manual numeric input (INPUT and FORCE) lost the typed value in Run mode. Cause: the 100 ms panel updater restores the field whenever it is not the focused element; pressing the check button moves focus to the button, the next tick overwrites the typed number (FORCE: with '' -> "Type a number first"; INPUT: with the old value -> nothing applied) before the click is processed. Fix: a real dirty/editing state per field. DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('archive/html/ditl-workbench-v1.10.1.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.10.1</title>','<title>DITL Logic Workbench v1.10.2</title>');
rep(`kind:'analog-project',ver:'1.10.1'`,`kind:'analog-project',ver:'1.10.2'`);
/* the editing state */
rep(`function forceCtl(S,sh,n){`,`/* a numeric field is DIRTY from the first typed character until it is committed (check / Enter / change), cancelled (Esc, release) or abandoned (2.5 s after it lost focus). The 100 ms updater never overwrites a dirty field. */
function anEdit(i){let tm=0;i._d=0;i._clr=()=>{i._d=0;clearTimeout(tm)};
 i.addEventListener('input',()=>{i._d=1;clearTimeout(tm)});i.addEventListener('focus',()=>clearTimeout(tm));
 i.addEventListener('blur',()=>{if(i._d){clearTimeout(tm);tm=setTimeout(()=>{i._d=0},2500)}});
 i.addEventListener('keydown',e=>{if(e.key==='Escape'){i._clr();i.blur()}});return i}
function forceCtl(S,sh,n){`);
/* FORCE */
rep(`const i=h$('input',{type:'number',step:'any',placeholder:'value'});i.style.width='74px';`,`const i=anEdit(h$('input',{type:'number',step:'any',placeholder:'value'}));i.style.width='74px';`);
rep(`const acc=()=>{const v=parseFloat(i.value);if(isFinite(v))setForce(sh,n,v);else msg('Type a number first, then press ✓')};`,`const acc=()=>{const v=parseFloat(i.value);if(isFinite(v)){i._clr();setForce(sh,n,v)}else msg('Type a number first, then press ✓')};`);
rep(`x.onclick=()=>{setForce(sh,n,undefined);i.value=''};`,`x.onclick=()=>{i._clr();setForce(sh,n,undefined);i.value=''};`);
rep(`const c=F[n];if(document.activeElement!==i)i.value=c===undefined?'':c;`,`const c=F[n];if(document.activeElement!==i&&!i._d)i.value=c===undefined?'':c;`);
/* INPUT */
rep(`const i=h$('input',{type:'number',step:'any'});i.value=S.rt.ext[n]||0;i.style.width='74px';`,`const i=anEdit(h$('input',{type:'number',step:'any'}));i.value=S.rt.ext[n]||0;i.style.width='74px';`);
rep(`const acc=()=>{const v=parseFloat(i.value);if(isFinite(v))setE(v);else msg('Type a number first, then press ✓')};`,`const acc=()=>{const v=parseFloat(i.value);if(isFinite(v)){i._clr();setE(v)}else msg('Type a number first, then press ✓')};`);
rep(`const u=()=>{if(document.activeElement!==i)i.value=S.rt.ext[n]||0;if(document.activeElement!==rg)rg.value=S.rt.ext[n]||0};`,`const u=()=>{if(document.activeElement!==i&&!i._d)i.value=S.rt.ext[n]||0;if(document.activeElement!==rg)rg.value=S.rt.ext[n]||0};`);
/* the other number boxes (panel lists: analog inputs, setpoints, transmitters) */
rep(`const num=(v,f,st)=>{const i=h$('input',{type:'number',step:st||'any'});i.value=v;i.onchange=()=>{const x=parseFloat(i.value);if(isFinite(x))f(x);else i.value=v};return i};`,`const num=(v,f,st)=>{const i=anEdit(h$('input',{type:'number',step:st||'any'}));i.value=v;i.onchange=()=>{i._clr();const x=parseFloat(i.value);if(isFinite(x))f(x);else i.value=v};return i};`);
rep(`if(document.activeElement!==inp&&document.activeElement!==rg){`,`if(document.activeElement!==inp&&!inp._d&&document.activeElement!==rg){`);
rep(`PU.push(()=>{if(document.activeElement!==i)i.value=S.rt.ext[n]||0;const ev=`,`PU.push(()=>{if(document.activeElement!==i&&!i._d)i.value=S.rt.ext[n]||0;const ev=`);
rep(`if(document.activeElement!==_i)_i.value=b.p.val`,`if(document.activeElement!==_i&&!_i._d)_i.value=b.p.val`);
fs.writeFileSync('ditl-workbench-v1.10.2.html',h);console.log('ok')
