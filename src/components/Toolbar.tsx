import type { FormEvent } from 'react'
import type { ViewMode } from '../App'

interface ToolbarProps {
  url: string
  viewMode: ViewMode
  onUrlChange: (value: string) => void
  onSubmit: (value: string) => void
  onToggleViewMode: () => void
}

export default function Toolbar({ url, viewMode, onUrlChange, onSubmit, onToggleViewMode }: ToolbarProps) {
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
        <button
          type="button"
          className="view-toggle"
          onClick={onToggleViewMode}
          title={viewMode === 'card' ? 'Switch to full window' : 'Switch to resizable card'}
        >
          {viewMode === 'card' ? 'Full window' : 'Card'}
        </button>
      </form>
    </header>
  )
}
