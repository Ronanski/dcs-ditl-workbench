/* contact sheet of several places of the drawings in one picture.  usage: node tools/shot-multi.js file.html out.png "ABC-005,353,500,50" "ABC-001C,577,330,50" ...   (sheet,x,y,width of the region in drawing units).  Every tile is labelled with its arguments. */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');const {execFileSync}=require('child_process');const fs=require('fs');const os=require('os');
(async()=>{const [f,out,...items]=process.argv.slice(2);const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1500,height:860}});
await p.goto('file://'+path.resolve(f));await p.waitForTimeout(2500);await p.click('text=Analog · ABC >> nth=0');await p.waitForTimeout(3500);
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'shotm-'));const files=[];let cur='';
for(let i=0;i<items.length;i++){const [sh,cx,cy,w]=items[i].split(',');if(sh!==cur){await p.evaluate(n=>AN.go(AN.sheets.findIndex(s=>s.name===n)),sh);await p.waitForTimeout(900);cur=sh}
 await p.evaluate(([cx,cy,w])=>{const h=w*725/960,v=[cx-w/2,-cy-h/2,w,h];AN.av[AN.cs().name]=v;document.getElementById('svg').setAttribute('viewBox',v.join(' '))},[+cx,+cy,+w]);await p.waitForTimeout(350);
 const fn=path.join(tmp,String(i).padStart(2,'0')+'.png');await p.screenshot({path:fn,clip:{x:240,y:112,width:960,height:725}});files.push(fn)}
await b.close();
const py=`import sys\nfrom PIL import Image,ImageDraw\nout=sys.argv[1];items=sys.argv[2].split('|');files=sys.argv[3:];n=len(files);cols=2 if n>1 else 1;rows=(n+cols-1)//cols;W,H=640,483\nim=Image.new('RGB',(cols*W,rows*H),(20,24,28));d=ImageDraw.Draw(im)\nfor i,f in enumerate(files):\n t=Image.open(f).resize((W,H));x=(i%cols)*W;y=(i//cols)*H;im.paste(t,(x,y));d.rectangle([x,y,x+W-1,y+H-1],outline=(90,100,110));d.rectangle([x,y,x+W-1,y+18],fill=(0,0,0));d.text((x+6,y+3),items[i],fill=(255,220,80))\nim.save(out)`;
const pf=path.join(tmp,'m.py');fs.writeFileSync(pf,py);execFileSync('python3',['-I',pf,out,items.join('|'),...files]);console.log('wrote',out,files.length,'tiles')})();
