import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { NotionMock } from '@tests/support/notionMock'
import { getMockReq, getMockRes } from '@jest-mock/express'
import NotionAdapter from '@server/data/notion/notionAdapter'
import CacheController from '@server/controllers/cacheController'
import { transaction } from '@mocks/firebase/firestore'
import { Request } from 'express'
import { Week } from '@server/models/week'
import { FirebaseMock } from '@tests/support/firebaseMock'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { NotionMovie } from '@tests/support/notionHelpers'
import { TmdbMock } from '@tests/support/tmdbMock'
import { mockFetch } from '@tests/support/fetchMock'
import { Movie } from '@server/models/movie'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import { mockConfig } from '@tests/support/mockConfig'
import fs from 'fs'
import MovieFactory from '@tests/support/factories/movieFactory'

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
  jest.mock('@server/helpers/directoryPath')
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('cacheWeeks', () => {
  beforeAll(() => {
    jest.mock('@notionhq/client')
    notionMock = new NotionMock()
  })

  beforeEach(() => {
    req = getMockReq()
  })

  describe('when the cache is empty', () => {
    beforeEach(() => {
      notionMock.mockIsFullPageOrDatabase(true)
      notionMock.mockQuery([
        NotionMock.mockWeek('id1', '2021-01-01', 'theme1'),
        NotionMock.mockWeek('id2', '2021-01-08', 'theme2'),
        NotionMock.mockWeek('id3', '2021-01-15', 'theme3'),
      ])
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
      expected = new Movie({
        title: 'title',
        director: 'director',
        year: 2001,
        length: 90,
        time: '6:00 PM',
        url: 'https://www.themoviedb.org/movie/1234',
        posterPath: '/poster.jpg',
        tmdbId: 1234,
        notionId: 'notionId',
      })
      const tmdb = new Movie({
        title: 'title',
        director: 'director',
        year: 2001,
        length: 90,
        url: 'https://www.themoviedb.org/movie/1234',
        posterPath: '/poster.jpg',
        tmdbId: 1234,
      })
      const notionResponse = new NotionMovie({ id: 'notionId', title: 'title' })
      notionMock.mockIsFullPageOrDatabase(true)
      notionMock.mockQuery([
        NotionMock.mockWeek(
          'id1', '2021-01-01', 'theme1', false, null, [notionResponse],
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
        new Week({
          id: 'id1',
          theme: 'theme1',
          date: new Date('2021-01-01'),
          movies: [expected],
        }).toFirebaseDTO(),
      )
    })

    it('updates the movie in notion', async () => {
      await newCacheController().cacheWeeks(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(notionMock.update).toHaveBeenCalledWith(expected.toNotion())
    })
  })

  describe('movies without times', () => {
    const setupNotionMocks = (movies: Movie[]) => {
      const notionResponse = movies.map(NotionMovie.fromMovie)
      notionMock.mockIsFullPageOrDatabase(true)
      notionMock.mockQuery([
        NotionMock.mockWeek(
          'id1', '2021-01-01', 'theme1', false, null, notionResponse,
        ),
      ])
      notionMock.mockRetrieve(notionResponse[0])
      notionMock.mockRetrieve(notionResponse[1])
    }

    describe('no times at all, even numbers', () => {
      let expected: Movie[]

      beforeEach(() => {
        expected = new MovieFactory()
          .state({ time: null, tmdbId: null })
          .makeMany(2)
        setupNotionMocks(expected)
        expected[0].time = '6:00 PM'
        expected[1].time = '7:45 PM'
      })

      it('updates times when adding to firebase', async () => {
        await newCacheController().cacheWeeks(req, res)

        expect(res.sendStatus).toHaveBeenCalledWith(200)
        expect(transaction.set).toHaveBeenCalledTimes(1)
        expect(transaction.set).toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          new Week({
            id: 'id1',
            theme: 'theme1',
            date: new Date('2021-01-01'),
            movies: expected,
          }).toFirebaseDTO(),
        )
      })

      it('updates the movie in notion', async () => {
        await newCacheController().cacheWeeks(req, res)

        expect(res.sendStatus).toHaveBeenCalledWith(200)
        expect(notionMock.update)
          .toHaveBeenCalledWith(expected[0].toNotion())
        expect(notionMock.update)
          .toHaveBeenCalledWith(expected[1].toNotion())
      })
    })

    describe('no times at all, irregular length', () => {
      let expected: Movie[]

      beforeEach(() => {
        expected = new MovieFactory()
          .state({ time: null, tmdbId: null, length: 123 })
          .makeMany(2)
        setupNotionMocks(expected)
        expected[0].time = '6:00 PM'
        expected[1].time = '8:20 PM'
      })

      it('rounds to nearest 5 minute interval', async () => {
        await newCacheController().cacheWeeks(req, res)

        expect(res.sendStatus).toHaveBeenCalledWith(200)
        expect(transaction.set).toHaveBeenCalledTimes(1)
        expect(transaction.set).toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          new Week({
            id: 'id1',
            theme: 'theme1',
            date: new Date('2021-01-01'),
            movies: expected,
          }).toFirebaseDTO(),
        )
        expect(notionMock.update)
          .toHaveBeenCalledWith(expected[0].toNotion())
        expect(notionMock.update)
          .toHaveBeenCalledWith(expected[1].toNotion())
      })
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
