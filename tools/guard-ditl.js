/* RULE: the DITL page must never change. Compares everything EXCEPT the analog script + analog data between two builds. */
const fs=require('fs'),crypto=require('crypto');
const strip=h=>{const cut=(s,open)=>{const a=s.indexOf(open);if(a<0)return s;const b=s.indexOf('</script>',a);return s.slice(0,a)+s.slice(b+9)};
 h=cut(h,'<script id="analogjs">');h=cut(h,'<script type="text/plain" id="apre">');h=cut(h,'<script type="text/plain" id="ades">');h=h.replace(/<title>[^<]*<\/title>/,'');return h};
const [x,y]=process.argv.slice(2).map(f=>strip(fs.readFileSync(f,'utf8')));
const H=s=>crypto.createHash('sha1').update(s).digest('hex').slice(0,12);
console.log('DITL part:',H(x),H(y),x===y?'IDENTICAL':'*** CHANGED ***');process.exit(x===y?0:1);
