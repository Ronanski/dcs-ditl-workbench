/* copies the newest ../logic-sim-vX.Y.Z.html into www/index.html and injects the Android file bridge (window.nativeFS: Save = Android share sheet, Open = file chooser).
   Same names as the desktop app, so the html needs no Android-only code. */
const fs=require('fs'),path=require('path');
const {ver,file,root}=require('../tools/version.js');
const bridge=`<script>/* Logic Sim Android bridge */
(function(){var C=window.Capacitor;if(!C||!C.Plugins)return;var P=C.Plugins;
 window.nativeFS={
  save:async function(path,text,suggested){var name=String(suggested||'logic-sim-project.json').replace(/[^\\w.\\- ]+/g,'_');
   await P.Filesystem.writeFile({path:name,data:text,directory:'CACHE',encoding:'utf8'});
   var u=await P.Filesystem.getUri({path:name,directory:'CACHE'});
   try{await P.Share.share({title:name,files:[u.uri],dialogTitle:'Save the project file (choose Files / Drive)'})}catch(e){return null}
   return{path:name,name:name}},
  open:function(){return new Promise(function(res){var i=document.createElement('input');i.type='file';i.accept='.json,.dcsproj,application/json';
   i.onchange=async function(){var f=i.files&&i.files[0];if(!f)return res(null);res({path:f.name,name:f.name,text:await f.text()})};i.click()})}
 }})();
</script>`;
let h=fs.readFileSync(path.join(root,file),'utf8');
const i=h.indexOf('<head>');if(i<0)throw new Error('no <head> in the html');
h=h.slice(0,i+6)+bridge+h.slice(i+6);
fs.mkdirSync(path.join(__dirname,'www'),{recursive:true});fs.writeFileSync(path.join(__dirname,'www','index.html'),h);
fs.writeFileSync(path.join(__dirname,'VERSION.txt'),ver);
console.log('www/index.html =',file,'| version',ver);
