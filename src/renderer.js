const card = document.getElementById('card')
const viewport = document.getElementById('card-viewport')
const urlForm = document.getElementById('url-form')
const urlInput = document.getElementById('url-input')

function reportViewportBounds() {
  const rect = viewport.getBoundingClientRect()
  window.previewAPI.setBounds({
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  })
}

// ResizeObserver fires on manual drag-resize and on any layout reflow
// (e.g. window resize), so this single hook keeps the native preview
// view pixel-aligned with the DOM card at all times.
const resizeObserver = new ResizeObserver(() => reportViewportBounds())
resizeObserver.observe(viewport)

// Custom edge/corner drag-resize. Handles live in the card's 8px border
// strip, outside the viewport rect, so they stay clickable even though
// WebContentsView paints on top of the DOM within the viewport's bounds.
let dragState = null

function onHandleMouseDown(event) {
  const dir = event.currentTarget.dataset.dir
  const cardRect = card.getBoundingClientRect()
  dragState = {
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

function onMouseMove(event) {
  if (!dragState) return
  const { dir, startX, startY, startLeft, startTop, startWidth, startHeight } = dragState
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

  const minWidth = parseInt(getComputedStyle(card).minWidth, 10) || 0
  const minHeight = parseInt(getComputedStyle(card).minHeight, 10) || 0
  if (width < minWidth) {
    if (dir.includes('w')) left -= minWidth - width
    width = minWidth
  }
  if (height < minHeight) {
    if (dir.includes('n')) top -= minHeight - height
    height = minHeight
  }

  card.style.left = `${left}px`
  card.style.top = `${top}px`
  card.style.width = `${width}px`
  card.style.height = `${height}px`
}

function onMouseUp() {
  dragState = null
}

for (const handle of document.querySelectorAll('.handle')) {
  handle.addEventListener('mousedown', onHandleMouseDown)
}
window.addEventListener('mousemove', onMouseMove)
window.addEventListener('mouseup', onMouseUp)

urlForm.addEventListener('submit', (event) => {
  event.preventDefault()
  let url = urlInput.value.trim()
  if (!url) return
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`
  window.previewAPI.loadURL(url)
})

window.addEventListener('DOMContentLoaded', reportViewportBounds)

;(async () => {
  urlInput.value = await window.previewAPI.getURL()
  reportViewportBounds()
})()
