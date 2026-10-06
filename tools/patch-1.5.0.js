/* v1.4.0 -> v1.5.0 : T = coloured active letter (no line in the box, no arrows), value style settings (green default), digital / forced wire style, per-wire look, faint = coloured but dim, analog inputs always instant, trend arrows, closer values */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.4.0.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,90));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,90));h=h.split(a).join(b)};
const cut=(from,to,b)=>{const i=h.indexOf(from);if(i<0)throw new Error('cut from NOT FOUND: '+from.slice(0,70));const j=h.indexOf(to,i);if(j<0)throw new Error('cut to NOT FOUND: '+to.slice(0,70));h=h.slice(0,i)+b+h.slice(j+to.length)};
rep('<title>DITL Logic Workbench v1.4.0</title>','<title>DITL Logic Workbench v1.5.0</title>');
/* analog inputs: always the typed value at once (the 5 %/s ramp made sliders / comparators look out of sync) */
rep(`if(r!==null&&isFinite(+r))AN.ramp=+r`,`void r`);
rep(`bar.append(catB[1],bRun,sSpd,sRmp,bRst,`,`bar.append(catB[1],bRun,sSpd,bRst,`);
rep(`const anSave=()=>{try{localStorage.setItem('ditl.an',JSON.stringify(AN.sv))}catch(e){}};`,`const anSave=()=>{try{localStorage.setItem('ditl.an',JSON.stringify(AN.sv))}catch(e){if(!anSave.w){anSave.w=1;try{msg('The browser refuses to store data (blocked or full): inputs and FORCE will NOT be remembered after reload.')}catch(x){}}}};`);
/* settings */
rep(`const AN={ws:{ac:'auto',as:'tube',aw:1,dw:1},`,`const AN={ws:{ac:'auto',as:'tube',aw:1,dw:1,dc:'live',ds:'solid',fc:'white',vc:'green',vs:1,vf:'mono',vw:600},`);
rep(`const ANCS={amber:`,`const COLS={red:'#ff4d4d',yellow:'#ffe14a',green:'#4be08a',cyan:'#35d0ff',blue:'#4da3ff',magenta:'#ff7ad9',white:'#e6edf3',orange:'#ff8a3d',amber:'#ffb020'},VCS={green:'#8dffb8',amber:'#ffd27a',white:'#f2f5f7',cyan:'#8fe3ff',yellow:'#ffe14a',magenta:'#ff9de6',orange:'#ffb27a'},VFF={mono:"Consolas,'Cascadia Mono',monospace",sans:"'Segoe UI',system-ui,sans-serif",serif:"Georgia,'Times New Roman',serif"};
function anDcol(){const d=AN.ws.dc;return d&&d!=='live'&&COLS[d]?COLS[d]:'var(--live)'}
const ANCS={amber:`);
/* value style (CSS vars) */
rep(`.bd{font:600 var(--bs,2.4px) Consolas,monospace;fill:var(--alv,#ffe7b0);`,`.bd{font:var(--vfw,600) var(--bs,2.4px) var(--vff,Consolas,monospace);fill:var(--vcol,#8dffb8);`);
rep(`.bd.dg{fill:var(--alv,#ffe7b0)}`,`.bd.dg{fill:var(--vcol,#8dffb8)}`);
rep(`bs=Math.max(1.8,Math.min(3.2,(th[th.length>>1]||3)*.8));`,`bs=Math.max(1.8,Math.min(3.2,(th[th.length>>1]||3)*.8))*(+AN.ws.vs||1);`);
rep(`for(const r of [1.8,3,4.8,7,11])`,`for(const r of [1.4,2.4,3.6,5.2,7.5])`);
/* paint: digital colour, tube for digital, forced colour, per-wire look, faint = coloured but dim */
rep(`document.documentElement.style.setProperty('--alv',anLite(ANC));`,`document.documentElement.style.setProperty('--alv',anLite(ANC));{const rs=document.documentElement.style;rs.setProperty('--vcol',AN.ws.vc==='wire'?anLite(ANC):(VCS[AN.ws.vc]||VCS.green));rs.setProperty('--vff',VFF[AN.ws.vf]||VFF.mono);rs.setProperty('--vfw',String(AN.ws.vw||600))}
 const DCc=anDcol(),dTube=AN.ws.ds==='tube',FCOL=AN.ws.fc==='same'?null:(COLS[AN.ws.fc]||'#ffffff');`);
rep(`if(isD){c='#35414a';w=n.dig?.3*dW:.5*aW;o=.55}else if(n.dig){if(on){c='var(--live)';w=.5*dW}else{c='#4a5660';w=.35*dW}}else{c=ANC;w=(tube?.7:.5)*aW}`,`if(isD){c=n.dig?(on?DCc:'#4a5660'):ANC;w=n.dig?.35*dW:(tube?.7:.5)*aW;o=.4}else if(n.dig){if(on){c=DCc;w=(dTube?.7:.5)*dW}else{c='#4a5660';w=(dTube?.6:.35)*dW}}else{c=ANC;w=(tube?.7:.5)*aW}`);
rep(`const fo=S.rt.force[n.id]!==undefined;const sl=selNets&&selNets.has(n.id);if(sl)w+=.45;const dsh=fo?'1.4 .8':null;`,`const lk=(S.look||{})[n.id];if(lk){if(lk.c&&COLS[lk.c]&&!isD)c=COLS[lk.c];if(lk.w)w*=lk.w}
  const fo=S.rt.force[n.id]!==undefined;if(fo&&FCOL)c=FCOL;const sl=selNets&&selNets.has(n.id);if(sl)w+=.45;const dsh=fo?'1.4 .8':null;`);
rep(`if(k){k.style.display=tube?'':'none';`,`if(k){k.style.display=(n.dig?dTube:tube)?'':'none';`);
rep(`if(!n.dig)L.core[n.id]=el('path',{d,stroke:CORE,'stroke-width':.3},go_)`,`L.core[n.id]=el('path',{d,stroke:CORE,'stroke-width':.3},go_)`);
/* T switch: no line in the box, no arrows: the letter of the input in use is coloured */
rep(`const gt=el('g',{},svg);R.tx.forEach(`,`const TXE=new Map(),gt=el('g',{},svg);R.tx.forEach(`);
rep(`e.style.fontFamily="Consolas,'Cascadia Mono',monospace";e.textContent=t.t});`,`e.style.fontFamily="Consolas,'Cascadia Mono',monospace";e.textContent=t.t;TXE.set(t,e)});`);
rep(`up.add(q.p);ut.add(q.t);q.p.lab=q.t.t.trim()}`,`up.add(q.p);ut.add(q.t);q.p.lab=q.t.t.trim();q.p.lt=q.t}`);
{const a=h.indexOf(`t.style.fill='#c9d1d9';const pa=b.pins.find(`);const z=h.indexOf(`dB:mkd(pb),last:null})`,a);if(a<0||z<0)throw new Error('SW overlay');h=h.slice(0,a)+`t.style.fill='#c9d1d9';const pa=b.pins.find(p=>p.n===b.a),pb=b.pins.find(p=>p.n===b.b),le=p=>p&&p.lt&&TXE.get(p.lt)||null;L.ov.push({b,k:'SW',t,ea:le(pa),eb:le(pb),ba:pa&&pa.lt?tcol(pa.lt):null,bb:pb&&pb.lt?tcol(pb.lt):null,last:null})`+h.slice(z+`dB:mkd(pb),last:null})`.length)}
rep(`if(o.k==='SW'){const A=(st.pk||'A')!=='B',sn=A?b.a:b.b,dg=sn>=0&&S.nets[sn]&&S.nets[sn].dig;o.pth.setAttribute('d',A?o.dA:o.dB);o.pth.setAttribute('stroke',dg?'var(--live)':ANC)}`,`if(o.k==='SW'){const A=(st.pk||'A')!=='B',sn=A?b.a:b.b,dg=sn>=0&&S.nets[sn]&&S.nets[sn].dig,col=dg?DCc:ANC,f=(e,on,base)=>{if(!e)return;e.setAttribute('fill',on?col:(base||'#d5dde3'));e.setAttribute('font-weight',on?'800':'400')};f(o.ea,A,o.ba);f(o.eb,!A,o.bb)}`);
rep(`else{key=(st.pk||'A')+(st.fm||'')+ANC;txt='▶'+(st.pk||'A')+(st.fm?' (M)':'');}`,`else{key=(st.pk||'A')+(st.fm||'')+ANC+DCc;txt=''}`);
/* trend arrows: valve / actuator / the AI that measures them */
rep(`s.mv=Math.abs(t-s.pos)>.05;if(b.o.length)out(s.pos);break}`,`s.mv=Math.abs(t-s.pos)>.05;if(s.mv)s.dir=t>s.pos?1:-1;if(b.o.length)out(s.pos);break}`);
rep(`key=pos.toFixed(0)+(mv?'m':'')+col;txt=pos.toFixed(0)+'%';fill=col;op=.3;`,`key=pos.toFixed(0)+(mv?(st.dir>0?'u':'d'):'')+col;txt=(mv?(st.dir>0?'▲':'▼'):'')+pos.toFixed(0)+'%';fill=col;op=.3;`);
rep(`else if(o.k==='ACT'){const pos=st.pos==null?0:st.pos;key=pos.toFixed(0);txt=pos.toFixed(0)+'%';`,`else if(o.k==='ACT'){const pos=st.pos==null?0:st.pos,mv=!!st.mv;key=pos.toFixed(0)+(mv?(st.dir>0?'u':'d'):'');txt=(mv?(st.dir>0?'▲':'▼'):'')+pos.toFixed(0)+'%';`);
rep(`   if(src&&ai){used.add(ai);ai.fb=src}}}`,`   if(src&&ai){used.add(ai);ai.fb=src}}
  S._tr={};for(const b of blk){if(b.k==='AI'&&b.fb)b.pins.filter(p=>p.role==='out').forEach(p=>{S._tr[p.n]=b.fb.id});if(b.k==='ACT')b.o.forEach(n=>{S._tr[n]=b.id})}}`);
rep(`for(const b of L.bd){const x=S.nets[b.n].dig?(v[b.n]>.5?'1':'0'):fmt(v[b.n]);`,`for(const b of L.bd){const q_=S._tr&&S._tr[b.n]!==undefined?S.rt.st[S._tr[b.n]]:null,x=(q_&&q_.mv?(q_.dir>0?'▲':'▼'):'')+(S.nets[b.n].dig?(v[b.n]>.5?'1':'0'):fmt(v[b.n]));`);
/* per-wire look (selected wire card) */
rep(`+(dr?'   · value is computed by the logic; the button FORCE only overrides it':'')}));return}`,`+(dr?'   · value is computed by the logic; the button FORCE only overrides it':'')}));lookRow(d,sh,S,n);return}`);
rep(`function selUpd(d){`,`function lookRow(d,sh,S,n){const cur=(S.look&&S.look[n])||{},st_='background:#0b1013;color:var(--tx);border:1px solid var(--line);padding:2px 4px;width:104px',
  mk=(opts,val,f)=>{const s=h$('select',{style:st_},opts.map(([v,t])=>h$('option',{value:v,txt:t})));s.value=val;s.onchange=()=>f(s.value);return s},
  set=(k,v)=>{S.look=S.look||{};const o=Object.assign({},S.look[n]||{});if(v===''||v==null)delete o[k];else o[k]=k==='w'?+v:v;if(Object.keys(o).length)S.look[n]=o;else delete S.look[n];sv(sh).look=Object.assign({},S.look);anSave();AN.wsr++;paint()};
 d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'Look of this wire'}),mk([['','Colour: default'],['red','Red'],['yellow','Yellow'],['green','Green'],['cyan','Cyan'],['blue','Blue'],['magenta','Magenta'],['white','White'],['orange','Orange'],['amber','Amber']],cur.c||'',v=>set('c',v)),mk([['','Thick: default'],['.6','Thin'],['1.5','Thick'],['2.2','Extra thick']],cur.w?String(cur.w):'',v=>set('w',v))]))}
function selUpd(d){`);
rep(`for(const id in v.sw||{}){const s=S.rt.st[id];if(s&&v.sw[id])s.fm=v.sw[id]}}`,`for(const id in v.sw||{}){const s=S.rt.st[id];if(s&&v.sw[id])s.fm=v.sw[id]}
 S.look=Object.assign({},v.look||{})}`);
rep(`const S=sh.S;S.blk.forEach(b=>{if(b.p0)Object.assign(b.p,JSON.parse(b.p0))});anInit(S)}`,`const S=sh.S;S.look={};S.blk.forEach(b=>{if(b.p0)Object.assign(b.p,JSON.parse(b.p0))});anInit(S)}`);
/* legend + style card */
rep(`<line x1="2" y1="6" x2="22" y2="6" stroke="var(--alive,#ffb020)" stroke-width="3"/></svg>T: the thick line inside = the input in use`,`<text x="3" y="11" font-size="12" font-weight="800" fill="var(--alive,#ffb020)">B</text></svg>T: the letter (A or B) of the input in use is coloured and bold`);
{const i=h.indexOf(`const sel=(label,key,opts)=>{`);const j=h.indexOf(`WD=[['.7','Thin'],['1','Normal'],['1.5','Thick'],['2','Extra thick']];`,i);if(i<0||j<0)throw new Error('sel def');
 h=h.slice(0,i)+`const REDRAW={vs:1,vf:1,vw:1},sel=(label,key,opts)=>{const w=h$('div',{cls:'it'}),s=h$('select',{style:'background:#0b1013;color:#d7e0e6;border:1px solid #2a3640;padding:2px 4px'},opts.map(([v,t])=>h$('option',{value:v,txt:t})));s.value=String(AN.ws[key]);s.onchange=()=>{AN.ws[key]=/^[0-9.]+$/.test(s.value)?+s.value:s.value;wsSave();AN.wsr++;if(REDRAW[key]){AN.key=null;try{render()}catch(e){}}else try{paint()}catch(e){}};w.append(h$('span',{txt:label,style:'width:130px'}),s);return w},`+h.slice(j)}
cut(`d.append(h$('b',{txt:'Wire style (saved)'})`,`top bar.'}))}`,`const CL=[['red','Red'],['yellow','Yellow'],['green','Green'],['cyan','Cyan'],['blue','Blue'],['magenta','Magenta'],['white','White'],['orange','Orange']];
 d.append(h$('b',{txt:'Digital wires (saved)'}),sel('Colour','dc',[['live','Live (top bar)'],...CL]),sel('Line','ds',[['solid','Solid'],['tube','Tube']]),sel('Thickness','dw',WD),
  h$('b',{txt:'Analog wires'}),sel('Colour','ac',[['auto','Auto'],['amber','Amber'],['cyan','Cyan'],['green','Green'],['white','White'],['magenta','Magenta'],['orange','Orange']]),sel('Line','as',[['tube','Tube'],['solid','Solid']]),sel('Thickness','aw',WD),
  h$('b',{txt:'Forced wires (dashed)'}),sel('Colour','fc',[['same','Same as the wire'],['white','White'],['magenta','Magenta'],['cyan','Cyan'],['yellow','Yellow'],['orange','Orange']]),
  h$('b',{txt:'Values (numbers on the drawing)'}),sel('Colour','vc',[['green','Green'],['amber','Amber'],['white','White'],['cyan','Cyan'],['yellow','Yellow'],['magenta','Magenta'],['orange','Orange'],['wire','Like the analog wire']]),sel('Size','vs',[['.8','Small'],['1','Normal'],['1.25','Large'],['1.5','Extra large']]),sel('Font','vf',[['mono','Monospace'],['sans','Sans'],['serif','Serif']]),sel('Weight','vw',[['400','Normal'],['600','Semi-bold'],['800','Bold']]),
  h$('div',{cls:'it',style:'color:#7d8e9a',txt:'Click a wire to change the look of that one wire only.'}))}`);
/* COS next to a T that has only the A wire: the B input of that T is the MANUAL value of the operator (COS = change-over switch). It becomes an input you set (slider). */
rep(` /* rate limiter glyph box next to the text "Ramp" */`,` for(const b of blk)if(b.k==='COS'){b.vnet=nets.length;nets.push({id:nets.length,segs:[],dig:false,ana:0,arrows:[],txt:[],virt:1})}
 /* rate limiter glyph box next to the text "Ramp" */`);
rep(`b.a=A?A.n:-1;b.b=B?B.n:-1;b.i=[`,`b.a=A?A.n:-1;b.b=B?B.n:-1;if(b.k==='AMT'&&b.b<0){const cs=blk.find(q=>q.k==='COS'&&q.vnet!==undefined&&!q.used&&Math.hypot(q.cx-b.cx,q.cy-b.cy)<30);if(cs){cs.used=1;b.b=cs.vnet;b.cosB=1;S.lab[cs.vnet]={t:'COS manual value',d:0,x:cs.cx,y:cs.cy}}}b.i=[`);
rep(`const b=s.blk;if(b.txt&&b.txt.length)d.append(h$('small',{txt:'text: '+b.txt.filter(Boolean).join(' · ')}));`,`const b=s.blk;if(b.txt&&b.txt.length)d.append(h$('small',{txt:'text: '+b.txt.filter(Boolean).join(' · ')}));
 if(b.k==='COS'&&b.used)d.append(h$('div',{cls:'r'},[h$('span',{cls:'n',txt:'Manual value (operator)'}),add(b.vnet,false),ctl(S,sh,b.vnet)]));`);
fs.writeFileSync('ditl-workbench-v1.5.0.html',h);console.log('written',h.length);
