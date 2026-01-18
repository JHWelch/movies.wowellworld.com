import { Request, Response } from 'express'
import { Mock, vi } from 'vitest'

const getMockReq = (overrides: object = {}): Request => {
  return {
    query: {},
    ...overrides,
  } as unknown as Request
}

const getMockRes = (): {
  res: Response
  mockClear: () => void
} => {
  const res: Partial<Response> = {}

  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  res.end = vi.fn().mockReturnValue(res)
  res.redirect = vi.fn().mockReturnValue(res)
  res.sendStatus = vi.fn().mockReturnValue(res)
  res.type = vi.fn().mockReturnValue(res)

  const mockClear = () => {
    ;(res.status as Mock).mockClear()
    ;(res.json as Mock).mockClear()
    ;(res.send as Mock).mockClear()
    ;(res.end as Mock).mockClear()
    ;(res.type as Mock).mockClear()
  }

  return {
    res: res as Response,
    mockClear,
  }
}

export {
  getMockReq,
  getMockRes,
}
