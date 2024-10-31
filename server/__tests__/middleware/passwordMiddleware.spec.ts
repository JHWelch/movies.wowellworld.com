import { NextFunction, Request } from 'express'
import passwordMiddleware from '@server/middleware/passwordMiddleware'
import { beforeEach, describe, expect, jest, it } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mockConfig } from '@tests/support/mockConfig'
import { afterEach } from 'node:test'

const { res, mockClear } = getMockRes()
let req: Request

const nextFunction: NextFunction = jest.fn()

beforeEach(() => {
  mockClear()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Request has no headers', () => {
  beforeEach(() => {
    req = getMockReq()
  })

  it('returns Unauthorized', async () => {
    passwordMiddleware(mockConfig())(req, res, nextFunction)

    expect(res.status).toBeCalledWith(401)
    expect(res.json).toBeCalledWith({ error: 'Something went wrong authenticating you' })
  })
})

describe('Request missing Authorization header', () => {
  beforeEach(() => {
    req = getMockReq({
      headers: {},
    })
  })

  it('returns Unauthorized', async () => {
    passwordMiddleware(mockConfig())(req, res, nextFunction)

    expect(res.status).toBeCalledWith(401)
    expect(res.json).toBeCalledWith({ error: 'Something went wrong authenticating you' })
  })
})

describe('password is set and correct', () => {
  beforeEach(() => {
    req = getMockReq({
      headers: {
        authorization: 'API_PASSWORD',
      },
    })
  })

  it('lets the request continue', async () => {
    passwordMiddleware(mockConfig())(req, res, nextFunction)

    expect(nextFunction).toBeCalledTimes(1)
  })
})

describe('password is empty string', () => {
  beforeEach(() => {
    req = getMockReq({
      headers: {
        authorization: '',
      },
    })
  })

  it('returns Forbidden', async () => {
    passwordMiddleware(mockConfig())(req, res, nextFunction)

    expect(res.status).toBeCalledWith(403)
    expect(res.json).toBeCalledWith({ error: 'Password incorrect' })
  })
})

describe('password is set and incorrect', () => {
  beforeEach(() => {
    req = getMockReq({
      headers: {
        authorization: 'WRONG_PASSWORD',
      },
    })
  })

  it('returns Forbidden', async () => {
    passwordMiddleware(mockConfig())(req, res, nextFunction)

    expect(res.status).toBeCalledWith(403)
    expect(res.json).toBeCalledWith({ error: 'Password incorrect' })
  })
})
