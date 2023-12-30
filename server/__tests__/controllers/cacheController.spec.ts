import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { NotionMock } from '../support/notionMock'
import { getMockReq, getMockRes } from '@jest-mock/express'
import NotionAdapter from '../../src/data/notion/notionAdapter'
import CacheController from '../../src/controllers/cacheController'
import { transaction } from '../../__mocks__/firebase/firestore'
import { Request } from 'express'
import Week from '../../src/models/week'
import { FirebaseMock } from '../support/firebaseMock'
import FirestoreAdapter from '../../src/data/firestore/firestoreAdapter'
import { NotionMovie } from '../support/notionHelpers'
import { TmdbMock } from '../support/tmdbMock'
import { mockFetch } from '../support/fetchMock'
import Movie from '../../src/models/movie'
import TmdbAdapter from '../../src/data/tmdb/tmdbAdapter'
import { mockConfig } from '../support/mockConfig'
import fs from 'fs'

let notionMock: NotionMock

const { res, mockClear } = getMockRes()
let req: Request

const newCacheController = () => {
  const config = mockConfig()
  const firestore = new FirestoreAdapter(config)
  const notion = new NotionAdapter(config)
  const tmdbAdapter = new TmdbAdapter(config)
  return new CacheController(firestore, notion, tmdbAdapter)
}

beforeAll(() => {
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')
  jest.mock('firebase/firestore')
})

beforeEach(() => {
  jest.clearAllMocks()
  notionMock.mockNotionEnv()
  mockClear()
})

describe('cacheWeeks', () => {
  beforeAll(() => {
    jest.mock('@notionhq/client')
    notionMock = new NotionMock()
  })

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
      await newCacheController().cacheWeeks(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(transaction.set).toHaveBeenCalledTimes(3)
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          FirebaseMock.mockWeek('id1', 'theme1', '2021-01-01'),
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-08'),
          FirebaseMock.mockWeek('id2', 'theme2', '2021-01-08'),
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-15'),
          FirebaseMock.mockWeek('id3', 'theme3', '2021-01-15'),
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
        null,
        'https://www.themoviedb.org/movie/1234',
        '/poster.jpg',
        1234,
        'notionId',
      )
      const tmdb = new Movie(
        'title',
        'director',
        2001,
        90,
        null,
        'https://www.themoviedb.org/movie/1234',
        '/poster.jpg',
        1234,
      )
      const notionResponse = new NotionMovie('notionId', 'title')
      notionMock.mockIsFullPageOrDatabase(true)
      notionMock.mockQuery([
        NotionMock.mockWeek(
          'id1', '2021-01-01', 'theme1', false, [notionResponse],
        ),
      ])
      notionMock.mockRetrieve(notionResponse)
      req = getMockReq()
      const tmdbMock = new TmdbMock(mockFetch())
      tmdbMock.mockSearchMovie(tmdb)
      tmdbMock.mockMovieDetails(tmdb)
    })

    it('stores data from tmdb in firestore', async () => {
      await newCacheController().cacheWeeks(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(transaction.set).toHaveBeenCalledTimes(1)
      expect(transaction.set).toHaveBeenCalledWith(
        FirebaseMock.mockDoc('weeks', '2021-01-01'),
        (new Week('id1', 'theme1', new Date('2021-01-01'), false, [
          expected,
        ])).toFirebaseDTO(),
      )
    })

    it('updates the movie in notion', async () => {
      await newCacheController().cacheWeeks(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(notionMock.update).toHaveBeenCalledWith(expected.toNotion())
    })
  })
})

describe('cacheEmailTemplates', () => {
  it('uploads email templates to firestore', async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('html')
    await newCacheController().cacheEmailTemplates(req, res)

    expect(res.sendStatus).toHaveBeenCalledWith(200)
    expect(transaction.set).toHaveBeenCalledWith(
      FirebaseMock.mockDoc('mail-templates', 'reminder'),
      {
        subject: 'Reminder: {{ theme }} is Tomorrow',
        html: 'html',
      },
    )
  })
})
