/* user finding 18: the texts "( FROM DITL 13-69 )", "TO DITL 07-05, DITL 13-22", "ABC-003B" (the sheet index) were not clickable.  Now every such token on an analog sheet is a link: ABC-xxx opens that analog sheet, DITL nn opens that digital page.  A click that was a drag (pan) does nothing. */
module.exports=(rep,repAll)=>{
rep(` svg.append(g0,go_,gleg,gd,gfg,gf,gp,gt,gcj,L.selg,gb);`,` const gx=el('g',{class:'xref'},svg);{const RX=/(ABC-\\d{3}[A-Z]?)|DITL[ -]?(\\d{1,2}[A-H]?)-\\d{1,3}/g;let nx=0;
  for(const t of S.tx){const str=String(t.t),w=(t.h||3)*.62,h=(t.h||3);let m;RX.lastIndex=0;
   while((m=RX.exec(str))){const ab=m[1],dp=m[2],tok=m[0];let tgt=null;
    if(ab){if(ab===sh.name)continue;if(AN.sheets.some(z=>z.name===ab))tgt={a:ab}}
    else if(dp){const pg='DITL-'+(/^\\d[A-H]?$/.test(dp)?'0'+dp:dp);tgt={d:pg}}
    if(!tgt)continue;nx++;const x0=t.x+m.index*w,r=el('rect',{x:x0-.4,y:-(t.y+h*.75),width:tok.length*w+.8,height:h*1.3,fill:'transparent',stroke:'none',style:'cursor:pointer'},gx),u=el('line',{x1:x0,x2:x0+tok.length*w,y1:-(t.y-h*.15),y2:-(t.y-h*.15),stroke:'#5aa9ff','stroke-width':.25,'stroke-dasharray':'1 .8',opacity:.8,'pointer-events':'none'},gx);
    const ti=el('title',{},r);ti.textContent='Go to '+(tgt.a||tgt.d);r._xr=tgt;
    r.addEventListener('mouseenter',()=>u.setAttribute('opacity',1));r.addEventListener('mouseleave',()=>u.setAttribute('opacity',.8))}}
  /* the sheet keeps the pointer captured (pan), so the click is read at document level: a press and release within 5 px on a link area */
  if(!AN._xr){AN._xr=1;let d0=null;document.addEventListener('pointerdown',e=>{d0=e.target&&e.target._xr?[e.clientX,e.clientY]:null},true);document.addEventListener('pointerup',e=>{if(!d0||Math.hypot(e.clientX-d0[0],e.clientY-d0[1])>5)return;d0=null;const t=document.elementFromPoint(e.clientX,e.clientY);if(t&&t._xr){e.stopPropagation();AN.xrefGo(t._xr)}},true)}
  L.nXref=nx}
 svg.append(g0,go_,gleg,gd,gfg,gf,gp,gt,gcj,L.selg,gb,gx);`);
rep(`function setCat(c){`,`AN.xrefGo=tg=>{if(tg.a){const i=AN.sheets.findIndex(z=>z.name===tg.a);if(i>=0){if(AN.cat!=='an')setCat('an');AN.go(i)}return}
 const o=[...document.querySelectorAll('#shsel option')].find(x=>new RegExp('\\\\)'+tg.d+'$').test(x.textContent));if(!o){msg('Digital page '+tg.d+' was not found');return}
 setCat('dig');const ss=document.getElementById('shsel');ss.value=o.value;ss.dispatchEvent(new Event('change'));msg('Opened '+tg.d+' - use the "Analog · ABC" tab to come back')};
function setCat(c){`);
};
