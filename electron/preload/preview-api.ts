export interface PreviewBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface PreviewAPI {
  setBounds: (rect: PreviewBounds) => Promise<void>
  loadURL: (url: string) => Promise<void>
  getURL: () => Promise<string>
}
