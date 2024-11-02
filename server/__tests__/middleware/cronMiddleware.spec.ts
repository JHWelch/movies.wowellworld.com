import { NextFunction, Request } from 'express'
import cronMiddleware from '@server/middleware/cronMiddleware'
import { beforeEach, describe, expect, jest, it } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'

const { res, mockClear } = getMockRes()
let req: Request

const nextFunction: NextFunction = jest.fn()

beforeEach(() => {
  mockClear()
})

describe('Request has no headers', () => {
  beforeEach(() => {
    req = getMockReq()
  })

  it('returns missing error', async () => {
    cronMiddleware(req, res, nextFunction)

    expect(res.status).toBeCalledWith(401)
    expect(res.json).toBeCalledWith({
      error: 'Missing X-Appengine-Cron header',
    })
  })
})

describe('Request missing X-Appengine-Cron header', () => {
  beforeEach(() => {
    req = getMockReq({
      headers: {},
    })
  })

  it('returns missing error', async () => {
    cronMiddleware(req, res, nextFunction)

    expect(res.status).toBeCalledWith(401)
    expect(res.json).toBeCalledWith({
      error: 'Missing X-Appengine-Cron header',
    })
  })
})

describe('X-Appengine-Cron is set', () => {
  beforeEach(() => {
    req = getMockReq({ headers: {
      'x-appengine-cron': 'true',
    } })
  })

  it('lets the request continue', async () => {
    cronMiddleware(req, res, nextFunction)

    expect(nextFunction).toBeCalledTimes(1)
  })
})
