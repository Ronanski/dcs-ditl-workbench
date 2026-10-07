/* v1.11.1 -> v1.12.0 : NEW NAME logic-sim-vX.Y.Z (html, exe, apk all carry the same version, one GitHub Release per version). Inside the html the version is read from <title>, so it is changed in ONE place only. DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('archive/html/ditl-workbench-v1.11.1.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.11.1</title>','<title>Logic Sim v1.12.0</title>');
rep(`ver:'1.11.1'`,`ver:(document.title.match(/v([\\d.]+)/)||[])[1]||''`);
rep(`P('app','DITL Workbench v1.10.1')`,`P('app',document.title)`);
fs.writeFileSync('logic-sim-v1.12.0.html',h);console.log('ok')
