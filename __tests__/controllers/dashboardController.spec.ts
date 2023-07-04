import DashboardController from '../../src/controllers/dashboardController'
import {beforeEach, describe, expect, it, jest} from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'

const { res, next, mockClear } = getMockRes()

beforeEach(() => {
  mockClear() // can also use clearMockRes()
})

describe('DashboardController', () => {
  describe('index', () => {
    it('should render index view', async () => {
      const mockRequest = getMockReq()

      await DashboardController.index(mockRequest, res)
      expect(res.render).toHaveBeenCalledWith('index')
    })
  })
})
