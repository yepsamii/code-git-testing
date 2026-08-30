const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('previewAPI', {
  setBounds: (rect) => ipcRenderer.invoke('preview:setBounds', rect),
  loadURL: (url) => ipcRenderer.invoke('preview:loadURL', url),
  getURL: () => ipcRenderer.invoke('preview:getURL'),
})
