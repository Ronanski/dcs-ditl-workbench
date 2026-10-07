/* usage: node crop.js html sheet x0 y0 x1 y1 out.png  -> picture of a region: wires coloured by net, red ring = unconnected end */
const {load,build}=require('./lib.js');const {chromium}=require('/opt/node-tools/node_modules/playwright');
const [f,nm,x0,y0,x1,y1,out]=process.argv.slice(2);const {E,rows}=load(f);const sh=rows.find(r=>r.name===nm);const S=build(E,sh);
const X0=+x0,Y0=+y0,X1=+x1,Y1=+y1,W=X1-X0,H=Y1-Y0,k=Math.min(1600/W,1000/H);
const col=n=>`hsl(${(n*67)%360},80%,60%)`;let g='';
for(const s of sh.R.seg)g+=`<line x1="${s.x1}" y1="${-s.y1}" x2="${s.x2}" y2="${-s.y2}" stroke="#444" stroke-width=".15"/>`;
for(const s of S.seg)g+=`<line x1="${s.x1}" y1="${-s.y1}" x2="${s.x2}" y2="${-s.y2}" stroke="${col(s.net)}" stroke-width=".35"/>`;
for(const s of S.gl)g+=`<line x1="${s.x1}" y1="${-s.y1}" x2="${s.x2}" y2="${-s.y2}" stroke="#9ab" stroke-width=".25"/>`;
for(const c of sh.R.ci)g+=`<circle cx="${c.x}" cy="${-c.y}" r="${c.r}" fill="none" stroke="#9ab" stroke-width=".25"/>`;
for(const a of sh.R.ar){const t=v=>v*Math.PI/180,sw=((a.a1-a.a0)%360+360)%360;g+=`<path d="M${a.x+a.r*Math.cos(t(a.a0))} ${-(a.y+a.r*Math.sin(t(a.a0)))}A${a.r} ${a.r} 0 ${sw>180?1:0} 0 ${a.x+a.r*Math.cos(t(a.a1))} ${-(a.y+a.r*Math.sin(t(a.a1)))}" fill="none" stroke="#9ab" stroke-width=".25"/>`}
for(const p of sh.R.pl)g+=`<path d="M${p.p.map(q=>q[0]+' '+-q[1]).join('L')}Z" fill="none" stroke="#9ab" stroke-width=".25"/>`;
for(const d of S.dot)g+=`<circle cx="${d.x}" cy="${-d.y}" r="${Math.min(d.r,1.2)}" fill="#fff"/>`;
for(const a of S.arrows)g+=`<circle cx="${a.x}" cy="${-a.y}" r=".7" fill="#0f0"/>`;
for(const t of sh.R.tx)g+=`<text x="${t.x}" y="${-t.y}" font-size="${Math.min(t.h,3)}" fill="#fc6" font-family="monospace">${t.t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>`;
const cnt={};for(const s of S.seg)for(const[x,y]of[[s.x1,s.y1],[s.x2,s.y2]]){const kk=x.toFixed(1)+','+y.toFixed(1);cnt[kk]=(cnt[kk]||0)+1}
for(const s of S.seg)for(const[x,y]of[[s.x1,s.y1],[s.x2,s.y2]]){if(cnt[x.toFixed(1)+','+y.toFixed(1)]>1)continue;if(S.arrows.some(a=>Math.hypot(a.x-x,a.y-y)<2.5))continue;g+=`<circle cx="${x}" cy="${-y}" r="1.3" fill="none" stroke="red" stroke-width=".25"/>`}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W*k}" height="${H*k}" viewBox="${X0} ${-Y1} ${W} ${H}" style="background:#0b1013">${g}</svg>`;
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:Math.ceil(W*k),height:Math.ceil(H*k)}});await p.setContent('<body style="margin:0">'+svg);await p.screenshot({path:out});await b.close()})();
