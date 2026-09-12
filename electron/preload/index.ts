import { contextBridge, ipcRenderer } from 'electron'
import type { PreviewAPI, PreviewBounds } from './preview-api'

const previewAPI: PreviewAPI = {
  setBounds: (rect: PreviewBounds) => ipcRenderer.invoke('preview:setBounds', rect),
  loadURL: (url: string) => ipcRenderer.invoke('preview:loadURL', url),
  getURL: () => ipcRenderer.invoke('preview:getURL'),
}

contextBridge.exposeInMainWorld('previewAPI', previewAPI)
