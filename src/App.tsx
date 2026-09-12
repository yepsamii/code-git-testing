import { useEffect, useState } from 'react'
import Toolbar from './components/Toolbar'
import ResizableCard from './components/ResizableCard'

export default function App() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    window.previewAPI.getURL().then(setUrl)
  }, [])

  const handleLoadUrl = (value: string) => {
    let target = value.trim()
    if (!target) return
    if (!/^https?:\/\//i.test(target)) target = `https://${target}`
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
