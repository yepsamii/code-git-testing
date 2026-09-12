import { useEffect, useState } from 'react'
import Toolbar from './components/Toolbar'
import ResizableCard from './components/ResizableCard'
import { resolveAddress } from './lib/resolve-address'

export type ViewMode = 'card' | 'full'

export default function App() {
  const [url, setUrl] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('card')

  useEffect(() => {
    window.previewAPI.getURL().then(setUrl)
  }, [])

  const handleLoadUrl = (value: string) => {
    if (!value.trim()) return
    const target = resolveAddress(value)
    window.previewAPI.loadURL(target)
    setUrl(target)
  }

  const toggleViewMode = () => {
    setViewMode((mode) => (mode === 'card' ? 'full' : 'card'))
  }

  return (
    <>
      <Toolbar
        url={url}
        viewMode={viewMode}
        onUrlChange={setUrl}
        onSubmit={handleLoadUrl}
        onToggleViewMode={toggleViewMode}
      />
      <main className="stage">
        <ResizableCard fullWindow={viewMode === 'full'} />
      </main>
    </>
  )
}
