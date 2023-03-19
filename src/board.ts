export class DmBoard extends HTMLElement {
  constructor() {
    super()
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = `
      <div>hoge</div>
      <div style="opacity: 0.2"><slot>slot</slot></div>
      <div><slot name="named">named</slot></div>
      <slot name="item"><template>hoge</template></slot>
    `
    const itemSlot = root.querySelector('slot[name="item"]') as HTMLSlotElement
    const itemTemplate = itemSlot.assignedElements({ flatten: true })[0]
    console.log(itemTemplate)
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
      child.style.left = Math.floor(Math.random() * (1 + maxX - child.offsetWidth)) + 'px'
      child.style.top = Math.floor(Math.random() * (1 + maxY - child.offsetHeight)) + 'px'
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
    const elem = document.createElement('div')
    elem.id = v.id
    elem.value = v
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
    this.append(elem)
  }
}

customElements.define('dm-board', DmBoard)
