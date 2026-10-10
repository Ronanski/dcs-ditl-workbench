/* usage: node tools/release-docs/html-to-pdf.js in.html out.pdf [version-label]
   PAPER mode (html has an @page rule, see style.py): margin 0, the cream paper colour covers the WHOLE page, the 14 / 12 mm margins are padding that repeats on every page (box-decoration-break: clone);
   page numbers are stamped afterwards by tools/release-docs/stamp-pages.py.  Old mode (no @page rule): white margins as before. */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path'),fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage();const src=fs.readFileSync(process.argv[2],'utf8');const paper=/@page\s*\{/.test(src);const lab=process.argv[4]||'';
 await p.goto('file://'+path.resolve(process.argv[2]));
 if(paper)await p.pdf({path:process.argv[3],format:'A4',margin:{top:'0',bottom:'0',left:'0',right:'0'},printBackground:true,displayHeaderFooter:false,preferCSSPageSize:true});
 else await p.pdf({path:process.argv[3],format:'A4',margin:{top:'14mm',bottom:'14mm',left:'12mm',right:'12mm'},printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:8px;width:100%;text-align:center;color:#666">Logic Sim '+lab+' - <span class="pageNumber"></span> / <span class="totalPages"></span></div>'});
 await b.close();
 if(paper)require('child_process').execFileSync('python3',['-I',path.join(__dirname,'stamp-pages.py'),process.argv[3],lab])})();
