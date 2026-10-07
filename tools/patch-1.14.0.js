/* v1.13.1 -> v1.14.0: three modes (VIEW default / RUN / PAUSE with Back + Next), auto-trace in VIEW, thin solid wires, grey when not energized. DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('archive/html/logic-sim-v1.13.1.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.13.1</title>','<title>Logic Sim v1.14.0</title>');
/* buttons + bar */
rep(fs.readFileSync('tools/f-btn-old.txt','utf8'),fs.readFileSync('tools/f-btn-new.txt','utf8'));
rep(`bRun,bS1,bS2,bS3,sSpd,bRst,bFit,bVal,bVw,bTr,sLv,`,`bVw,bRun,bSb,sStp,bSn,sSpd,bRst,bFit,bVal,sLv,`);
/* logic: replace the whole F block */
rep(fs.readFileSync('tools/f-code-old.txt','utf8'),fs.readFileSync('tools/f-code-new.txt','utf8'));
/* wire style defaults + migration */
rep(`ws:{th:'color',ac:'auto',as:'tube'`,`ws:{th:'color',ac:'auto',as:'solid',wv:2`);
h=h.split('Object.assign(AN.ws,').join('wsIn(');
/* paint: VIEW = plain grey; analog wire grey until it carries a value; no looks / force colours in VIEW */
rep(`if(n.pn){c='var(--pnc)';w=.8*aW}else if(isD){c='#3b4651';w=n.dig?wd_:wa_;o=1}else if(n.dig){c=on?DCc:'#3b4651';w=wd_}else{c=ANC;w=wa_}`,`if(AN.view){c='#7f8d99';w=n.dig?wd_:wa_;o=1}else if(n.pn){c='var(--pnc)';w=.8*aW}else if(isD){c='#3b4651';w=n.dig?wd_:wa_;o=1}else if(n.dig){c=on?DCc:'#3b4651';w=wd_}else{c=ANC;w=wa_}`);
rep(`const lk=(S.look||{})[n.id];if(lk){`,`const lk=(S.look||{})[n.id];if(lk&&!AN.view){`);
rep(`const fo=S.rt.force[n.id]!==undefined;if(fo&&FCOL)c=FCOL;`,`const fo=!AN.view&&S.rt.force[n.id]!==undefined;if(fo&&FCOL)c=FCOL;`);
rep(`if(!hal&&AN.flh&&AN.flh.has(n.id))hal=TFL}`,`if(hal&&AN.view){c='#dfe7ed';w+=.3}}`);
rep(`dim=(g.side==='a')===(pk==='B'),ne=L.nets[g.n]`,`dim=!AN.view&&(g.side==='a')===(pk==='B'),ne=L.nets[g.n]`);
rep(`L.gb.style.display=vb?'':'none';if(vb)for(`,`L.gb.style.display=(vb&&!AN.view)?'':'none';if(vb&&!AN.view)for(`);
rep(`c=on&&ne?ne._c:'none'`,`c=(on||AN.view)&&ne?ne._c:'none'`);
rep(`function paint(){const sh=cs();if(!sh||!sh.S||!L)return;`,`function paint(){const sh=cs();if(!sh||!sh.S||!L)return;try{stepUi()}catch(e){}`);
/* history while running */
rep(`const dt=.1*AN.spd,n=Math.max(1,Math.ceil(dt/.5));for(let i=0;i<n;i++)stepSet(sh,dt/n);`,`const dt=.1*AN.spd,n=Math.max(1,Math.ceil(dt/.5));histRec(sh,1);for(let i=0;i<n;i++)stepSet(sh,dt/n);`);
rep(`;anInit(S)}
 const sh=cs();`,`;anInit(S);sh._hs=[]}
 const sh=cs();`);
/* VIEW: click = select / trace only, never an input */
rep(`function digClick(sh,n,shift){if(AN.view){msg('View mode: inputs are off. Turn View off to change a signal.');return}`,`function digClick(sh,n,shift){if(AN.view){AN.sel={net:n};selBox();paint();panelFor(true);panelUpd(true);rowFocus('n'+n);return}`);
rep(`if(best.k==='SIGAB'){`,`if(best.k==='SIGAB'&&!AN.view){`);
rep(`only move after you press ▶ Run.`,`only move after you press ▶ Run or Next ▶.`);
fs.writeFileSync('logic-sim-v1.14.0.html',h);console.log('html written',h.length);
