/* Test helpers: pull the ANALOG engine and the built-in analog sheets out of a workbench html file. */
const fs=require('fs'),zlib=require('zlib');
function load(file){
 const h=fs.readFileSync(file,'utf8');
 const a=h.indexOf('<script id="analogjs">'),b=h.indexOf('</script>',a);
 const js=h.slice(a+'<script id="analogjs">'.length,b);
 const cut=js.indexOf('/* ===== v29 ANALOG UI');
 const m={exports:{}};new Function('module',js.slice(0,cut>0?cut:js.length).replace(/^\s*\(function\(\)\{/,''))(m);
 const p=h.indexOf('<script type="text/plain" id="apre">'),q=h.indexOf('</script>',p);
 const b64=h.slice(p+'<script type="text/plain" id="apre">'.length,q).trim();
 const rows=zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l));
 return {E:m.exports,rows,html:h};
}
function build(E,sh){const S=E.anWire(E.anModel(E.anNets(E.anBuild(sh.R,sh.name))));E.anCompile(S);E.anInit(S);return S}
module.exports={load,build};
