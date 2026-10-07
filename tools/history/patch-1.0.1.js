const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.0.0.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,60));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,60));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v46</title>','<title>DITL Logic Workbench v1.0.1</title>');
/* 1. cross-sheet links by signal tag */
rep(` /* mark the nets that are fed from another sheet */`,
` /* v1.0.1: a signal tag that is an OUTPUT on one sheet and an INPUT on another sheet is ONE signal (M.0124, B.0646, SICL1060A.MV ...) */
 {const done=new Set(out.filter(l=>l.to===sh).flatMap(l=>l.toNets));let ix=null;
  for(const n of S.ext){if(done.has(n))continue;const lb=S.lab[n];if(!lb||!TAGX.test(lb.t))continue;ix=ix||tagIndex();
   const c=(ix.get(lb.t)||[]).filter(q=>q.sh!==sh).find(q=>q.sh.S.nets[q.n].dig===S.nets[n].dig);if(!c)continue;
   const CS=c.sh.S,sg=CS.seg[CS.nets[c.n].segs[0]],sl=CS.lab[c.n]||(sg?{x:sg.x1,y:sg.y1}:{x:0,y:0});
   out.push({from:c.sh,to:sh,fromNets:[c.n],toNets:[n],fromC:{x:sl.x,y:sl.y,r:4},toC:{x:lb.x,y:lb.y,r:4},num:lb.t,tag:1,at:{sh,c:null},peer:{sh:c.sh,c:null}})}}
 /* mark the nets that are fed from another sheet */`);
rep(`function linksOf(sh){`,
`const TAGX=/^(S\\d\\s*)?[MB]\\.[0-9A-F]{3,5}[A-Z]?$|^(S\\d\\s*)?(AI|S[IO])\\d{3,5}$|^[A-Z0-9]{3,}[A-Z0-9-]*\\.(MV|PV|SV|REM|LOC|OUT|SIG)$/;
/* index: signal tag -> the sheets / nets where a block DRIVES it (built once, all sheets) */
function tagIndex(){if(AN.tagIdx)return AN.tagIdx;const ix=AN.tagIdx=new Map();
 for(const p of AN.sheets){let PS;try{PS=ensure(p)}catch(e){continue}
  const add=(t,n)=>{if(!t||!PS.drv[n].some(d=>d.k!=='LINK'))return;const a=ix.get(t)||[];if(!a.some(q=>q.sh===p&&q.n===n))a.push({sh:p,n});ix.set(t,a)};
  PS.lab.forEach((l,n)=>{if(l)add(l.t,n)});(PS.tagN||[]).forEach(q=>{if(q.d<=4)add(q.t,q.n)})}
 return ix}
function linksOf(sh){`);
/* 2. all linked sheets run together */
rep('set.length<16;','set.length<64;');rep('&&set.length<16)','&&set.length<64)');
/* 3. panel label */
rep(`'circle '+l.num,[livev(n,S.nets[n].dig),bt]`,`(l.tag?'tag ':'circle ')+l.num,[livev(n,S.nets[n].dig),bt]`);
/* 4. click message on a computed wire */
rep(`else t=nme+' = '+(S.rt.v[n]>.5?1:0)+' · galing sa logic (computed) - ang logic ang nagpapasya ng ilaw nito, kaya hindi ito binabago ng click. Kung gusto mong i-force: FORCE button sa panel.';`,
`else{const lk=S.xlk&&S.xlk[n];t=nme+' = '+(S.rt.v[n]>.5?1:0)+(lk?' · galing sa sheet '+lk.from.name+' ('+(lk.tag?'tag ':'circle ')+lk.num+') - hindi ito input, ang logic doon ang nagpapasya.':' · output ng logic sa sheet na ito - hindi ito input, ang logic ang nagpapasya.')+' Para i-force: FORCE button sa panel.'}`);
/* 5. import: forget cached links */
rep(`if(ok){msg(ok+' analog sheet(s) imported`,`if(ok){AN.tagIdx=null;AN.sheets.forEach(s=>{delete s.lk;if(s.S)s.S.xlk=null});msg(ok+' analog sheet(s) imported`);
fs.writeFileSync('ditl-workbench-v1.0.1.html',h);console.log('written',h.length);
