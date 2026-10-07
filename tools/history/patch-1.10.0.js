/* v1.9.2 -> v1.10.0 : PROJECT FILE. Save / Save as / Open a .json project file on disk (analog page only): inputs, forces, switches, settings, current sheet. Works from the html in Chrome and in the desktop app. DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('ditl-workbench-v1.9.2.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>DITL Logic Workbench v1.9.2</title>','<title>DITL Logic Workbench v1.10.0</title>');
rep(`const sRmp=h$('select',`,`const bSv=h$('button',{txt:'💾 Save',title:'Save the project file (Ctrl+S). First time asks where; after that it overwrites the same file.'}),bSa=h$('button',{txt:'Save as…',title:'Save the project to a new file'}),bOp=h$('button',{txt:'📂 Open',title:'Open a project file'}),lPrj=h$('span',{style:'color:var(--dim);font:12px Consolas,monospace;max-width:16ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap',txt:'no project file'}),fPrj=h$('input',{type:'file',accept:'.json,.dcsproj',style:'display:none'});
/* ---- project file (v1.10.0) ---- */
const PRJ={fh:null,name:''};
const prjLbl=()=>{lPrj.textContent=PRJ.name||'no project file';lPrj.title=PRJ.name?'Project file: '+PRJ.name:''};
const prjData=()=>JSON.stringify({app:'dcs-ditl-workbench',kind:'analog-project',ver:'1.10.0',saved:new Date().toISOString(),sv:AN.sv,ws:AN.ws,cur:(AN.sheets[AN.i]||{}).name||null},null,1);
const PJT=[{description:'Project file',accept:{'application/json':['.json']}}];
async function prjSave(as){const txt=prjData();
 if(window.nativeFS){try{const r=await nativeFS.save(as?null:PRJ.path,txt,PRJ.name||'plant-project.json');if(!r)return;PRJ.path=r.path;PRJ.name=r.name;prjLbl();msg('Project saved: '+r.path);return}catch(e){msg('Save failed: '+e.message);return}}
 if(window.showSaveFilePicker){try{if(as||!PRJ.fh)PRJ.fh=await showSaveFilePicker({suggestedName:PRJ.name||'plant-project.json',types:PJT});const w=await PRJ.fh.createWritable();await w.write(txt);await w.close();PRJ.name=PRJ.fh.name;prjLbl();msg('Project saved: '+PRJ.name);return}catch(e){if(e&&e.name==='AbortError')return;console.error(e)}}
 const a=h$('a',{href:URL.createObjectURL(new Blob([txt],{type:'application/json'})),download:PRJ.name||'plant-project.json'});document.body.append(a);a.click();a.remove();msg('Project downloaded (this browser cannot overwrite a file: use the same name next time)')}
function prjApply(o,nm){if(!o||typeof o!=='object'||(!o.sv&&!o.ws))throw new Error('not a project file');
 AN.sv=(o.sv&&typeof o.sv==='object')?o.sv:{};if(o.ws)Object.assign(AN.ws,o.ws);if(o.cur)AN._cur=o.cur;anSave();wsSave();
 for(const sh of AN.sheets){delete sh.S;delete sh.lk}AN.tagIdx=null;AN.hist=[];updBack();const i=AN.sheets.findIndex(s=>s.name===(o.cur||''));AN.i=i>=0?i:AN.i;AN.key=null;AN.lkey=null;AN.sel=null;PRJ.name=nm||PRJ.name;prjLbl();render();msg('Project opened: '+(nm||'file'))}
async function prjOpen(){if(window.nativeFS){try{const r=await nativeFS.open();if(!r)return;prjApply(JSON.parse(r.text),r.name);PRJ.path=r.path}catch(e){msg('Cannot read that file: '+e.message)}return}
 if(window.showOpenFilePicker){try{const[fh]=await showOpenFilePicker({types:PJT});const f=await fh.getFile();prjApply(JSON.parse(await f.text()),fh.name);PRJ.fh=fh;return}catch(e){if(e&&e.name==='AbortError')return;if(!(e instanceof SyntaxError)&&!/not a project/.test(e.message)){console.error(e)}else{msg('Cannot read that file: '+e.message);return}}}
 fPrj.click()}
fPrj.onchange=async()=>{const f=fPrj.files[0];fPrj.value='';if(!f)return;try{prjApply(JSON.parse(await f.text()),f.name);PRJ.fh=null}catch(e){msg('Cannot read that file: '+e.message)}};
bSv.onclick=()=>prjSave(false);bSa.onclick=()=>prjSave(true);bOp.onclick=()=>prjOpen();
addEventListener('keydown',e=>{if(AN.cat==='an'&&(e.ctrlKey||e.metaKey)&&!e.shiftKey&&!e.altKey&&e.key.toLowerCase()==='s'){e.preventDefault();e.stopPropagation();prjSave(false)}},true);
const sRmp=h$('select',`);
rep(`bar.append(catB[1],bRun,`,`bar.append(catB[1],bSv,bSa,bOp,lPrj,fPrj,bRun,`);
fs.writeFileSync('ditl-workbench-v1.10.0.html',h);console.log('ok')
