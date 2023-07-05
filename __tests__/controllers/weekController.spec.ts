import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mockIsFullPage, mockNotionEnv, mockQuery, mockWeek } from '../support/notionHelper'
import Notion from '../../src/data/notion'
import WeekController from '../../src/controllers/weekController'
import { Request } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'

const { res, mockClear } = getMockRes()

beforeAll(() => {
  jest.mock('@notionhq/client')
})

beforeEach(() => {
  jest.clearAllMocks()
  mockNotionEnv()
  mockClear()
})

describe('index', () => {
  describe('called without filters', () => {
    let notion: Notion
    let req: Request

    beforeEach(() => {
      mockIsFullPage(true)
      mockQuery([
        mockWeek('id1', '2021-01-01', 'theme1'),
        mockWeek('id2', '2021-01-08', 'theme2'),
        mockWeek('id3', '2021-01-15', 'theme3'),
      ])
      notion = new Notion()
      req = getMockReq()
    })

    it('should return all weeks', async () => {
      await new WeekController(notion).index(req, res)

      expect(res.json).toHaveBeenCalledWith([
        {
          'id': 'id1',
          'date': 'Friday, January 1',
          'isSkipped': false,
          'movies': [],
          'theme': 'theme1',
        }, {
          'id': 'id2',
          'date': 'Friday, January 8',
          'isSkipped': false,
          'movies': [],
          'theme': 'theme2',
        }, {
          'id': 'id3',
          'date': 'Friday, January 15',
          'isSkipped': false,
          'movies': [],
          'theme': 'theme3',
        },
      ])
    })
  })
})
