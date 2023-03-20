import { expect, test } from 'vitest'
import { DmBoard } from './board'

test('子要素を任意の位置に配置できること', async () => {
  document.body.innerHTML = `
    <dm-board>
      <div style="left: 10px; top: 10px">xxxx</div>
      <div style="left: 20px; top: 20px">yyyy</div>
    </dm-board>
  `
  const board = document.querySelector('dm-board') as DmBoard
  expect(board).toBeInstanceOf(DmBoard)

  for (const child of board.children) {
    expect(child).toBeInstanceOf(HTMLElement)
    expect((child as HTMLElement).style.position).toBe('absolute')
  }
  expect.assertions(5)
})

test('子要素を任意の位置に移動できること', async () => {
  document.body.innerHTML = `
    <dm-board>
      <div id="xxx">xxx</div>
      <div id="yyy">yyy</div>
    </dm-board>
  `
  const board = document.querySelector('dm-board') as DmBoard
  expect(board).toBeInstanceOf(DmBoard)

  for (const elem of board.children) {
    expect(elem).toBeInstanceOf(HTMLElement)
    const c = elem as HTMLElement
    expect(c.draggable).toBe(true)
    expect(c.ondragstart).toBeInstanceOf(Function)
  }
})

test('外部から子要素を追加できること', async () => {
  document.body.innerHTML = `<dm-board></dm-board>`
  const board = document.querySelector('dm-board') as DmBoard
  expect(board).toBeInstanceOf(DmBoard)

  const div = document.createElement('div')
  expect(div.style.position).toBe('')
  board.appendChild(div)
  const n = await new Promise<Event>((r) => board.addEventListener('moved', r))
  expect(n.target).toBe(div)
  for (const child of board.children) {
    expect(child).toBeInstanceOf(HTMLElement)
    expect((child as HTMLElement).style.position).toBe('absolute')
  }
  expect(div.style.position).toBe('absolute')
  expect.assertions(6)
})

test.todo('子要素の移動時、イベントを発行すること')
test.todo('子要素の重なり順を指定できること')
