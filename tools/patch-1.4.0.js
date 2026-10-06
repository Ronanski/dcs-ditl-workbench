/* v1.3.0 -> v1.4.0 : wire style settings, coloured arrowheads, timer chord = symbol, T path emphasised, dots under symbols, coloured + fewer + better spaced values, sliders on analog inputs, AI follows valve/actuator position, panel opens on click, saved-values version bump */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.3.0.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,90));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.3.0</title>','<title>DITL Logic Workbench v1.4.0</title>');
/* saved values: version bump (the reader changed: block / net numbers moved) */
rep(`const AN_PV=5;`,`const AN_PV=7;/* BUMP THIS whenever the drawing reader changes (net / block numbers move) */`);
/* wire style settings */
rep(`const AN={ramp:0,cat:'dig',`,`const AN={ws:{ac:'auto',as:'tube',aw:1,dw:1},wsr:0,ramp:0,cat:'dig',`);
rep(`try{window.ANLN=JSON.parse(localStorage.getItem('ditl.ln')||'{}')||{}}catch(e){window.ANLN={}}`,`try{Object.assign(AN.ws,JSON.parse(localStorage.getItem('ditl.an.ws')||'{}'))}catch(e){}
const wsSave=()=>{try{localStorage.setItem('ditl.an.ws',JSON.stringify(AN.ws))}catch(e){}};
try{window.ANLN=JSON.parse(localStorage.getItem('ditl.ln')||'{}')||{}}catch(e){window.ANLN={}}`);
rep(`function anColor(){const l=($('slive')||{}).value;`,`const ANCS={amber:'#ffb020',cyan:'#35d0ff',green:'#4be08a',white:'#e6edf3',magenta:'#ff7ad9',orange:'#ff8a3d'};
function anLite(c){const n=parseInt(c.slice(1),16),m=v=>Math.round(v+(255-v)*.55);return 'rgb('+m(n>>16)+','+m(n>>8&255)+','+m(n&255)+')'}
function anColor(){const w=AN.ws&&AN.ws.ac;if(w&&ANCS[w])return ANCS[w];const l=($('slive')||{}).value;`);
/* values coloured like the analog wire */
rep(`.bd{font:600 var(--bs,2.4px) Consolas,monospace;fill:#f2f5f7;`,`.bd{font:600 var(--bs,2.4px) Consolas,monospace;fill:var(--alv,#ffe7b0);`);
rep(`.bd.dg{fill:#f2f5f7}`,`.bd.dg{fill:var(--alv,#ffe7b0)}`);
/* paint: wire style (colour / tube or solid / width), arrowheads follow the wire, T path, valve label colour */
rep(`const ANC=anColor();document.documentElement.style.setProperty('--alive',ANC);`,`const ANC=anColor(),dW=+AN.ws.dw||1,aW=+AN.ws.aw||1,tube=AN.ws.as!=='solid';document.documentElement.style.setProperty('--alive',ANC);document.documentElement.style.setProperty('--alv',anLite(ANC));`);
rep(`if(isD){c='#35414a';w=n.dig?.3:.55;o=.55}else if(n.dig){if(on){c='var(--live)';w=.5}else{c='#4a5660';w=.35}}else{c=ANC;w=.7}/* analog: always coloured, a value (even 0) is flowing */`,`if(isD){c='#35414a';w=n.dig?.3*dW:.5*aW;o=.55}else if(n.dig){if(on){c='var(--live)';w=.5*dW}else{c='#4a5660';w=.35*dW}}else{c=ANC;w=(tube?.7:.5)*aW}/* analog: always coloured, a value (even 0) is flowing */`);
rep(`if(e._c!==c||e._d!==dsh||e._w!==w||e._o!==o){e._c=c;e._d=dsh;e._w=w;e._o=o;`,`if(e._c!==c||e._d!==dsh||e._w!==w||e._o!==o||e._r!==AN.wsr){e._c=c;e._d=dsh;e._w=w;e._o=o;e._r=AN.wsr;(L.arw&&L.arw[n.id]||[]).forEach(q=>{q.setAttribute('fill',c);q.setAttribute('fill-opacity',o)});`);
rep(`if(k){k.setAttribute('stroke-width',w*.32);`,`if(k){k.style.display=tube?'':'none';k.setAttribute('stroke-width',w*.32);`);
/* T switch: the selected path (input -> centre -> output) is drawn in the wire colour */
rep(`const pa=b.pins.find(p=>p.n===b.a),pb=b.pins.find(p=>p.n===b.b),mk=p=>p?el('circle',{cx:p.x,cy:-p.y,r:1.15,fill:'none',stroke:'#7d8e9a','stroke-width':.3,'pointer-events':'none'},gb):null;L.ov.push({b,k:'SW',t,ca:mk(pa),cb:mk(pb),last:null})`,`const pa=b.pins.find(p=>p.n===b.a),pb=b.pins.find(p=>p.n===b.b),po=b.pins.filter(p=>p.role==='out'),mkd=p=>p?'M'+p.x+' '+-p.y+'L'+b.cx+' '+-b.cy+po.map(q=>'M'+b.cx+' '+-b.cy+'L'+q.x+' '+-q.y).join(''):'',pth=el('path',{d:'',fill:'none','stroke-width':.9,'stroke-linecap':'round','stroke-linejoin':'round','pointer-events':'none'},gp);L.ov.push({b,k:'SW',t,pth,dA:mkd(pa),dB:mkd(pb),last:null})`);
rep(`if(o.k==='SW'){const A=(st.pk||'A')!=='B',dg=S.nets[b.a>=0?b.a:b.b]&&S.nets[b.a>=0?b.a:b.b].dig,col=dg?'var(--live)':ANC;if(o.ca){o.ca.setAttribute('fill',A?col:'none');o.ca.setAttribute('stroke',A?col:'#7d8e9a')}if(o.cb){o.cb.setAttribute('fill',A?'none':col);o.cb.setAttribute('stroke',A?'#7d8e9a':col)}}`,`if(o.k==='SW'){const A=(st.pk||'A')!=='B',sn=A?b.a:b.b,dg=sn>=0&&S.nets[sn]&&S.nets[sn].dig;o.pth.setAttribute('d',A?o.dA:o.dB);o.pth.setAttribute('stroke',dg?'var(--live)':ANC)}`);
rep(`key=pos.toFixed(0)+(mv?'m':'')+col;txt=pos.toFixed(0)+'%';fill=col;op=.3;if(o.last!==key)o.e.setAttribute('stroke',col)}`,`key=pos.toFixed(0)+(mv?'m':'')+col;txt=pos.toFixed(0)+'%';fill=col;op=.3;if(o.last!==key){o.e.setAttribute('stroke',col);o.t.style.fill=col}}`);
/* arrowheads: kept per net so paint can colour them; SOLID triangles that are net arrows are not drawn twice; dots under the symbols and smaller */
rep(`const gf=el('g',{},svg);`,`const gd=el('g',{},svg),gf=el('g',{},svg),gp=el('g',{},svg);L.arw=[];`);
rep(`const DT=[];R.dot.forEach(d=>{DT.push([d,el('circle',{cx:d.x,cy:-d.y,r:Math.min(d.r,2.4),fill:aci(d.c)},gf)])});`,`const DT=[];R.dot.forEach(d=>{DT.push([d,el('circle',{cx:d.x,cy:-d.y,r:Math.min(d.r,1.6),fill:aci(d.c)},gd)])});`);
rep(`R.so.forEach(s=>el('path',{d:'M'+s.p.map(q=>q[0]+' '+-q[1]).join('L')+'Z',fill:aci(s.c)},gf));`,`R.so.forEach(s=>{if(S.arrows.some(a=>s.p.some(q=>Math.hypot(q[0]-a.x,q[1]-a.y)<1.2)))return;el('path',{d:'M'+s.p.map(q=>q[0]+' '+-q[1]).join('L')+'Z',fill:aci(s.c)},gf)});`);
rep("S.nets.forEach(n=>n.arrows.forEach(a=>{const bx=a.x-a.dx*2.2,by=a.y-a.dy*2.2,px=-a.dy*.8,py=a.dx*.8;el('path',{d:`M${a.x} ${-a.y}L${bx+px} ${-(by+py)}L${bx-px} ${-(by-py)}Z`,fill:'#e6edf3'},gf)}));","S.nets.forEach(n=>n.arrows.forEach(a=>{const bx=a.x-a.dx*2.2,by=a.y-a.dy*2.2,px=-a.dy*.8,py=a.dx*.8;(L.arw[n.id]=L.arw[n.id]||[]).push(el('path',{d:`M${a.x} ${-a.y}L${bx+px} ${-(by+py)}L${bx-px} ${-(by-py)}Z`,fill:'#4a5660'},gf))}));");
rep(`svg.append(g0,go_,gfg,gf,gt,gcj,L.selg,gb);`,`svg.append(g0,go_,gd,gfg,gf,gp,gt,gcj,L.selg,gb);`);
/* timer chord (closing line of the half-disc) belongs to the symbol, not to a wire */
rep(`const A=S.R.ar.filter(a=>/^CON$/i.test(a.l)&&a.r>=3.5&&a.r<=9&&Math.abs(((a.a1-a.a0+360)%360)-180)<12);if(!A.length)return;`,`const A=S.R.ar.filter(a=>/^CON$/i.test(a.l)&&a.r>=3.5&&a.r<=9&&Math.abs(((a.a1-a.a0+360)%360)-180)<12);if(!A.length)return;
 for(const a of A){const ch=S.seg.filter(s=>Math.abs(s.x1-s.x2)<.06&&Math.abs(s.x1-a.x)<.4&&Math.abs(s.y1-s.y2)>=a.r*1.2&&Math.min(s.y1,s.y2)<=a.y+a.r*.6&&Math.max(s.y1,s.y2)>=a.y-a.r*.6);ch.forEach(s=>{s.use=1;S.gl.push(s)});S.seg=S.seg.filter(s=>!ch.includes(s))}`);
/* values: fewer (not on the I/P - valve chain), more room around symbols */
rep(`const addB=(n,ax,ay)=>{if(placed.has(n))return;`,`const PASS=['IP','AO','PO','TP','FIELD','VLV','ACT'],skipB=n=>{const D=S.drv[n]||[],C=S.cns[n]||[];return(D.length&&D.every(d=>PASS.includes(d.k)))||(C.length&&C.every(q=>PASS.includes(q.k)))};
 const addB=(n,ax,ay)=>{if(placed.has(n)||skipB(n))return;`);
rep(`const BB=S.blk.map(b=>[b.x0,b.y0,b.x1,b.y1]),PB=[];`,`const BB=S.blk.map(b=>[b.x0-1,b.y0-1,b.x1+1,b.y1+1]),PB=[];`);
rep(`return[x0,y0,x0+W,y0+H]});`,`return[x0-.3,y0-.3,x0+W+.3,y0+H+.3]});`);
rep(`for(const r of [1.2,2.6,4.5,7,11])`,`for(const r of [1.8,3,4.8,7,11])`);
rep(`for(const q of bb)sc+=ovl(bx,q)*3;`,`for(const q of bb)sc+=ovl(bx,q)*6;`);
/* AI that measures a valve / actuator position follows it (POSITIONER -> nearest valve or actuator, nearest AI) */
rep(` /* numbered connectors of one sheet: same number = same wire (the sink end feeds the other ends) */`,` /* position feedback: the word POSITIONER sits between a valve / actuator and the AI that measures its position */
 {const used=new Set();for(const p of TX.filter(t=>/^POSITIONER/i.test(t.t.trim()))){let src=null,sd=260;for(const b of blk)if((b.k==='VLV'||b.k==='ACT')&&Math.hypot(b.cx-p.x,b.cy-p.y)<sd){sd=Math.hypot(b.cx-p.x,b.cy-p.y);src=b}
   let ai=null,ad=45;for(const b of blk)if(b.k==='AI'&&!used.has(b)&&Math.hypot(b.cx-p.x,b.cy-p.y)<ad){ad=Math.hypot(b.cx-p.x,b.cy-p.y);ai=b}
   if(src&&ai){used.add(ai);ai.fb=src}}}
 /* numbered connectors of one sheet: same number = same wire (the sink end feeds the other ends) */`);
rep(`case 'AI':{const r=b.rng,sp=r?Math.max(1e-9,r.hi-r.lo):100;s.act=slew(s.act,s.val,sp);out(s.act);break}`,`case 'AI':{const r=b.rng,sp=r?Math.max(1e-9,r.hi-r.lo):100;if(b.fb){const fs=rt.st[b.fb.id],pos=fs&&fs.pos!=null?fs.pos:0,lo=r?r.lo:0,hi=r?r.hi:100;s.val=lo+(hi-lo)*pos/100;s.act=s.val}else s.act=slew(s.act,s.val,sp);out(s.act);break}`);
rep(`const row=mkRow(g,'b'+b.id,b.tagAI||'AI',(d.desc||'')+(r.u?'  ['+r.lo+' ~ '+r.hi+' '+r.u+']':''),[inp,h$('small',{txt:r.u||''}),nowv],{x:b.cx,y:b.cy});row.append(rg);`,`const row=mkRow(g,'b'+b.id,b.tagAI||'AI',(d.desc||'')+(r.u?'  ['+r.lo+' ~ '+r.hi+' '+r.u+']':'')+(b.fb?'  · follows the '+(b.fb.k==='VLV'?'valve':'actuator')+' position':''),[inp,h$('small',{txt:r.u||''}),nowv],{x:b.cx,y:b.cy});row.append(rg);if(b.fb){inp.disabled=true;rg.disabled=true}`);
/* slider on analog inputs (panel rows + selected wire) */
rep(`mkRow(g,'n'+n,nm(S,n),wd.desc,ce,pos)});`,`const row=mkRow(g,'n'+n,nm(S,n),wd.desc,ce,pos);if(!dig){const rr=anRange(S,{cx:pos?pos.x:0,cy:pos?pos.y:0},45)||{lo:0,hi:100},rg=h$('input',{type:'range',min:rr.lo,max:rr.hi,step:(rr.hi-rr.lo)/1000});rg.value=S.rt.ext[n]||0;rg.oninput=()=>setE(+rg.value);row.append(rg);PU.push(()=>{if(document.activeElement!==rg)rg.value=S.rt.ext[n]||0})}});`);
rep(`const u=()=>{if(document.activeElement!==i)i.value=S.rt.ext[n]||0};u._s=1;PU.push(u);return h$('span',{cls:'fc'},[h$('small',{txt:'INPUT'}),i,ok])}`,`const sg0=S.seg[S.nets[n].segs[0]],rr=anRange(S,{cx:sg0?sg0.x1:0,cy:sg0?sg0.y1:0},45)||{lo:0,hi:100},rg=h$('input',{type:'range',min:rr.lo,max:rr.hi,step:(rr.hi-rr.lo)/1000});rg.style.width='100%';rg.value=S.rt.ext[n]||0;rg.oninput=()=>setE(+rg.value);
 const u=()=>{if(document.activeElement!==i)i.value=S.rt.ext[n]||0;if(document.activeElement!==rg)rg.value=S.rt.ext[n]||0};u._s=1;PU.push(u);return h$('span',{cls:'fc',style:'flex-wrap:wrap'},[h$('small',{txt:'INPUT'}),i,ok,rg])}`);
/* panel opens by itself when you click a wire / block while it is hidden (and hides again) */
rep(`function showPanel(on){const ov=!!AN.ah;`,`function panelFor(on){if(AN.ah){showPanel(on);return}if(anp.classList.contains('min')){if(on){AN.tmp=true;showPanel(true)}}else if(AN.tmp&&!on)showPanel(false)}
function showPanel(on){if(!on)AN.tmp=false;const ov=!!AN.ah||!!AN.tmp;`);
rep(`ptab.onclick=()=>showPanel(true);`,`ptab.onclick=()=>{AN.tmp=false;showPanel(true)};`);
rep(`bPn.onclick=()=>showPanel(anp.classList.contains('min'));`,`bPn.onclick=()=>{AN.tmp=false;showPanel(anp.classList.contains('min'))};`);
rep(`if(AN.ah)showPanel(true);return}`,`panelFor(true);return}`);
rep(`if(AN.ah)showPanel(!!AN.sel)}`,`panelFor(!!AN.sel)}`);
rep(`AN.sel={net:n};selBox();paint();panelUpd(true);rowFocus('n'+n);msg(t)}`,`AN.sel={net:n};selBox();paint();panelFor(true);panelUpd(true);rowFocus('n'+n);msg(t)}`);
/* legend card: wire style controls */
rep(`<div class="it"><svg width="24" height="13"><circle cx="12" cy="6" r="4.5" fill="var(--alive,#ffb020)"/></svg>T: filled ring = the input in use</div>';document.body.append(d)}`,`<div class="it"><svg width="24" height="13"><line x1="2" y1="6" x2="22" y2="6" stroke="var(--alive,#ffb020)" stroke-width="3"/></svg>T: the thick line inside = the input in use</div>';document.body.append(d);
 const sel=(label,key,opts)=>{const w=h$('div',{cls:'it'}),s=h$('select',{style:'background:#0b1013;color:#d7e0e6;border:1px solid #2a3640;padding:2px 4px'},opts.map(([v,t])=>h$('option',{value:v,txt:t})));s.value=String(AN.ws[key]);s.onchange=()=>{AN.ws[key]=/^[0-9.]+$/.test(s.value)?+s.value:s.value;wsSave();AN.wsr++;try{paint()}catch(e){}};w.append(h$('span',{txt:label,style:'width:130px'}),s);return w},WD=[['.7','Thin'],['1','Normal'],['1.5','Thick'],['2','Extra thick']];
 d.append(h$('b',{txt:'Wire style (saved)'}),sel('Digital thickness','dw',WD),sel('Analog colour','ac',[['auto','Auto'],['amber','Amber'],['cyan','Cyan'],['green','Green'],['white','White'],['magenta','Magenta'],['orange','Orange']]),sel('Analog line','as',[['tube','Tube'],['solid','Solid']]),sel('Analog thickness','aw',WD),h$('div',{cls:'it',style:'color:#7d8e9a',txt:'Digital colour: the "Live:" list in the top bar.'}))}`);
rep(`txt:'Legend ▾',title:'Colour code of the symbols, valves and wires'`,`txt:'Legend & style ▾',title:'Colour code of the symbols, valves and wires; wire style settings'`);
fs.writeFileSync('ditl-workbench-v1.4.0.html',h);console.log('written',h.length);
