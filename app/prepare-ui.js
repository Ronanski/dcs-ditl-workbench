/* copies the newest ../logic-sim-vX.Y.Z.html into ui/index.html and puts the SAME version into package.json (exe name = logic-sim-vX.Y.Z-portable.exe) */
const fs=require('fs'),path=require('path');
const {ver,file,root}=require('../tools/version.js');
fs.mkdirSync(path.join(__dirname,'ui'),{recursive:true});
fs.copyFileSync(path.join(root,file),path.join(__dirname,'ui','index.html'));
const pj=path.join(__dirname,'package.json'),p=JSON.parse(fs.readFileSync(pj,'utf8'));p.version=ver;fs.writeFileSync(pj,JSON.stringify(p,null,2)+'\n');
console.log('UI =',file,'| version',ver);
