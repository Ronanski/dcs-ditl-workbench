/* v1.0.1 -> v1.1.0 : analog look. Symbols stand out over wires; analog wire = tube, digital wire = thin line; T switch shows the active input. */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.0.1.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,70));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,70));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.0.1</title>','<title>DITL Logic Workbench v1.1.0</title>');
/* CSS: legend */
rep('#anshbox{display:none;align-items:center;gap:4px}body.an #anshbox{display:flex}','#anshbox{display:none;align-items:center;gap:4px}body.an #anshbox{display:flex}\n.lg{display:inline-flex;gap:14px;align-items:center;color:var(--dim);font-size:11px}.lg i{white-space:nowrap;display:inline-flex;align-items:center;gap:5px;font-style:normal}');
/* dim the raw CAD lines under the live wires */
rep(`const g0=el('g',{fill:'none','stroke-width':.25,'stroke-linecap':'round'},svg)`,`const g0=el('g',{fill:'none','stroke-width':.25,'stroke-linecap':'round','stroke-opacity':.5},svg)`);
/* analog wire = tube: add a dark core path on top of the coloured one */
rep(`S.nets.forEach(n=>{if(!n.segs.length)return;let d=n.segs.map`,`const CORE=(()=>{try{const c=getComputedStyle($('cv')).backgroundColor;return c&&c!=='rgba(0, 0, 0, 0)'?c:'#0b1013'}catch(e){return '#0b1013'}})();L.core=[];
 S.nets.forEach(n=>{if(!n.segs.length)return;let d=n.segs.map`);
rep(`L.nets[n.id]=el('path',{d,stroke:'none','stroke-width':.55},go_)});`,`L.nets[n.id]=el('path',{d,stroke:'none','stroke-width':.55},go_);if(!n.dig)L.core[n.id]=el('path',{d,stroke:CORE,'stroke-width':.3},go_)});`);
/* symbols: bright + thicker */
rep(`const gfg=el('g',{'stroke-width':.25,`,`const gfg=el('g',{'stroke-width':.6,`);
rep(`stroke:'#b8c2cb'`,`stroke:'#f1f6f9'`,true);
/* T switch: ring on both inputs, filled on the active one */
rep(`t.style.fill='#c9d1d9';L.ov.push({b,k:'SW',t,last:null})`,`t.style.fill='#c9d1d9';const pa=b.pins.find(p=>p.n===b.a),pb=b.pins.find(p=>p.n===b.b),mk=p=>p?el('circle',{cx:p.x,cy:-p.y,r:1.15,fill:'none',stroke:'#7d8e9a','stroke-width':.3,'pointer-events':'none'},gb):null;L.ov.push({b,k:'SW',t,ca:mk(pa),cb:mk(pb),last:null})`);
rep(`else{key=(st.pk||'A')+(st.fm||'');txt='▶'+(st.pk||'A')+(st.fm?' (M)':'');}
  if(o.last!==key){o.last=key;`,`else{key=(st.pk||'A')+(st.fm||'')+ANC;txt='▶'+(st.pk||'A')+(st.fm?' (M)':'');}
  if(o.last!==key){o.last=key;if(o.k==='SW'){const A=(st.pk||'A')!=='B',dg=S.nets[b.a>=0?b.a:b.b]&&S.nets[b.a>=0?b.a:b.b].dig,col=dg?'var(--live)':ANC;if(o.ca){o.ca.setAttribute('fill',A?col:'none');o.ca.setAttribute('stroke',A?col:'#7d8e9a')}if(o.cb){o.cb.setAttribute('fill',A?'none':col);o.cb.setAttribute('stroke',A?'#7d8e9a':col)}}`);
/* paint: wire styles */
const a0=h.indexOf(' for(const n of S.nets){const e=L.nets[n.id];if(!e)continue;let c,w;');const a1=h.indexOf('\n',a0);if(a0<0)throw new Error('paint loop');
h=h.slice(0,a0)+` const ANC=anColor();document.documentElement.style.setProperty('--alive',ANC);
 for(const n of S.nets){const e=L.nets[n.id];if(!e)continue;let c,w,o=1;const isD=dead.has(n.id),on=n.dig?v[n.id]>.5:Math.abs(v[n.id])>1e-6;
  /* digital = thin line (live colour when 1); analog = tube (analog colour when it carries a value); not-selected T input = faint */
  if(isD){c='#35414a';w=n.dig?.3:.55;o=.55}else if(on){c=n.dig?'var(--live)':ANC;w=n.dig?.5:.7}else{c='#4a5660';w=n.dig?.35:.7}
  const fo=S.rt.force[n.id]!==undefined;const sl=selNets&&selNets.has(n.id);if(sl)w+=.45;const dsh=fo?'1.4 .8':null;
  if(e._c!==c||e._d!==dsh||e._w!==w||e._o!==o){e._c=c;e._d=dsh;e._w=w;e._o=o;e.setAttribute('stroke',c);e.setAttribute('stroke-width',w);e.setAttribute('stroke-opacity',o);if(dsh)e.setAttribute('stroke-dasharray',dsh);else e.removeAttribute('stroke-dasharray');
   const k=L.core&&L.core[n.id];if(k){k.setAttribute('stroke-width',w*.32);if(dsh)k.setAttribute('stroke-dasharray',dsh);else k.removeAttribute('stroke-dasharray')}}}`+h.slice(a1);
/* dead (not selected) input: digital too */
rep(`for(const[u,c]of cnt)if(new Set((S.cns[u]||[]).map(b=>b.id)).size<=c)dead.add(u)}`,`for(const[u,c]of cnt)if(new Set((S.cns[u]||[]).map(b=>b.id)).size<=c)dead.add(u)}`);
/* helper + legend */
rep(`function paint(){`,`/* analog wires use a colour that differs from the Live colour (the digital one) */
function anColor(){const l=($('slive')||{}).value;return l==='Yellow'||l==='Green'||l==='Magenta'?'#35d0ff':'#ffb020'}
function lgd(){const s=h$('span',{cls:'lg'});s.innerHTML='<i><svg width="30" height="12"><line x1="0" y1="6" x2="30" y2="6" stroke="var(--live)" stroke-width="1.6"/></svg>digital</i><i><svg width="30" height="12"><line x1="0" y1="6" x2="30" y2="6" stroke="var(--alive,#ffb020)" stroke-width="5"/><line x1="0" y1="6" x2="30" y2="6" stroke="#0f1418" stroke-width="2"/></svg>analog</i><i><svg width="14" height="12"><circle cx="7" cy="6" r="4" fill="var(--alive,#ffb020)" stroke="var(--alive,#ffb020)"/></svg>T active input</i>';return s}
function paint(){`);
rep(`h$('span',{cls:'sp'}),h$('small',{txt:S.blk.length+' blocks`,`h$('span',{cls:'sp'}),lgd(),h$('small',{txt:S.blk.length+' blocks`);
fs.writeFileSync('ditl-workbench-v1.1.0.html',h);console.log('written',h.length);
