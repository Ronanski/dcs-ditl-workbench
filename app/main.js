/* DCS Engineering Station - Electron shell. OFFLINE: every network request is blocked. */
const {app,BrowserWindow,ipcMain,dialog,session,Menu}=require('electron');
const path=require('path'),fs=require('fs');
let win;
function create(){
  win=new BrowserWindow({width:1500,height:900,backgroundColor:'#0b1013',title:'Logic Sim',
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  Menu.setApplicationMenu(null);
  session.defaultSession.webRequest.onBeforeRequest((d,cb)=>cb({cancel:!/^(file|devtools|data|blob|chrome-extension):/i.test(d.url)}));
  win.loadFile(path.join(__dirname,'ui','index.html'));
  win.webContents.on('before-input-event',(e,i)=>{if(i.type==='keyDown'&&(i.key==='F12'||(i.control&&i.shift&&i.key.toLowerCase()==='i')))win.webContents.toggleDevTools()});
}
const FILT=[{name:'Project file',extensions:['json','dcsproj']}];
ipcMain.handle('fs:save',async(_e,p,text,suggested)=>{
  let target=p;
  if(!target){const r=await dialog.showSaveDialog(win,{defaultPath:suggested||'plant-project.json',filters:FILT});if(r.canceled||!r.filePath)return null;target=r.filePath}
  fs.writeFileSync(target,text,'utf8');return{path:target,name:path.basename(target)};
});
ipcMain.handle('fs:open',async()=>{
  const r=await dialog.showOpenDialog(win,{properties:['openFile'],filters:FILT});if(r.canceled||!r.filePaths.length)return null;
  const f=r.filePaths[0];return{path:f,name:path.basename(f),text:fs.readFileSync(f,'utf8')};
});
app.whenReady().then(create);
app.on('window-all-closed',()=>app.quit());
