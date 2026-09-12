import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

type Dir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const HANDLES: Dir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

const MIN_WIDTH = 220
const MIN_HEIGHT = 160

interface DragState {
  dir: Dir
  startX: number
  startY: number
  startLeft: number
  startTop: number
  startWidth: number
  startHeight: number
}

interface ResizableCardProps {
  fullWindow: boolean
}

export default function ResizableCard({ fullWindow }: ResizableCardProps) {
  const [rect, setRect] = useState({ left: 60, top: 60, width: 560, height: 380 })
  const cardRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)

  const reportViewportBounds = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const viewportRect = viewport.getBoundingClientRect()
    window.previewAPI.setBounds({
      x: viewportRect.left,
      y: viewportRect.top,
      width: viewportRect.width,
      height: viewportRect.height,
    })
  }, [])

  // ResizeObserver fires on manual drag-resize and on any layout reflow
  // (e.g. window resize), so this single hook keeps the native preview
  // view pixel-aligned with the DOM card at all times.
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const observer = new ResizeObserver(() => reportViewportBounds())
    observer.observe(viewport)
    reportViewportBounds()
    return () => observer.disconnect()
  }, [reportViewportBounds])

  // Custom edge/corner drag-resize. Handles live in the card's 8px border
  // strip, outside the viewport rect, so they stay clickable even though
  // WebContentsView paints on top of the DOM within the viewport's bounds.
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const drag = dragRef.current
      if (!drag) return
      const { dir, startX, startY, startLeft, startTop, startWidth, startHeight } = drag
      const dx = event.clientX - startX
      const dy = event.clientY - startY

      let left = startLeft
      let top = startTop
      let width = startWidth
      let height = startHeight

      if (dir.includes('e')) width = startWidth + dx
      if (dir.includes('s')) height = startHeight + dy
      if (dir.includes('w')) {
        width = startWidth - dx
        left = startLeft + dx
      }
      if (dir.includes('n')) {
        height = startHeight - dy
        top = startTop + dy
      }

      if (width < MIN_WIDTH) {
        if (dir.includes('w')) left -= MIN_WIDTH - width
        width = MIN_WIDTH
      }
      if (height < MIN_HEIGHT) {
        if (dir.includes('n')) top -= MIN_HEIGHT - height
        height = MIN_HEIGHT
      }

      setRect({ left, top, width, height })
    }

    const onMouseUp = () => {
      dragRef.current = null
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const onHandleMouseDown = (dir: Dir) => (event: ReactMouseEvent) => {
    if (fullWindow) return
    const card = cardRef.current
    if (!card) return
    const cardRect = card.getBoundingClientRect()
    dragRef.current = {
      dir,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: cardRect.left,
      startTop: cardRect.top,
      startWidth: cardRect.width,
      startHeight: cardRect.height,
    }
    event.preventDefault()
  }

  return (
    <div
      ref={cardRef}
      className={fullWindow ? 'card card-full' : 'card'}
      style={fullWindow ? undefined : { left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
    >
      <div ref={viewportRef} className="card-viewport" />
      {!fullWindow &&
        HANDLES.map((dir) => (
          <div
            key={dir}
            className={`handle handle-${dir}`}
            onMouseDown={onHandleMouseDown(dir)}
          />
        ))}
    </div>
  )
}
