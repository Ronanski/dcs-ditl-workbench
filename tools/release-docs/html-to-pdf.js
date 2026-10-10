/* usage: node tools/release-docs/html-to-pdf.js in.html out.pdf */
const {chromium}=require('/opt/node-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage();await p.goto('file://'+path.resolve(process.argv[2]));
await p.pdf({path:process.argv[3],format:'A4',margin:{top:'14mm',bottom:'14mm',left:'12mm',right:'12mm'},printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:8px;width:100%;text-align:center;color:#666">Logic Sim v1.20.8 - <span class="pageNumber"></span> / <span class="totalPages"></span></div>'});await b.close()})();
