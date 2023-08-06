import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { NotionMock } from '../support/notionMock'
import { getMockReq, getMockRes } from '@jest-mock/express'
import Notion from '../../src/data/notion'
import CacheController from '../../src/controllers/cacheController'
import { doc, Firestore } from 'firebase/firestore'
import { transaction } from '../../__mocks__/firebase/firestore'
import { Request } from 'express'
import Week from '../../src/models/week'
import setupFirestore from '../../src/config/firestore'


let notionMock: NotionMock

const { res, mockClear } = getMockRes()

beforeAll(() => {
  jest.mock('@notionhq/client')
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')
  jest.mock('firebase/firestore')

  notionMock = new NotionMock()
})

beforeEach(() => {
  jest.clearAllMocks()
  notionMock.mockNotionEnv()
  mockClear()
})

describe('cache', () => {
  let firestore: Firestore
  let notion: Notion
  let req: Request

  beforeEach(() => {
    notionMock.mockIsFullPageOrDatabase(true)
    notionMock.mockQuery([
      NotionMock.mockWeek('id1', '2021-01-01', 'theme1'),
      NotionMock.mockWeek('id2', '2021-01-08', 'theme2'),
      NotionMock.mockWeek('id3', '2021-01-15', 'theme3'),
    ])
    firestore = setupFirestore()
    notion = new Notion()
    req = getMockReq()
  })

  describe('when the cache is empty', () => {
    it('updates all weeks in firestore', async () =>  {
      const cacheController = new CacheController(firestore, notion)

      await cacheController.cache(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(transaction.set).toHaveBeenCalledTimes(3)
      expect(transaction.set)
        .toHaveBeenCalledWith(
          doc(cacheController.firestore, 'weeks', '2021-01-01'),
          (new Week('id1', 'theme1', new Date('2021-01-01'), false)).toFirebaseDTO()
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          doc(cacheController.firestore, 'weeks', '2021-01-08'),
          (new Week('id2', 'theme2', new Date('2021-01-08'), false)).toFirebaseDTO()
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          doc(cacheController.firestore, 'weeks', '2021-01-15'),
          (new Week('id3', 'theme3', new Date('2021-01-15'), false)).toFirebaseDTO()
        )
    })
  })
})
