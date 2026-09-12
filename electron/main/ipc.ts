import { ipcMain, WebContentsView } from 'electron'

export interface PreviewBounds {
  x: number
  y: number
  width: number
  height: number
}

export function registerPreviewIpc(getPreviewView: () => WebContentsView | null, defaultUrl: string) {
  ipcMain.handle('preview:setBounds', (_event, rect: PreviewBounds) => {
    const previewView = getPreviewView()
    if (!previewView) return
    previewView.setBounds({
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.max(0, Math.round(rect.width)),
      height: Math.max(0, Math.round(rect.height)),
    })
  })

  ipcMain.handle('preview:loadURL', (_event, url: string) => {
    const previewView = getPreviewView()
    if (!previewView) return
    return previewView.webContents.loadURL(url)
  })

  ipcMain.handle('preview:getURL', () => {
    const previewView = getPreviewView()
    return previewView ? previewView.webContents.getURL() : defaultUrl
  })
}
