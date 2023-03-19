import crypto from 'node:crypto'

export type RequestRank = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

function getNextWeek(): Date {
  const date = new Date()
  date.setDate(date.getDate() + 8)
  date.setHours(0, 0, 0, 0)
  return date
}

export class Request {
  id = crypto.randomUUID()
  title: string = ''
  description: string = ''
  acceptance: string = ''
  reward: string = ''
  rank: RequestRank = 'F'
  deadline: Date = getNextWeek()
  assigned?: string
  requester: string = ''

  constructor(init?: Partial<Request>) {
    Object.assign(this, init)
  }

  isWanted(): boolean {
    return !this.assigned
  }
}

function getRequestsFromEvents(events: { request?: string }[]): Request[] {
  const map = new Map<Request['id'], Request>()
  for (const event of events) {
    if (!event.request) continue
    const id = event.request
    map.delete(id)
    map.set(id, new Request({ ...event, id }))
  }
  return Array.from(map.values())
}

function getRequests(): Request[] {
  return getRequestsFromEvents([])
}

export function getWantedRequests(): Request[] {
  return getRequests().filter((v) => v.isWanted())
}

function limitOffset<T>(array: T[], limit = 100, offset = 0): T[] {
  return array.slice(offset, limit + offset)
}

function pickFields<T extends Record<string, unknown>>(value: T, fields: (keyof T)[]): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([k]) => fields.includes(k))) as Partial<T>
}

function getStringFilter(mode: FilterMode = 'partial'): (value: string, expected: string) => boolean {
  if (mode === 'partial') return (v, e) => !!v.match(e)
  if (mode === 'exact') return (v, e) => v === e
  if (mode === 'forward') return (v, e) => v.startsWith(e)
  if (mode === 'backward') return (v, e) => v.endsWith(e)
  throw Error('Unsupport filter mode.', mode)
}

type FilterMode = 'partial' | 'exact' | 'forward' | 'backward'
function kvFilter<T extends Record<string, unknown>>(value: T, kv: Partial<T>, mode?: FilterMode): boolean {
  const stringFilter = getStringFilter(mode)
  for (const [k, e] of Object.entries(kv)) {
    const v = value[k]
    if (v == e) continue
    if (typeof v !== 'string') return false
    if (!stringFilter(v, e)) return false
  }
  return true
}

interface QueryParams extends Record<string, unknown> {
  limit?: number
  offset?: number
  fields?: string[]
  filter?: FilterMode
  sort?: string[]
}
export function getList({ limit, offset, fields, sort, filter, ...kv }: QueryParams): unknown[] {
  const list: Record<string, unknown>[] = []
  const x = limitOffset(list, limit, offset)
  const y = Object.keys(kv).length > 0 ? x.filter((v) => kvFilter(v, kv, filter)) : x
  const z = fields ? y.map((v) => pickFields(v, fields)) : y
  return z
}
