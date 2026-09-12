import { useEffect, useState } from 'react'
import Toolbar from './components/Toolbar'
import ResizableCard from './components/ResizableCard'
import { resolveAddress } from './lib/resolve-address'

export default function App() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    window.previewAPI.getURL().then(setUrl)
  }, [])

  const handleLoadUrl = (value: string) => {
    if (!value.trim()) return
    const target = resolveAddress(value)
    window.previewAPI.loadURL(target)
    setUrl(target)
  }

  return (
    <>
      <Toolbar url={url} onUrlChange={setUrl} onSubmit={handleLoadUrl} />
      <main className="stage">
        <ResizableCard />
      </main>
    </>
  )
}
