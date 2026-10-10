/* v1.20.8 -> v1.20.9 (2026-10-10, after the user's manual tests MT-01..MT-08 and known-issue answers).
   usage: node tools/patch-1.20.9.js   (reads archive/html/logic-sim-v1.20.8.html or the root file, writes logic-sim-v1.20.9.html) */
const fs=require('fs');const src=fs.existsSync('logic-sim-v1.20.8.html')?'logic-sim-v1.20.8.html':'archive/html/logic-sim-v1.20.8.html';let h=fs.readFileSync(src,'utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,110));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.20.8</title>','<title>Logic Sim v1.20.9</title>');
const repAll=(a,b,n)=>{const c=h.split(a).length-1;if(c!==n)throw new Error(c+' x (expected '+n+') '+a.slice(0,110));h=h.split(a).join(b)};
const repSpan=(a,b,nw)=>{const i=h.indexOf(a),j=h.indexOf(b,i);if(i<0||j<0||h.indexOf(a,i+1)>=0&&h.indexOf(a,i+1)<j)throw new Error('span '+a.slice(0,60));h=h.slice(0,i)+nw+h.slice(j)};
require('./patch-1.20.9-display.js')(rep,repAll);
require('./patch-1.20.9-blocks.js')(rep,repAll,repSpan);
/* LN38 / LN39 of station 1 = the DCS patterns 038 / 039 (user screenshots 2026-10-10), not the 19-point curve of the Excel file */
{const a=h.indexOf('<script type="application/json" id="aln">'),s0=h.indexOf('>',a)+1,e0=h.indexOf('</script>',s0),aln=JSON.parse(h.slice(s0,e0)),ref=JSON.parse(fs.readFileSync('data/reference/DCS-Ptrn038-039-from-screenshot.json','utf8'));
 for(const [key,ly,sc] of [['S1-LN38',ref.Ptrn038_LY,1],['S1-LN39',ref.Ptrn039_LY,.01]]){const t=aln.find(q=>q.key===key);if(!t)throw new Error('no '+key);t.pts=ref.LX.map((lx,i)=>[+(lx*t.xr[1]/100).toFixed(6),+(ly[i]*sc).toFixed(8)]);t.src='DCS Engr Station pattern '+key.replace('S1-LN','0')+' (user screenshot 2026-10-10: '+ref.LX.length+' points LX / LY in % of the range)';t.title=(t.title||'')}
 h=h.slice(0,s0)+JSON.stringify(aln)+h.slice(e0)}
fs.writeFileSync('logic-sim-v1.20.9.html',h);console.log('written logic-sim-v1.20.9.html',h.length);
