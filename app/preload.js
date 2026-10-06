const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('nativeFS',{
  save:(path,text,suggested)=>ipcRenderer.invoke('fs:save',path,text,suggested),
  open:()=>ipcRenderer.invoke('fs:open')
});
