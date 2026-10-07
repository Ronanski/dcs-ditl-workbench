/* docs/MANUAL.md -> docs/Logic-Sim-Manual.pdf (Chromium). usage: node tools/build-manual-pdf.js */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const fs=require('fs'),path=require('path');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inl=s=>esc(s).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img alt="$1" src="$2">').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/(^|[^*])\*([^*]+)\*/g,'$1<i>$2</i>');
function md(t){const L=t.split('\n');let o='',i=0,ul=0,ol=0;const close=()=>{if(ul){o+='</ul>';ul=0}if(ol){o+='</ol>';ol=0}};
 while(i<L.length){const l=L[i];
  if(/^\|/.test(l)&&/^\|[-| ]+\|$/.test(L[i+1]||'')){close();const h=l.split('|').slice(1,-1);o+='<table><tr>'+h.map(c=>'<th>'+inl(c.trim())+'</th>').join('')+'</tr>';i+=2;while(/^\|/.test(L[i]||'')){o+='<tr>'+L[i].split('|').slice(1,-1).map(c=>'<td>'+inl(c.trim())+'</td>').join('')+'</tr>';i++}o+='</table>';continue}
  let m;if(m=l.match(/^(#{1,3}) (.*)/)){close();o+='<h'+m[1].length+'>'+inl(m[2])+'</h'+m[1].length+'>'}
  else if(/^---+$/.test(l)){close()}
  else if(m=l.match(/^- (.*)/)){if(!ul){close();o+='<ul>';ul=1}o+='<li>'+inl(m[1])+'</li>'}
  else if(m=l.match(/^\d+\. (.*)/)){if(!ol){close();o+='<ol>';ol=1}o+='<li>'+inl(m[1])+'</li>'}
  else if(l.trim()===''){close()}
  else{close();o+='<p>'+inl(l)+'</p>'}
  i++}close();return o}
(async()=>{const t=fs.readFileSync('docs/MANUAL.md','utf8');const css='body{font:11pt/1.45 Segoe UI,Arial,sans-serif;color:#111;margin:0}h1{font-size:22pt;border-bottom:3px solid #1f7a4d;padding-bottom:4px}h2{font-size:15pt;color:#1f7a4d;margin-top:20px;break-after:avoid}h3{font-size:12pt;break-after:avoid}table{border-collapse:collapse;width:100%;margin:8px 0;font-size:10pt}td,th{border:1px solid #bbb;padding:3px 6px;vertical-align:top}th{background:#e8f1ec}code{background:#eef;padding:0 3px;font-size:10pt}img{max-width:100%;border:1px solid #999;margin:6px 0}tr{break-inside:avoid}';
 const html='<html><head><meta charset="utf-8"><style>'+css+'</style></head><body>'+md(t)+'</body></html>';
 const f=path.resolve('docs/_manual.html');fs.writeFileSync(f,html);const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage();await p.goto('file://'+f);
 await p.pdf({path:'docs/Logic-Sim-Manual.pdf',format:'A4',margin:{top:'16mm',bottom:'16mm',left:'15mm',right:'15mm'},printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:8px;width:100%;text-align:center">Logic Sim manual · page <span class="pageNumber"></span>/<span class="totalPages"></span></div>'});
 await b.close();fs.unlinkSync(f);console.log('pdf ok')})();
