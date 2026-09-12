import type { PreviewAPI } from '../../electron/preload/preview-api'

export type { PreviewAPI, PreviewBounds } from '../../electron/preload/preview-api'

declare global {
  interface Window {
    previewAPI: PreviewAPI
  }
}
