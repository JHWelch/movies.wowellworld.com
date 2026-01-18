import RedirectController from '@server/controllers/redirectController'
import { beforeEach, expect, it } from 'vitest'
import { getMockReq, getMockRes } from '@tests/support/expressMocks'

const { res, mockClear } = getMockRes()

beforeEach(() => {
  mockClear()
})

it('can redirect to a given url', () => {
  const req = getMockReq()
  const url = 'https://example.com'

  RedirectController.redirect(req, res, url)
  expect(res.redirect).toHaveBeenCalledWith(url)
})
