import DashboardController from '../../src/controllers/dashboardController'
import { beforeEach, describe, expect, it } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'

const { res, mockClear } = getMockRes()

beforeEach(() => {
  mockClear()
})

describe('index', () => {
  it('should render index view', async () => {
    const req = getMockReq()

    await DashboardController.index(req, res)

    expect(res.render).toHaveBeenCalledWith('index')
  })
})
