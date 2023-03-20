export class DmBoard extends HTMLElement {
  dragging?: HTMLElement
  offsetX?: number
  offsetY?: number

  constructor() {
    super()
    const observer = new MutationObserver((records) => {
      for (const r of records) for (const n of r.addedNodes) if (n instanceof HTMLElement) this.modifyChild(n)
    })
    observer.observe(this, { childList: true })
    this.ondragover = (ev) => {
      if (!ev.dataTransfer) return
      ev.preventDefault()
      ev.dataTransfer.dropEffect = 'move'
    }
    this.ondrop = (ev) => {
      const elem = this.dragging
      if (!elem || !this.offsetX || !this.offsetY) return
      this.dragging = undefined
      elem.style.left = ev.clientX - elem.clientLeft - this.offsetX + 'px'
      elem.style.top = ev.clientY - elem.clientTop - this.offsetY + 'px'
      this.removeChild(elem)
      this.appendChild(elem)
    }
  }

  modifyChild(child: HTMLElement) {
    child.style.position = 'absolute'
    child.draggable = true
    child.ondragstart = this.getChildDragStart(child)
    child.dispatchEvent(new CustomEvent('moved', { bubbles: true }))
  }

  getChildDragStart(child: HTMLElement): HTMLElement['ondragstart'] {
    return (ev) => {
      this.dragging = child
      const rect = child.getBoundingClientRect()
      this.offsetX = ev.clientX - rect.x
      this.offsetY = ev.clientY - rect.y
    }
  }

  connectedCallback() {
    if (!this.isConnected) return
    this.style.position = 'relative'
    this.style.display = 'block'
    this.style.width = this.style.height = '100%'
    for (const child of this.children) {
      if (child instanceof HTMLElement) this.modifyChild(child)
    }
    this.load()
  }

  src = ''
  value: any[] = []
  async load() {
    // const res = await fetch(this.src, { headers: { Accept: 'application/json' } })
    // this.value = await res.json()
    this.value = [{ id: 'xyz' }]
    for (const v of this.value) {
      this.addChild(v)
    }
  }

  addChild(v: any) {
    const elem = document.createElement('dm-paper')
    console.dir(elem)
    elem.id = v.id
    elem.textContent = JSON.stringify(v)
    elem.classList.add('paper')
    elem.style.top = v.top
    elem.style.left = v.left
    elem.style.position = 'absolute'
    elem.draggable = true
    elem.ondragstart = (ev) => {
      if (!(ev.target instanceof HTMLElement)) return
      this.dragging = elem
      const rect = ev.target.getBoundingClientRect()
      this.offsetX = ev.clientX - rect.x
      this.offsetY = ev.clientY - rect.y
      console.log('offset', this.offsetX, this.offsetY)
    }
  }
}

customElements.define('dm-board', DmBoard)
