/* the ONE version of a build = the number in the file name of the html at the repo root: logic-sim-vX.Y.Z.html
   usage: node tools/version.js            -> prints X.Y.Z
          node tools/version.js --github   -> also writes version / tag / html to $GITHUB_OUTPUT */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const v=s=>s.match(/v(\d+)\.(\d+)\.(\d+)/).slice(1).map(Number);
const files=fs.readdirSync(root).filter(f=>/^logic-sim-v\d+\.\d+\.\d+\.html$/.test(f)).sort((a,b)=>{const x=v(a),y=v(b);return x[0]-y[0]||x[1]-y[1]||x[2]-y[2]});
if(files.length!==1&&!process.argv.includes('--newest'))console.error('WARNING: expected exactly one logic-sim-v*.html at the root, found '+files.length+': '+files.join(', '));
if(!files.length){console.error('no logic-sim-vX.Y.Z.html at the repo root');process.exit(1)}
const f=files[files.length-1],ver=v(f).join('.');
if(process.argv.includes('--github')&&process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,`version=${ver}\ntag=v${ver}\nhtml=${f}\n`);
module.exports={ver,file:f,root};
if(require.main===module)console.log(ver);
