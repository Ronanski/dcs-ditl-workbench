/* v1.11.0 -> v1.11.1 : PID range from the text in the drawing ("0.0 ~ 65.0 T/H") = 100 % of the deviation (61 of 68 controllers carry it); fallback = range of the transmitter feeding it. */
const fs=require('fs');let h=fs.readFileSync('archive/html/ditl-workbench-v1.11.0.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.11.0</title>','<title>DITL Logic Workbench v1.11.1</title>');
rep(`kind:'analog-project',ver:'1.11.0'`,`kind:'analog-project',ver:'1.11.1'`);
rep(`     if(P.kp==null){P.kp=1;P.ti=60;P.td=0;P.lo=0;P.hi=100}`,`     {const rg=near(b.cx,b.cy,50,t=>/-?\\d+(?:\\.\\d+)?\\s*~\\s*-?\\d+(?:\\.\\d+)?/.test(t.t.trim()))[0];if(rg&&P.span==null){const m=/(-?\\d+(?:\\.\\d+)?)\\s*~\\s*(-?\\d+(?:\\.\\d+)?)\\s*([A-Za-z%\\/°0-9²³]*)/.exec(rg.t.trim());if(m&&Math.abs(+m[2]-+m[1])>0){P.rlo=+m[1];P.rhi=+m[2];P.unit=m[3]||'';P.span=Math.abs(+m[2]-+m[1])}}}
     if(P.kp==null){P.kp=1;P.ti=60;P.td=0;P.lo=0;P.hi=100}`);
rep(`pr('span','Deviation span (engineering units = 100 %)')`,`pr('span','Range span ('+(b.p.unit||'engineering units')+' = 100 %)')`);
rep(`' s (default tuning, edit in the block panel)'`,`' s (default tuning, edit in the block panel)'+(b.p.rlo!=null?' · range '+b.p.rlo+' ~ '+b.p.rhi+' '+(b.p.unit||''):'')`);
fs.writeFileSync('ditl-workbench-v1.11.1.html',h);console.log('ok')
