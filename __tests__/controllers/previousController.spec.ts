import PreviousController from '../../src/controllers/previousController'
import { beforeEach, describe, expect, it } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'

const { res, mockClear } = getMockRes()

beforeEach(() => {
  mockClear()
})

describe('index', () => {
  it('should render previous view', async () => {
    const req = getMockReq()

    await PreviousController.index(req, res)

    expect(res.render).toHaveBeenCalledWith('previous/index')
  })
})
