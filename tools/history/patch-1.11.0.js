/* v1.10.2 -> v1.11.0 : REAL PID (was: output = input). Input = deviation (DEV: SV - PV) as drawn; ACT:R/N from the drawing; Kp / Ti / Td editable per block (DEFAULT values: the real ones are in the DCS database); output limits; anti-windup; bumpless tracking while the T/AMT downstream is not on this controller. DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('archive/html/ditl-workbench-v1.10.2.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.10.2</title>','<title>DITL Logic Workbench v1.11.0</title>');
rep(`kind:'analog-project',ver:'1.10.2'`,`kind:'analog-project',ver:'1.11.0'`);
/* span of the deviation (engineering units = 100 %): range of the transmitter that feeds it */
rep(` for(const n of S.ext){rt.ext[n]=S.nets[n].dig?0:0}
 rt.ramp=`,` for(const b of S.blk)if((b.k==='PID'||b.k==='PIDV')&&b.in0>=0&&b.p.span==null){let sp=null;const seen=new Set([b.in0]),q=[b.in0];for(let g=0;q.length&&g<80&&sp==null;g++){const n=q.shift();for(const d of S.drv[n]||[]){if(d.k==='AI'&&d.rng){sp=Math.abs(d.rng.hi-d.rng.lo);break}for(const m of d.i||[])if(!seen.has(m)){seen.add(m);q.push(m)}}}b.p.span=sp>0?sp:100}
 for(const n of S.ext){rt.ext[n]=S.nets[n].dig?0:0}
 rt.ramp=`);
rep(`   case 'PID':case 'PIDV':{const t=Math.max(P.lo,Math.min(P.hi,rd(b.in0)));s.out=slew(s.out===0&&!s.inited?null:s.out,t,Math.max(1e-9,P.hi-P.lo)*2);s.inited=1;out(s.out);break}/* TEMPORARY (agreed): the controller just passes its input to its output */`,`   case 'PID':case 'PIDV':{/* v1.11.0: input = deviation e = SV - PV (EU). Reverse action (ACT:R, P.act<0): PV below SV -> output up. u = Kp*(es + I/Ti + Td*des/dt), es in % of span; clamped to [lo,hi], integral frozen / back-calculated at the limits; while the downstream selector is on another input the controller TRACKS it (bumpless) */
    const span=Math.max(1e-9,P.span||100),sg=P.act<0?1:-1,es=sg*rd(b.in0)/span*100,lo=P.lo,hi=P.hi,kp=P.kp==null?1:P.kp;let u,Dt=0;
    if(s.trk!=null){u=Math.max(lo,Math.min(hi,s.trk));s.I=u-kp*es}
    else{if(s.inited&&dt>0){if(P.ti>0){const sat=(s.out>=hi&&es>0)||(s.out<=lo&&es<0);if(!sat)s.I+=kp*es/P.ti*dt}if(P.td>0)Dt=kp*P.td*(es-(s.ep||0))/dt}
     u=kp*es+s.I+Dt;if(u>hi){s.I-=u-hi;u=hi}else if(u<lo){s.I+=lo-u;u=lo}}
    s.ep=es;s.out=u;s.inited=1;out(u);break}`);
/* panel */
rep(`(b.k==='PID'||b.k==='PIDV'?'  · temporary: output follows input (0–100), moves at a limited rate':'')`,`(b.k==='PID'||b.k==='PIDV'?'  · '+(b.p.act<0?'reverse':'direct')+' action · Kp '+b.p.kp+' · Ti '+b.p.ti+' s · Td '+b.p.td+' s (default tuning, edit in the block panel)':'')`);
rep(`if(b.k==='PID'||b.k==='PIDV'){pr('lo','Output low');pr('hi','Output high');d.append(h$('small',{txt:'PID is TEMPORARY in this simulator: the output follows the input, limited to the output range (no tuning yet).'}))}`,`if(b.k==='PID'||b.k==='PIDV'){pr('kp','Gain Kp (% output per % of span)');pr('ti','Integral time Ti (s, 0 = off)');pr('td','Derivative time Td (s)');pr('span','Deviation span (engineering units = 100 %)');pr('lo','Output low');pr('hi','Output high');d.append(h$('small',{txt:'The input is the DEVIATION (SV − PV) as drawn; action '+(b.p.act<0?'REVERSE (ACT:R)':'DIRECT')+' comes from the drawing. Kp / Ti / Td are DEFAULT values (the real tuning is in the DCS database, not in the drawings): edit them here. While the T / AMT after the controller is on another input, the controller tracks it (bumpless).'}))}`);
/* the ACT:R / ACT:N text sits above the box, not at its corner: nearest within 40 of the centre (v1.10.2 read 0 of 68 correctly: all became "direct"). Normal = direct (PV up -> output up), R = reverse; matches the drawings (steam pressure blow-off = N, flow / level feed = R) */
rep(`const at=near(b.x0,b.y1,16,t=>/^ACT\\s*:\\s*[RN]/i.test(t.t.trim()))[0];`,`const at=near(b.cx,b.cy,40,t=>/^ACT\\s*:\\s*[RN]/i.test(t.t.trim()))[0];`);
fs.writeFileSync('ditl-workbench-v1.11.0.html',h);console.log('ok')
