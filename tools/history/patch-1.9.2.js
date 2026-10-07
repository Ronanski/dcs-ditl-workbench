/* v1.9.1 -> v1.9.2 : other sheets. (1) timer with a wire drawn through it that is a hair off horizontal (ABC-057 x2, ABC-008) is cut now; (2) comparators (H/ /L) whose input wire has no arrow head get their input recognised (ABC-014, ABC-019 ...) */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.9.1.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.9.1</title>','<title>DITL Logic Workbench v1.9.2</title>');
rep('const AN_PV=10;','const AN_PV=11;');
rep(`let hit=null;if(Math.abs(s.y1-s.y2)<.06)for(const v of iv)`,`let hit=null;if(Math.abs(s.y1-s.y2)<.2)for(const v of iv)`);
rep(` /* AI / AO triangles: in = top edge, out = apex */`,` /* v1.9.2: a function block that ended up with only 'out' pins: the pin whose wire has no arrow while another pin's wire has one is the INPUT (comparators drawn without an arrow head on the input) */
 for(const b of blk){if(!['HC','LC','HLC','DCMP','PVSV','FX','SQRT','LAG','RATE','HLIM','LLIM','ABS','SUM','SUB','ADD','MUL','DIV','DEV'].includes(b.k)||b.pins.length<2||b.pins.some(p=>p.role==='in'))continue;
  const wa=b.pins.filter(p=>nets[p.n].arrows.length),na=b.pins.filter(p=>!nets[p.n].arrows.length);if(wa.length&&na.length)na.forEach(p=>p.role='in');else if(b.pins.length===2){const[p,q]=b.pins;if(Math.abs(p.x-q.x)>Math.abs(p.y-q.y)+1)(p.x<q.x?p:q).role='in'}}
 /* AI / AO triangles: in = top edge, out = apex */`);

/* v1.9.2: SET SV = value notes with no T next to the word SV (ABC-017/029/030/033/054/055/056): the preset goes on the wire that carries the SV (nearest "SV" text) */
rep(`const tag=/([A-Za-z]\\.[0-9A-F]{3,5}[A-Z]?)/.exec(cq.t)[1],cn=S.lab.findIndex(l=>l&&l.t===tag);if(cn<0)continue;`,`const tag=/([A-Za-z]\\.[0-9A-F]{3,5}[A-Z]?)/.exec(cq.t)[1],cn=S.lab.findIndex(l=>l&&l.t.replace(/^S\\d\\s*/,'')===tag);if(cn<0)continue;`);
rep(`   if(tb){S.pre[tb.a]={c:cn,val:+m[1],tag}}}`,`   if(tb){S.pre[tb.a]={c:cn,val:+m[1],tag}}
   else{let bn=-1,bd=200;for(const q of TX){if(!/^SV$/i.test(q.t.trim()))continue;const d=anD(q.x,q.y,t.x,t.y);if(d>=bd)continue;let nn=-1,nd=9;for(const sg of S.seg){const e=anPtSeg(q.x,q.y,sg);if(e<nd){nd=e;nn=sg.net}}if(nn>=0){bd=d;bn=nn}}
    if(bn>=0){if(S.pre[bn])(S.pre[bn].alt=S.pre[bn].alt||[]).push({c:cn,val:+m[1],tag});else S.pre[bn]={c:cn,val:+m[1],tag}}}}`);
rep(`for(const k in S.pre||{}){const pr=S.pre[k];if(S.ext.includes(+k)&&v[pr.c]>.5&&F[+k]===undefined)v[+k]=pr.val}`,`for(const k in S.pre||{}){const pr=S.pre[k];if(S.ext.includes(+k)&&F[+k]===undefined)for(const q of[pr].concat(pr.alt||[]))if(v[q.c]>.5)v[+k]=q.val}`);
rep(`const pr=S.pre&&S.pre[n];if(pr&&v[pr.c]>.5)v[n]=pr.val}`,`const pr=S.pre&&S.pre[n];if(pr)for(const q of[pr].concat(pr.alt||[]))if(v[q.c]>.5)v[n]=q.val}`);
fs.writeFileSync('ditl-workbench-v1.9.2.html',h);console.log('ok')
