/* v1.20.7 -> v1.20.8. Requirements batch "LogicSim v1.20.7 Claude Requirements GROUPED" (2026-10-10).
   usage: node tools/patch-1.20.8.js   (reads archive/html/logic-sim-v1.20.7.html or the root file, writes logic-sim-v1.20.8.html) */
const fs=require('fs');const src=fs.existsSync('logic-sim-v1.20.7.html')?'logic-sim-v1.20.7.html':'archive/html/logic-sim-v1.20.7.html';let h=fs.readFileSync(src,'utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.20.7</title>','<title>Logic Sim v1.20.8</title>');
/* Section 9: UI scope. Plant model button, Plant window button, Save, Save as, Open, project label / file input, Import ABC DXF and the Imports report are taken out of the toolbar (code kept, nothing reachable). Ctrl+S is off. The Process-model block of the PID panel is not shown. Audit-report save / export is a separate feature and is not touched. */
rep(`bar.append(catB[1],bSv,bSa,bOp,lPrj,fPrj,bVw,bRun,bSb,sStp,bSn,sSpd,bRst,bFit,bVal,sLv,sTh,bBk,bHp,bLn,bAs,bIm,bDs,bPm,bPl,bPn,lImp,shb,tClk);`,`bar.append(catB[1],bVw,bRun,bSb,sStp,bSn,sSpd,bRst,bFit,bVal,sLv,sTh,bBk,bHp,bLn,bAs,bDs,bPn,shb,tClk);`);
rep(`e.key.toLowerCase()==='s'){e.preventDefault();e.stopPropagation();prjSave(false)}`,`e.key.toLowerCase()==='s'){e.preventDefault();e.stopPropagation()/* v1.20.8: Save is removed from the UI */}`);
rep(`function procPanel(d,b,sh){const p=b.proc;`,`function procPanel(d,b,sh){return;const p=b.proc;`);
require('./patch-fx-1.20.8.js')(rep);
fs.writeFileSync('logic-sim-v1.20.8.html',h);console.log('written logic-sim-v1.20.8.html',h.length);
