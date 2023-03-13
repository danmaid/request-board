import { expect, test } from 'vitest'
import { Request } from './Request'

test('xxx', async () => {
  const x = new Request()
  expect(x.id).toStrictEqual(expect.any(String))
})
