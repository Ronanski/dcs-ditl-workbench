/* v1.2.0 -> v1.3.0 : colour-coded symbols (not white), labels placed so they do not overlap, legend popover */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.2.0.html','utf8');
const rep=(a,b,all)=>{const n=h.split(a).length-1;if(!n)throw new Error('NOT FOUND: '+a.slice(0,80));if(n>1&&!all)throw new Error('MULTI '+n+': '+a.slice(0,80));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.2.0</title>','<title>DITL Logic Workbench v1.3.0</title>');
/* colour code per block kind */
rep(`/* analog wires use a colour that differs from the Live colour (the digital one) */`,`/* symbol colour code (wires keep their own simple colours) */
const AN_KC={AND:'#35d6c8',OR:'#35d6c8',NOT:'#35d6c8',FF:'#35d6c8',TON:'#b48cff',TOF:'#b48cff',TPS:'#b48cff',TPV:'#b48cff',HC:'#b4e04a',LC:'#b4e04a',HLC:'#b4e04a',CMPK:'#b4e04a',PVSV:'#b4e04a',DCMP:'#b4e04a',HLLIM:'#b4e04a',SW:'#ff7ad9',AMT:'#ff7ad9',COS:'#ff7ad9',CTK:'#ff7ad9',PID:'#4be08a',PIDV:'#4be08a',MAN:'#4be08a',SUMA:'#4be08a',SUMP:'#4be08a',AI:'#e8c9a0',AO:'#e8c9a0',PO:'#e8c9a0',IP:'#e8c9a0',ALM:'#e8c9a0',FOUT:'#e8c9a0',SIGAB:'#e8c9a0',FIELD:'#e8c9a0',TP:'#e8c9a0',ACT:'#e8c9a0'};
const anKcol=k=>AN_KC[k]||'#5aa9ff';
function anMix(c,bg){const p=s=>{let m=/^#?([0-9a-f]{6})$/i.exec(s);if(m){const n=parseInt(m[1],16);return[n>>16,n>>8&255,n&255]}m=/(\\d+)[,\\s]+(\\d+)[,\\s]+(\\d+)/.exec(s);return m?[+m[1],+m[2],+m[3]]:[11,16,19]},a=p(c),b=p(bg);return 'rgb('+a.map((v,i)=>Math.round(b[i]*.86+v*.14)).join(',')+')'}
/* analog wires use a colour that differs from the Live colour (the digital one) */`);
/* helpers inside drawSheet: block under a point, colour of a symbol part, colour of a text */
rep(`const gt=el('g',{},svg);R.tx.forEach(t=>{const e=el('text',{x:t.x,y:-t.y,'font-size':t.h,fill:'#d5dde3',`,`const blkAt=(x,y,m)=>{let best=null,ba=1e12;for(const b of S.blk){if(b.k==='VLV')continue;if(x>=b.x0-m&&x<=b.x1+m&&y>=b.y0-m&&y<=b.y1+m){const a=(b.x1-b.x0)*(b.y1-b.y0);if(a<ba){ba=a;best=b}}}return best};
  const symC=(x,y)=>{const b=blkAt(x,y,.6);if(b)return anKcol(b.k);for(const c of S.conn.concat(S.xc||[]))if(anD(c.x,c.y,x,y)<=c.r+.6)return '#c9d3dc';return '#aeb9c3'};
  const tcol=t=>{const b=blkAt(t.x,t.y,0);return b?anKcol(b.k):'#d5dde3'};
  const gt=el('g',{},svg);R.tx.forEach(t=>{const e=el('text',{x:t.x,y:-t.y,'font-size':t.h,fill:tcol(t),`);
/* symbols: colour by block */
rep(`const poly=(pts,c)=>el('path',{d:'M'+pts.map(q=>q[0]+' '+-q[1]).join('L')+'Z',fill:BGc,stroke:'#f1f6f9'},gfg);`,`const poly=(pts,c)=>{let sx=0,sy=0;for(const q of pts){sx+=q[0];sy+=q[1]}const col=symC(sx/pts.length,sy/pts.length);return el('path',{d:'M'+pts.map(q=>q[0]+' '+-q[1]).join('L')+'Z',fill:anMix(col,BGc),stroke:col},gfg)};`);
rep(`R.ci.forEach(c=>el('circle',{cx:c.x,cy:-c.y,r:c.r,fill:BGc,stroke:'#f1f6f9'},gfg));`,`R.ci.forEach(c=>{const col=symC(c.x,c.y);el('circle',{cx:c.x,cy:-c.y,r:c.r,fill:anMix(col,BGc),stroke:col},gfg)});`);
rep("const ln=q=>el('path',{d:`M${q.x1} ${-q.y1}L${q.x2} ${-q.y2}`,stroke:'#f1f6f9'},gfg);","const ln=q=>el('path',{d:`M${q.x1} ${-q.y1}L${q.x2} ${-q.y2}`,stroke:symC((q.x1+q.x2)/2,(q.y1+q.y2)/2)},gfg);");
rep(`(S.gate||[]).forEach(g=>{if(g.bar)ln(g.bar)});`,`(S.gate||[]).forEach(g=>{(g.used||[]).forEach(ln);if(g.bar)ln(g.bar)});`);
rep("fill:'none',stroke:'#f1f6f9'},gfg)})}","fill:'none',stroke:symC(a.x,a.y)},gfg)})}");
/* timer: violet bar */
rep(`fl=el('rect',{x:b.x0,y:-b.y0+.5,width:0,height:.9,fill:'var(--live)'`,`fl=el('rect',{x:b.x0,y:-b.y0+.5,width:0,height:.9,fill:'#b48cff'`);
rep(`L.ov.push({b,k:'TMR',tk,fl,t,w,last:null})`,`t.style.fill='#d8c4ff';L.ov.push({b,k:'TMR',tk,fl,t,w,last:null})`);
/* shorter timer text */
rep(`t_='▲ '+sec.toFixed(1)+' / '+sec.toFixed(1)+' s'`,`t_='▲'+(+sec.toFixed(1))+'/'+(+sec.toFixed(1))+'s'`);
rep(`t_='▲ '+acc.toFixed(1)+' / '+sec.toFixed(1)+' s'`,`t_='▲'+acc.toFixed(1)+'/'+(+sec.toFixed(1))+'s'`);
rep(`t_='▼ '+r_.toFixed(1)+' s'`,`t_='▼'+r_.toFixed(1)+'s'`);
rep(`t_='▲ '+Math.min(acc,sec).toFixed(1)+' / '+sec.toFixed(1)+' s'`,`t_='▲'+Math.min(acc,sec).toFixed(1)+'/'+(+sec.toFixed(1))+'s'`);
/* label placement: also avoid wires, look only at what is near, and place the overlay labels (timer, valve %, T) first */
rep(`const place=(ax,ay,chars)=>{const w=chars*bs*.62,h=bs*.95;let best=null;`,`const WB=S.seg.map(s=>[Math.min(s.x1,s.x2)-.3,Math.min(s.y1,s.y2)-.3,Math.max(s.x1,s.x2)+.3,Math.max(s.y1,s.y2)+.3]);
 const place=(ax,ay,chars)=>{const w=chars*bs*.62,h=bs*.95,R2=24,nr=A=>A.filter(q=>q[2]>ax-R2&&q[0]<ax+R2&&q[3]>ay-R2&&q[1]<ay+R2),tb=nr(TB),bb=nr(BB),wb=nr(WB),pb=nr(PB);let best=null;`);
rep(`for(const t of TB)sc+=ovl(bx,t)*8;for(const q of BB)sc+=ovl(bx,q)*3;for(const q of PB)sc+=ovl(bx,q)*12;`,`for(const t of tb)sc+=ovl(bx,t)*8;for(const q of bb)sc+=ovl(bx,q)*3;for(const q of pb)sc+=ovl(bx,q)*12;for(const q of wb)sc+=ovl(bx,q)*2.5;`);
rep(`S.lab.forEach((l,n)=>{if(l&&!S.nets[n].dig)addB(n,l.x,l.y+(l.h||3))});`,`for(const o of L.ov){const b=o.b;let ch,ax,ay;if(o.k==='TMR'){ch=10;ax=b.cx;ay=b.y0-1.6}else if(o.k==='VLV'){ch=5;ax=b.x1;ay=b.cy}else if(o.k==='SW'){ch=5;ax=b.x1;ay=b.y0}else continue;
   const q=place(ax,ay,ch);o.t.setAttribute('x',q.x);o.t.setAttribute('y',-(q.y+bs*.2));o.t.setAttribute('text-anchor','start')}
 S.lab.forEach((l,n)=>{if(l&&!S.nets[n].dig)addB(n,l.x,l.y+(l.h||3))});`);
/* legend popover */
rep(`.lg{display:inline-flex;`,`#anlg{display:none;position:fixed;top:100px;right:310px;z-index:70;background:#0f1a22;border:1px solid #2b4a5a;padding:10px 14px;font:12px sans-serif;color:#cfd8dc;max-width:380px;box-shadow:0 6px 24px #000a}#anlg b{display:block;margin:8px 0 3px;color:#8fb5c9;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase}#anlg b:first-child{margin-top:0}#anlg .it{display:flex;gap:8px;align-items:center;margin:3px 0}#anlg .sw{flex:none;width:24px;height:13px;border:2px solid;box-sizing:border-box;border-radius:2px}#anlg .dt{flex:none;width:13px;height:13px;border-radius:50%}#anlg svg{flex:none;display:block;width:24px;height:13px}
.lg{display:inline-flex;`);
const g0=h.indexOf('function lgd(){');const g1=h.indexOf('\n',g0);
h=h.slice(0,g0)+`function lgd(){const s=h$('span',{cls:'lg'});s.innerHTML='<i><svg width="30" height="12"><line x1="0" y1="6" x2="30" y2="6" stroke="var(--live)" stroke-width="1.6"/></svg>digital</i><i><svg width="30" height="12"><line x1="0" y1="6" x2="30" y2="6" stroke="var(--alive,#ffb020)" stroke-width="5"/><line x1="0" y1="6" x2="30" y2="6" stroke="#0f1418" stroke-width="2"/></svg>analog</i>';
 const bt=h$('button',{txt:'Legend ▾',title:'Colour code of the symbols, valves and wires'});bt.onclick=()=>{const p=$('anlg');p.style.display=p.style.display==='block'?'none':'block'};s.append(bt);return s}
{const d=h$('div',{id:'anlg'}),sw=(c,t)=>'<div class="it"><span class="sw" style="border-color:'+c+';background:'+anMix(c,'#0b1013')+'"></span>'+t+'</div>',dt=(c,t)=>'<div class="it"><span class="dt" style="background:'+c+'"></span>'+t+'</div>';
 d.innerHTML='<b>Symbols</b>'+sw('#35d6c8','Logic gates: AND, OR, NOT, flip-flop')+sw('#b48cff','Timers: ON delay, OFF delay, pulse (count shown under the timer)')+sw('#b4e04a','Comparators: H/ L/ &gt; &lt;')+sw('#ff7ad9','T switch (select A / B), COS')+sw('#4be08a','Controllers: PID, manual station')+sw('#e8c9a0','Inputs / outputs: AI, AO, I/P, alarm, output flags')+sw('#5aa9ff','Math and signal: sum, difference, multiply, F(X), lag, ramp, limits, selectors, constants')+sw('#c9d3dc','Numbered connector circles')+sw('#aeb9c3','Other shapes')+'<b>Control valve</b>'+dt('#35e08a','closed')+dt('#ff4d4d','open')+dt('#ffffff','moving')+dt('#4da3ff','stopped half open')+'<b>Wires</b><div class="it"><svg width="24" height="13"><line x1="0" y1="6" x2="24" y2="6" stroke="var(--live)" stroke-width="1.6"/></svg>digital: Live colour = 1, grey = 0</div><div class="it"><svg width="24" height="13"><line x1="0" y1="6" x2="24" y2="6" stroke="var(--alive,#ffb020)" stroke-width="5"/><line x1="0" y1="6" x2="24" y2="6" stroke="#0f1418" stroke-width="2"/></svg>analog: always coloured (a value is flowing)</div><div class="it"><svg width="24" height="13"><line x1="0" y1="6" x2="24" y2="6" stroke="#35414a" stroke-width="2" opacity=".6"/></svg>faint: nobody follows it (T input not selected)</div><div class="it"><svg width="24" height="13"><circle cx="12" cy="6" r="4.5" fill="var(--alive,#ffb020)"/></svg>T: filled ring = the input in use</div>';document.body.append(d)}`+h.slice(g1);
fs.writeFileSync('ditl-workbench-v1.3.0.html',h);console.log('written',h.length);
