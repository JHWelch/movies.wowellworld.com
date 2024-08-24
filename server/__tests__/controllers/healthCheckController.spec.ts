
import { beforeEach, describe, expect, it } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import HealthCheckController from '@server/controllers/healthCheckController'

const { res, mockClear } = getMockRes()

beforeEach(() => {
  mockClear()
})

describe('index', () => {
  it('should respond ok', async () => {
    const req = getMockReq()

    await HealthCheckController.index(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith('ok')
  })
})
