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
