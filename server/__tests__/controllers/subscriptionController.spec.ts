
import { beforeEach, describe, expect, it } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import SubscriptionController
  from '../../src/controllers/subscriptionController'
import { Request } from 'express'

const { res, mockClear } = getMockRes()
let req: Request


beforeEach(() => {
  mockClear()
})

interface MockBodyArgs {
  email?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const mockBody = ({
  email = 'test@example.com',
}: MockBodyArgs = {}) => ({ email })

describe('store', () => {
  describe('all fields correct', () => {
    beforeEach(() => {
      req = getMockReq({
        body: mockBody(),
      })
    })

    it('should return 200', async () => {
      await SubscriptionController.store(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })
})
