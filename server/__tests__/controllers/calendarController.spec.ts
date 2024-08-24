import CalendarController from '@server/controllers/calendarController'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { beforeEach, describe, expect, it } from '@jest/globals'
import { mockConfig } from '@tests/support/mockConfig'
import Config from '@server/config/config'

const { res, mockClear } = getMockRes()

let config: Config

beforeEach(() => {
  mockClear()
  config = mockConfig()
})

describe('index', () => {
  it('should respond with a redirect to the calendar from config', async () => {
    const req = getMockReq()

    await new CalendarController(config).index(req, res)

    expect(res.redirect).toHaveBeenCalledWith(config.calendarUrl)
  })
})
