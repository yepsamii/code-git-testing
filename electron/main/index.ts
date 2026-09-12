import path from 'node:path'
import { app, BrowserWindow, WebContentsView } from 'electron'
import { registerPreviewIpc } from './ipc'

const DEFAULT_PREVIEW_URL = 'https://electronjs.org'

let win: BrowserWindow | null = null
let chromeView: WebContentsView | null = null
let previewView: WebContentsView | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 750,
    backgroundColor: '#1e1f22',
  })

  chromeView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
    },
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    chromeView.webContents.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    chromeView.webContents.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
  win.contentView.addChildView(chromeView)

  previewView = new WebContentsView()
  previewView.webContents.loadURL(DEFAULT_PREVIEW_URL)
  win.contentView.addChildView(previewView)

  const layoutChromeView = () => {
    if (!win || !chromeView) return
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

registerPreviewIpc(() => previewView, DEFAULT_PREVIEW_URL)

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
