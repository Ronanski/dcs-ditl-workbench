/* copies the newest ../ditl-workbench-vX.Y.Z.html into ui/index.html (the app shows exactly that file) */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const v=s=>s.match(/v(\d+)\.(\d+)\.(\d+)/).slice(1).map(Number);
const files=fs.readdirSync(root).filter(f=>/^ditl-workbench-v\d+\.\d+\.\d+\.html$/.test(f)).sort((a,b)=>{const x=v(a),y=v(b);return x[0]-y[0]||x[1]-y[1]||x[2]-y[2]});
if(!files.length)throw new Error('no ditl-workbench-v*.html found in '+root);
const f=files[files.length-1];fs.mkdirSync(path.join(__dirname,'ui'),{recursive:true});
fs.copyFileSync(path.join(root,f),path.join(__dirname,'ui','index.html'));console.log('UI =',f);
