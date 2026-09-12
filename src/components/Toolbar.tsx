import type { FormEvent } from 'react'

interface ToolbarProps {
  url: string
  onUrlChange: (value: string) => void
  onSubmit: (value: string) => void
}

export default function Toolbar({ url, onUrlChange, onSubmit }: ToolbarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(url)
  }

  return (
    <header className="toolbar">
      <span className="toolbar-title">Resizable preview card</span>
      <form className="url-form" onSubmit={handleSubmit}>
        <input
          type="text"
          spellCheck={false}
          placeholder="https://example.com"
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
        />
        <button type="submit">Go</button>
      </form>
    </header>
  )
}
