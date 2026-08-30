const path = require('node:path')
const { app, BrowserWindow, WebContentsView, ipcMain } = require('electron')

const DEFAULT_PREVIEW_URL = 'https://electronjs.org'

let win
let chromeView
let previewView

function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 750,
    backgroundColor: '#1e1f22',
    webPreferences: {
      // chrome view needs no special privileges; kept minimal
    },
  })

  chromeView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  chromeView.webContents.loadFile(path.join(__dirname, 'index.html'))
  win.contentView.addChildView(chromeView)

  previewView = new WebContentsView()
  previewView.webContents.loadURL(DEFAULT_PREVIEW_URL)
  win.contentView.addChildView(previewView)

  const layoutChromeView = () => {
    const { width, height } = win.getContentBounds()
    chromeView.setBounds({ x: 0, y: 0, width, height })
  }

  layoutChromeView()
  win.on('resize', layoutChromeView)

  win.on('closed', () => {
    win = null
    chromeView = null
    previewView = null
  })
}

ipcMain.handle('preview:setBounds', (_event, rect) => {
  if (!previewView) return
  previewView.setBounds({
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.max(0, Math.round(rect.width)),
    height: Math.max(0, Math.round(rect.height)),
  })
})

ipcMain.handle('preview:loadURL', (_event, url) => {
  if (!previewView) return
  return previewView.webContents.loadURL(url)
})

ipcMain.handle('preview:getURL', () => {
  return previewView ? previewView.webContents.getURL() : DEFAULT_PREVIEW_URL
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
