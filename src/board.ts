export class DmRequestBoard extends HTMLElement {
  //   root: ShadowRoot
  //   constructor() {
  //     super()
  //     this.root = this.attachShadow({ mode: 'open' })
  //     this.root.innerHTML = `<div>hoge</div>`
  //   }
  constructor() {
    super()
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

  dragging?: HTMLElement
  offsetX?: number
  offsetY?: number

  connectedCallback() {
    if (!this.isConnected) return
    const maxX = this.clientWidth
    const maxY = this.clientHeight
    console.log('max', maxX, maxY)
    for (const child of this.children) {
      if (!(child instanceof HTMLElement)) continue
      child.style.position = 'absolute'
      child.style.left =
        Math.floor(Math.random() * (1 + maxX - child.offsetWidth)) + 'px'
      child.style.top =
        Math.floor(Math.random() * (1 + maxY - child.offsetHeight)) + 'px'
      child.draggable = true
      child.ondragstart = (ev) => {
        if (!(ev.target instanceof HTMLElement)) return
        this.dragging = child
        const rect = ev.target.getBoundingClientRect()
        this.offsetX = ev.clientX - rect.x
        this.offsetY = ev.clientY - rect.y
        console.log('offset', this.offsetX, this.offsetY)
      }
    }
  }
}

customElements.define('dm-request-board', DmRequestBoard)
