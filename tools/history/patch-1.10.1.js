/* v1.10.0 -> v1.10.1 : (1) T / AMT legs: the NOT-selected input leg is grey even when its wire is shared with other blocks (per-leg overlay), the selected leg is always lit (also when the output goes to an unselected input further on); (2) diagnostics for the laptop: error banner + Diagnostics report with a real input self-test. DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('archive/html/ditl-workbench-v1.10.0.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.10.0</title>','<title>DITL Logic Workbench v1.10.1</title>');
rep(`kind:'analog-project',ver:'1.10.0'`,`kind:'analog-project',ver:'1.10.1'`);
/* anDead: the selected leg of a T is always live */
rep(`if(b.o&&b.o.length&&b.o.every(o=>dead.has(o)))continue;live=true;break}`,`if((b.k==='SW'||b.k==='AMT')&&b.a>=0&&b.b>=0&&b.a!==b.b&&n===(uns(b)===b.a?b.b:b.a)){live=true;break}if(b.o&&b.o.length&&b.o.every(o=>dead.has(o)))continue;live=true;break}`);
/* leg geometry */
rep(` const gcj=el('g',{fill:'none','stroke-linecap':'round','pointer-events':'none'},svg);S.conn.concat`,` const gleg=el('g',{fill:'none','stroke-linecap':'round','pointer-events':'none'},svg);L.legs=[];
 {const TP=.7,ends=s=>[[s.x1,s.y1],[s.x2,s.y2]];
  for(const b of S.blk){if(!(b.k==='SW'||b.k==='AMT')||b.a<0||b.b<0||b.a===b.b)continue;
   for(const side of['a','b']){const n=b[side],net=S.nets[n],pin=b.pins.find(p=>p.n===n&&p.role==='in')||b.pins.find(p=>p.n===n);if(!pin||!net)continue;
    let cur=[pin.x,pin.y];const used=new Set(),segs=[];
    for(let st=0;st<14;st++){let bi=-1,bd=1e9;for(const i of net.segs){if(used.has(i))continue;const s=S.seg[i];const d=Math.min(anD(s.x1,s.y1,cur[0],cur[1]),anD(s.x2,s.y2,cur[0],cur[1]));if(d<=TP&&d<bd){bd=d;bi=i}}
     if(bi<0)break;used.add(bi);const s=S.seg[bi];segs.push(s);
     const far=anD(s.x1,s.y1,cur[0],cur[1])<=anD(s.x2,s.y2,cur[0],cur[1])?[s.x2,s.y2]:[s.x1,s.y1];
     const others=net.segs.filter(i=>!used.has(i)&&(ends(S.seg[i]).some(([x,y])=>anD(x,y,far[0],far[1])<=TP)||anPtSeg(far[0],far[1],S.seg[i])<=.45));
     if(others.length!==1)break;cur=far}
    if(!segs.length)continue;
    const e=el('path',{d:segs.map(s=>'M'+s.x1+' '+-s.y1+'L'+s.x2+' '+-s.y2).join(''),stroke:'#3b4651','stroke-width':.8},gleg);e.style.display='none';
    const arw=((L.arw&&L.arw[n])||[]).filter((q,k)=>net.arrows[k]&&anD(net.arrows[k].x,net.arrows[k].y,pin.x,pin.y)<=3.6);
    L.legs.push({b,side,n,e,arw,on:null})}}}
 const gcj=el('g',{fill:'none','stroke-linecap':'round','pointer-events':'none'},svg);S.conn.concat`);
rep(`svg.append(g0,go_,gd,gfg,gf,gp,gt,gcj,L.selg,gb)`,`svg.append(g0,go_,gleg,gd,gfg,gf,gp,gt,gcj,L.selg,gb)`);
/* paint: show the grey overlay on the leg that is NOT selected */
rep(` for(const q of L.dots||[]){const ne=L.nets[q.n];if(ne&&ne._c&&q.c!==ne._c){q.c=ne._c;q.e.setAttribute('fill',ne._c)}}`,` for(const g of L.legs||[]){const q=S.rt.st[g.b.id],pk=q&&q.pk==='B'?'B':'A',dim=(g.side==='a')===(pk==='B'),ne=L.nets[g.n];if(!ne)continue;
  if(dim){g.e.style.display='';g.e.setAttribute('stroke-width',((ne._w||.8)+.12).toFixed(2));g.on=1;for(const a of g.arw){a.setAttribute('fill','#3b4651');a.setAttribute('fill-opacity',1)}}
  else if(g.on){g.e.style.display='none';g.on=0;for(const a of g.arw){a.setAttribute('fill',ne._c||'#3b4651');a.setAttribute('fill-opacity',ne._o==null?1:ne._o)}}}
 for(const q of L.dots||[]){const ne=L.nets[q.n];if(ne&&ne._c&&q.c!==ne._c){q.c=ne._c;q.e.setAttribute('fill',ne._c)}}`);
/* diagnostics */
rep(`const sRmp=h$('select',`,`/* ---- diagnostics (v1.10.1): what goes wrong on one computer but not on another ---- */
AN.errs=[];{const note=(m,src)=>{AN.errs.push((new Date().toLocaleTimeString())+' '+m+(src?' @'+src:''));if(AN.errs.length>20)AN.errs.shift();try{if(AN.cat==='an'){const t=$('anerr');if(t){t.textContent='⚠ Error: '+m+'  (Legend & style > Saving > Diagnostics)';t.style.display='block'}}}catch(e){}};
 addEventListener('error',e=>note(e.message||'error',(e.filename||'').split('/').pop()+':'+e.lineno));addEventListener('unhandledrejection',e=>note('promise: '+(e.reason&&e.reason.message||e.reason)))}
function anDiag(){const L_=[];const P=(k,v)=>L_.push(k+': '+v);P('app','DITL Workbench v1.10.1');P('browser',navigator.userAgent);P('platform',navigator.platform+' · touch points '+navigator.maxTouchPoints);P('window',innerWidth+'x'+innerHeight+' @'+devicePixelRatio+'x · screen '+screen.width+'x'+screen.height);P('file',location.protocol+'//'+location.pathname.slice(-60));
 let ls='blocked';try{localStorage.setItem('ditl.probe','1');ls=localStorage.getItem('ditl.probe')==='1'?'ok':'bad';localStorage.removeItem('ditl.probe')}catch(e){ls='blocked: '+e.message}P('localStorage',ls);P('IndexedDB',typeof indexedDB);P('loaded from',AN._src||'?');P('sheets',AN.sheets.length+' · current '+((AN.sheets[AN.i]||{}).name||'-'));P('errors so far',AN.errs.length?'\\n  '+AN.errs.join('\\n  '):'none');
 try{const sh=cs(),S=sh&&sh.S,ai=S&&S.blk.find(b=>b.k==='AI'),inp=document.querySelector('#anp input[type=number]');
  if(!S)P('input test','no sheet');else if(!ai)P('input test','this sheet has no analog input (go to ABC-050 or ABC-057 and run it again)');else if(!inp)P('input test','FAIL: no number box in the right panel (is the panel open?)');else{const st=S.rt.st[ai.id],old=st.val,tgt=(+old||0)+1;inp.value=String(tgt);inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
   const now=S.rt.st[ai.id].val;P('input test (type a number in the panel)',now===tgt?'PASS':'FAIL: wanted '+tgt+' got '+now);S.rt.st[ai.id].val=old;inp.value=String(old);inp.dispatchEvent(new Event('change',{bubbles:true}))}}catch(e){P('input test','ERROR '+e.message)}
 return L_.join('\\n')}
const sRmp=h$('select',`);
rep(`const bt=h$('button',{txt:'Test saving',onclick:test})`,`const dg=h$('button',{txt:'Diagnostics',title:'Makes a short report you can copy and send',onclick:()=>{const t=h$('textarea',{style:'width:100%;height:150px;background:#0b1013;color:#d7e0e6;border:1px solid #2a3640;font:11px Consolas,monospace'});t.value=anDiag();out.append(t);t.select();try{document.execCommand('copy');msg('Diagnostics copied to the clipboard')}catch(e){}}}),bt=h$('button',{txt:'Test saving',onclick:test})`);
rep(`h$('div',{cls:'it'},[bt,sv_,ld,fi]));test()}}`,`h$('div',{cls:'it'},[bt,dg,sv_,ld,fi]));test()}}`);
rep(`meta=h$('div',{id:'anmeta'});`,`meta=h$('div',{id:'anmeta'}),errB=h$('div',{id:'anerr',style:'display:none;background:#5a1d1d;color:#ffd7d7;padding:4px 12px;font:12px Consolas,monospace;cursor:pointer',title:'click to hide'});errB.onclick=()=>{errB.style.display='none'};`);
rep(`barEl.after(bar);bar.after(meta);`,`barEl.after(bar);bar.after(meta);meta.after(errB);`);
rep(`#anbar,#anmeta,#anp,#anhp,#anln{display:none}`,`#anbar,#anmeta,#anp,#anhp,#anln{display:none}body:not(.an) #anerr{display:none!important}`);
/* the Legend & style card was taller than a laptop screen: its lower part (Saving, Diagnostics) could not be reached */
rep(`#anlg{display:none;position:fixed;top:100px;right:310px;`,`#anlg{display:none;position:fixed;top:100px;right:310px;max-height:calc(100vh - 120px);overflow-y:auto;`);
fs.writeFileSync('ditl-workbench-v1.10.1.html',h);console.log('ok')
