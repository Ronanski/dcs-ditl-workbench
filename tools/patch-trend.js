/* v1.15.3 WIP: live TREND of the selected block or wire (PID, MAN, FX, integrators, ramps, valves ... any block): small chart in the selection panel (normal view) + big overlay (Zoom).
   Series: PID / PIDV = SV, PV (the two inputs of the DEV block that feeds the PID) and MV; any other block = its input and output nets; a wire = that wire.
   History is kept per sheet for the wires being watched, one sample every 0.25 simulated seconds, up to 10 minutes; starts when you select the block. */
module.exports=(rep)=>{
rep(String.raw`function whyTxt(S,b){`,String.raw`const TR_COL=['#4da3ff','#ff8a3d','#35e08a','#ff4dd0','#ffd84d','#9b8cff','#7fe0e0'],TR_DT=.25,TR_CAP=2400;
function trSeries(sh){const S=sh.S,s=AN.sel;if(!s)return[];const out=[],add=(n,name)=>{if(n==null||n<0||!S.nets[n]||out.some(q=>q.n===n))return;out.push({n,name:name||nm(S,n)})};
 if(s.blk){const b=s.blk;if((b.k==='PID'||b.k==='PIDV')&&b.in0>=0){const d=(S.drv[b.in0]||[]).map(x=>S.blk.find(q=>q.id===x.id)).find(q=>q&&q.ip&&q.ip.length>=2);
   if(d){const pl=d.ip.find(q=>q.sg>0),mi=d.ip.find(q=>q.sg<0);if(pl)add(pl.n,'SV '+nm(S,pl.n));if(mi)add(mi.n,'PV '+nm(S,mi.n))}else add(b.in0,'deviation '+nm(S,b.in0));
   (b.o||[]).slice(0,1).forEach(n=>add(n,'MV '+nm(S,n)))}
  else{(b.i||[]).slice(0,4).forEach((n,i)=>add(n,'in '+nm(S,n)));(b.o||[]).slice(0,3).forEach(n=>add(n,'out '+nm(S,n)))}}
 else if(s.net!=null)add(s.net);return out}
function trSample(sh){const S=sh&&sh.S;if(!S)return;const w=sh._tw=sh._tw||new Map(),h=sh._th=sh._th||{t:[]},t=S.rt.t;
 if(h.t.length&&t<h.t[h.t.length-1]-1e-6){h.t.length=0;w.forEach(a=>a.length=0)}
 for(const q of trSeries(sh)){if(!w.has(q.n)){if(w.size>=24){const k=w.keys().next().value;w.delete(k)}w.set(q.n,new Array(h.t.length).fill(null))}}
 if(h.t.length&&t-h.t[h.t.length-1]<TR_DT-1e-9)return;if(!w.size)return;h.t.push(t);w.forEach((a,n)=>a.push(S.rt.v[n]));
 if(h.t.length>TR_CAP){h.t.shift();w.forEach(a=>a.shift())}}
function trDraw(cv,sh,ser,o){const S=sh.S,h=sh._th||{t:[]},w=sh._tw||new Map(),ctx=cv.getContext('2d'),W=cv.width,H=cv.height,pl=44,pr=6,pt=6,pb=16;ctx.clearRect(0,0,W,H);ctx.fillStyle='#0b1013';ctx.fillRect(0,0,W,H);
 const T=h.t,n=T.length;ctx.font='10px sans-serif';
 if(n<2){ctx.fillStyle='#8a9';ctx.fillText('No data yet: press ▶ Run (or Next ▶).',pl,H/2);return}
 const tEnd=T[n-1],win=o.win>0?o.win:(T[n-1]-T[0]),t1=o.off!=null?o.off+win:tEnd,t0=t1-win;
 let i0=0;while(i0<n-1&&T[i0+1]<t0)i0++;
 const data=ser.map(q=>({q,a:w.get(q.n)||[]})).filter(x=>x.a.length&&!o.hide.has(x.q.n)),stat=data.map(x=>{let lo=1e30,hi=-1e30;for(let i=i0;i<n;i++){const v=x.a[i];if(v==null||T[i]>t1)continue;if(v<lo)lo=v;if(v>hi)hi=v}if(lo>hi){lo=0;hi=1}if(hi-lo<1e-9){lo-=.5;hi+=.5}const pad=(hi-lo)*.08;return{lo:lo-pad,hi:hi+pad}});
 let own=o.own;if(own==null){const r=stat.map(s=>s.hi-s.lo);own=r.length>1&&Math.max(...r)/Math.max(1e-9,Math.min(...r))>4}o.autoOwn=own;
 const gl=Math.min(...stat.map(s=>s.lo)),gh=Math.max(...stat.map(s=>s.hi)),X=t=>pl+(t-t0)/(t1-t0)*(W-pl-pr),Y=(v,s)=>{const lo=own?s.lo:gl,hi=own?s.hi:gh;return H-pb-(v-lo)/(hi-lo)*(H-pt-pb)};
 ctx.strokeStyle='#26323a';ctx.lineWidth=1;ctx.fillStyle='#8a9';
 for(let k=0;k<=4;k++){const y=pt+k*(H-pt-pb)/4;ctx.beginPath();ctx.moveTo(pl,y);ctx.lineTo(W-pr,y);ctx.stroke();if(!own||data.length===1){const v=(own?stat[0]:{lo:gl,hi:gh});const val=v.hi-(v.hi-v.lo)*k/4;ctx.fillText(Math.abs(val)>=100?val.toFixed(0):val.toFixed(1),2,y+3)}}
 for(let k=0;k<=4;k++){const t=t0+k*(t1-t0)/4,x=X(t);ctx.beginPath();ctx.moveTo(x,pt);ctx.lineTo(x,H-pb);ctx.stroke();ctx.fillText(fmtT(Math.max(0,t)),Math.min(x-8,W-40),H-3)}
 if(own&&data.length>1)ctx.fillText('each trace on its own scale',pl+4,pt+10);
 data.forEach((x,k)=>{const col=TR_COL[ser.indexOf(x.q)%TR_COL.length],dg=S.nets[x.q.n].dig;ctx.strokeStyle=col;ctx.lineWidth=o.big?2:1.5;ctx.beginPath();let st=false,py=0;
  for(let i=Math.max(0,i0-1);i<n;i++){const v=x.a[i];if(v==null)continue;const xx=X(T[i]),yy=Y(v,stat[k]);if(!st){ctx.moveTo(xx,yy);st=true}else{if(dg)ctx.lineTo(xx,py);ctx.lineTo(xx,yy)}py=yy;if(T[i]>t1)break}ctx.stroke()})}
function trendUi(d){const sh=cs();if(!sh||!sh.S)return;const ser=trSeries(sh);if(!ser.length)return;const S=sh.S;trSample(sh);
 const o={win:60,own:null,hide:new Set(),off:null},cv=h$('canvas',{width:300,height:130,style:'width:100%;height:130px;background:#0b1013;border:1px solid var(--line);margin-top:4px'});
 const leg=h$('div',{style:'font-size:11px;margin-top:2px'}),wsel=h$('select',{style:'pointer-events:auto;opacity:1'},[['30 s',30],['1 min',60],['5 min',300],['10 min',600],['All',0]].map(([t,v])=>h$('option',{value:v,txt:t})));wsel.value='60';wsel.onchange=()=>{o.win=+wsel.value;o.off=null;draw()};
 const bz=h$('button',{cls:'keep',txt:'Zoom ⤢',title:'Big trend window (wheel = time zoom, drag = move in time)'}),bc=h$('button',{cls:'keep',txt:'Clear',title:'Forget the history of this sheet'});bc.onclick=()=>{sh._th=null;sh._tw=null;trSample(sh);draw()};
 d.append(h$('h4',{txt:'Trend'}),h$('div',{cls:'r'},[wsel,bz,bc]),cv,leg);
 const legend=()=>{leg.innerHTML='';ser.forEach((q,k)=>{const sp=h$('span',{style:'margin-right:8px;white-space:nowrap'});const sw=h$('span',{txt:'■ ',style:'color:'+TR_COL[k%TR_COL.length]});const v=S.rt.v[q.n];sp.append(sw,document.createTextNode(q.name+' = '+(S.nets[q.n].dig?(v>.5?'1':'0'):fmt(v))));leg.append(sp)})};
 const draw=()=>{if(!cv.isConnected)return;trDraw(cv,sh,ser,o);legend()};draw();PU.push(()=>{if(cv.isConnected&&cs()===sh){trSample(sh);draw()}});
 bz.onclick=()=>trZoom(sh,ser,o)}
function trZoom(sh,ser,o0){const old=document.getElementById('trbig');if(old)old.remove();const o=Object.assign({},o0,{big:true,hide:new Set(o0.hide)}),S=sh.S;
 const ov=h$('div',{id:'trbig',style:'position:fixed;inset:4vh 4vw;background:#0b1013;border:1px solid var(--acc,#3a6);z-index:99999;padding:8px;display:flex;flex-direction:column'}),cv=h$('canvas',{width:1200,height:520,style:'width:100%;flex:1;min-height:0;background:#0b1013'});
 const bar=h$('div',{style:'display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px'}),ws=h$('select',{},[['30 s',30],['1 min',60],['5 min',300],['10 min',600],['All',0]].map(([t,v])=>h$('option',{value:v,txt:t})));ws.value=String(o.win);ws.onchange=()=>{o.win=+ws.value;o.off=null};
 const own=h$('label',{},[h$('input',{type:'checkbox'}),document.createTextNode(' each trace on its own scale')]);own.firstChild.checked=o.own==null?false:o.own;own.firstChild.onchange=()=>{o.own=own.firstChild.checked};
 const live=h$('button',{txt:'Follow live',onclick:()=>{o.off=null}}),cl=h$('button',{txt:'✕ Close',onclick:()=>{ov.remove();clearInterval(tm)}});
 bar.append(h$('b',{txt:sh.name+' · Trend'}),ws,own,live,cl,h$('small',{txt:'wheel = zoom in time · drag = move in time · click a name to hide / show a trace'}));
 const leg=h$('div',{style:'margin-top:6px;font-size:12px'});ov.append(bar,cv,leg);document.body.append(ov);
 const draw=()=>{trSample(sh);trDraw(cv,sh,ser,o);if(o.own==null&&document.activeElement!==own.firstChild)own.firstChild.checked=!!o.autoOwn;leg.innerHTML='';ser.forEach((q,k)=>{const v=S.rt.v[q.n],sp=h$('span',{style:'margin-right:12px;cursor:pointer;white-space:nowrap;opacity:'+(o.hide.has(q.n)?.35:1)},[h$('span',{txt:'■ ',style:'color:'+TR_COL[k%TR_COL.length]}),document.createTextNode(q.name+' = '+(S.nets[q.n].dig?(v>.5?'1':'0'):fmt(v)))]);sp.onclick=()=>{o.hide.has(q.n)?o.hide.delete(q.n):o.hide.add(q.n)};leg.append(sp)})};
 const tm=setInterval(()=>{if(!ov.isConnected){clearInterval(tm);return}draw()},250);draw();
 cv.onwheel=e=>{e.preventDefault();const h=sh._th&&sh._th.t||[];if(h.length<2)return;const full=h[h.length-1]-h[0],cur=o.win>0?o.win:full;const nw=Math.max(5,Math.min(Math.max(full,5),cur*(e.deltaY>0?1.25:.8)));const end=o.off!=null?o.off+cur:h[h.length-1];o.win=nw;o.off=Math.max(h[0],end-nw);if(o.off+nw>=h[h.length-1]-1e-6)o.off=null;ws.value=''};
 let dr=null;cv.onmousedown=e=>{dr={x:e.clientX,off:o.off}};addEventListener('mouseup',()=>{dr=null});cv.onmousemove=e=>{if(!dr)return;const h=sh._th&&sh._th.t||[];if(h.length<2)return;const cur=o.win>0?o.win:h[h.length-1]-h[0],dt=-(e.clientX-dr.x)/cv.clientWidth*cur,base=dr.off!=null?dr.off:h[h.length-1]-cur;o.off=Math.max(h[0],Math.min(h[h.length-1]-cur,base+dt));if(o.win<=0)o.off=null};
 addEventListener('keydown',function k(e){if(!ov.isConnected){removeEventListener('keydown',k,true);return}if(e.key==='Escape'){e.stopPropagation();ov.remove();clearInterval(tm);removeEventListener('keydown',k,true)}},true)}
function whyTxt(S,b){`);

rep(String.raw`function panelUpd(sel){const sh=cs();if(!sh||!sh.S)return;`,String.raw`function panelUpd(sel){const sh=cs();if(!sh||!sh.S)return;try{trSample(sh)}catch(e){}`);
rep(String.raw`panelUpd,selBox,dsIdx,dsOpen});`,String.raw`panelUpd,selBox,dsIdx,dsOpen,trSeries,trSample,trDraw,trZoom});`);
};
