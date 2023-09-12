import RedirectController from '../../src/controllers/redirectController'
import { beforeEach, describe, expect, it } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'

const { res, mockClear } = getMockRes()

beforeEach(() => {
  mockClear()
})

describe('sep21', () => {
  it('should return a redirect to notion', async () => {
    const req = getMockReq()

    await RedirectController.sept21(req, res)

    expect(res.redirect)
      .toHaveBeenCalledWith(RedirectController.sept21Url)
  })
})
