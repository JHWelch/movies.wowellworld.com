import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { NotionMock } from '../support/notionMock'
import { getMockReq, getMockRes } from '@jest-mock/express'
import NotionAdapter from '../../src/data/notionAdapter'
import CacheController from '../../src/controllers/cacheController'
import { transaction } from '../../__mocks__/firebase/firestore'
import { Request } from 'express'
import Week from '../../src/models/week'
import { FirebaseMock } from '../support/firebaseMock'
import FirestoreAdapter from '../../src/data/firestoreAdapter'
import { NotionMovie } from '../support/notionHelpers'
import { TmdbMock } from '../support/tmdbMock'
import { mockFetch } from '../support/fetchMock'
import Movie from '../../src/models/movie'
import TmdbAdapter from '../../src/data/tmdb/tmdbAdapter'

let notionMock: NotionMock

const { res, mockClear } = getMockRes()

const newCacheController = () => {
  const firestore = new FirestoreAdapter()
  const notion = new NotionAdapter()
  const tmdbAdapter = new TmdbAdapter()
  return new CacheController(firestore, notion, tmdbAdapter)
}

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
  let req: Request

  describe('when the cache is empty', () => {
    beforeEach(() => {
      notionMock.mockIsFullPageOrDatabase(true)
      notionMock.mockQuery([
        NotionMock.mockWeek('id1', '2021-01-01', 'theme1'),
        NotionMock.mockWeek('id2', '2021-01-08', 'theme2'),
        NotionMock.mockWeek('id3', '2021-01-15', 'theme3'),
      ])
      req = getMockReq()
    })

    it('updates all weeks in firestore', async () =>  {
      const cacheController = newCacheController()

      await cacheController.cache(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(transaction.set).toHaveBeenCalledTimes(3)
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          (new Week('id1', 'theme1', new Date('2021-01-01'), false)).toFirebaseDTO()
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-08'),
          (new Week('id2', 'theme2', new Date('2021-01-08'), false)).toFirebaseDTO()
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-15'),
          (new Week('id3', 'theme3', new Date('2021-01-15'), false)).toFirebaseDTO()
        )
    })
  })

  describe('movies without directors', () => {
    let expected: Movie

    beforeEach(() => {
      expected = new Movie(
        'title',
        'director',
        2001,
        90,
        'https://www.themoviedb.org/movie/1234',
        'https://image.tmdb.org/t/p/original/poster.jpg',
        1234,
        'notionId',
      )
      const tmdb = new Movie(
        'title',
        'director',
        2001,
        90,
        'https://www.themoviedb.org/movie/1234',
        'https://image.tmdb.org/t/p/original/poster.jpg',
        1234,
      )
      const notionResponse = new NotionMovie('notionId', 'title')
      notionMock.mockIsFullPageOrDatabase(true)
      notionMock.mockQuery([
        NotionMock.mockWeek('id1', '2021-01-01', 'theme1', false, [notionResponse]),
      ])
      notionMock.mockRetrieve(notionResponse)
      req = getMockReq()
      const tmdbMock = new TmdbMock(mockFetch())
      tmdbMock.mockSearchMovie(tmdb)
      tmdbMock.mockMovieDetails(tmdb)
    })

    it('stores data from tmdb in firestore', async () => {
      const cacheController = newCacheController()

      await cacheController.cache(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(transaction.set).toHaveBeenCalledTimes(1)
      expect(transaction.set).toHaveBeenCalledWith(
        FirebaseMock.mockDoc('weeks', '2021-01-01'),
        (new Week('id1', 'theme1', new Date('2021-01-01'), false, [
          expected,
        ])).toFirebaseDTO()
      )
    })
  })
})
