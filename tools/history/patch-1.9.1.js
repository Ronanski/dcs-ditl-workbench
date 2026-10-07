/* v1.9.0 -> v1.9.1 : (1) T path colouring back to v1.8.1 behaviour (user: 1.8.1 was right), (2) engineering theme = muted, still distinct per element type (not pure white), values keep the user's colour */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.9.0.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.9.0</title>','<title>DITL Logic Workbench v1.9.1</title>');
rep(`if((b.k==='SW'||b.k==='AMT')&&b.a>=0&&b.b>=0&&b.a!==b.b&&n===(uns(b)===b.a?b.b:b.a)){live=true;break}`,``);
rep(`const ENG=AN.ws.th==='eng',symC=(x,y)=>{const b=blkAt(x,y,.6);if(b)return ENG?'#f1f5f8':anKcol(b.k);`,`const ENG=AN.ws.th==='eng',engC=c=>{const m=/^#([0-9a-f]{6})$/i.exec(c);if(!m)return c;const n=parseInt(m[1],16),g=[206,214,222],q=[n>>16,n>>8&255,n&255].map((v,i)=>Math.round(g[i]*.58+v*.42));return'#'+q.map(v=>v.toString(16).padStart(2,'0')).join('')},kc=k=>ENG?engC(anKcol(k)):anKcol(k),symC=(x,y)=>{const b=blkAt(x,y,.6);if(b)return kc(b.k);`);
rep(`return ENG?'#f1f5f8':b?anKcol(b.k):'#d5dde3'};`,`return b?kc(b.k):'#d5dde3'};`);
rep(`t.style.fill=ENG?'#f1f5f8':'#d8c4ff';`,`t.style.fill=ENG?'#cfc6e6':'#d8c4ff';`);
rep(`function setTheme(v){AN.ws.th=v;if(v==='eng'&&AN.ws.vc==='green')AN.ws.vc='white';else if(v!=='eng'&&AN.ws.vc==='white')AN.ws.vc='green';wsSave()`,`function setTheme(v){AN.ws.th=v;wsSave()`);
fs.writeFileSync('ditl-workbench-v1.9.1.html',h);console.log('ok')
