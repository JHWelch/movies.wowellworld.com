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
import MockDate from 'mockdate'
import { RichText } from '@shared/dtos'
import { DateTime } from 'luxon'
import { TZ } from '@server/config/tz'

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
  MockDate.set('2021-01-01')
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
    const styled: RichText[] = [
      {
        type: 'text',
        text: {
          content: 'week',
          link: null,
        },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'week',
        href: null,
      },
      {
        type: 'text',
        text: {
          content: 'id 3',
          link: null,
        },
        annotations: {
          bold: false,
          italic: true,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'red',
        },
        plain_text: 'id 3',
        href: null,
      },
    ]

    beforeEach(() => {
      notionMock.mockIsFullPageOrDatabase(true)
      FirebaseMock.mockGetGlobal('lastUpdated')
      notionMock.mockQuery([
        NotionMock.mockWeek({
          id: 'id1',
          date: '2021-01-01',
          theme: 'theme1',
        }),
        NotionMock.mockWeek({
          id: 'id2',
          date: '2021-01-08',
          theme: 'theme2',
          skipped: true,
        }),
        NotionMock.mockWeek({
          id: 'id3',
          date: '2021-01-15',
          theme: 'theme3',
          slug: 'slug',
          styledTheme: styled,
        }),
      ])
    })

    it('updates all weeks in firestore', async () => {
      await newCacheController().cacheWeeks(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(transaction.set).toHaveBeenCalledTimes(3)
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          FirebaseMock.mockWeek({
            id: 'id1',
            theme: 'theme1',
            date: '2021-01-01',
          }),
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-08'),
          FirebaseMock.mockWeek({
            id: 'id2',
            theme: 'theme2',
            date: '2021-01-08',
            isSkipped: true,
          }),
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-15'),
          FirebaseMock.mockWeek({
            id: 'id3',
            theme: 'theme3',
            date: '2021-01-15',
            slug: 'slug',
            styledTheme: styled,
          }),
        )
    })

    it('should call query with the correct parameters', async () => {
      await newCacheController().cacheWeeks(req, res)

      expect(notionMock.query).toHaveBeenCalledWith({
        database_id: 'NOTION_WEEK_DATABASE_ID',
        page_size: 100,
        filter: {
          property: 'Date',
          date: { is_not_empty: true },
        },
        sorts: [{
          property: 'Date',
          direction: 'ascending',
        }],
      })
    })
  })

  describe('when cache lastUpdated already exists ', () => {
    beforeEach(() => {
      notionMock.mockIsFullPageOrDatabase(true)
      FirebaseMock.mockGetGlobal('lastUpdated', '2021-01-01T00:00:00.000Z')
      notionMock.mockQuery([
        NotionMock.mockWeek({
          id: 'id1',
          date: '2021-01-01',
          theme: 'theme1',
        }),
        NotionMock.mockWeek({
          id: 'id2',
          date: '2021-01-08',
          theme: 'theme2',
          skipped: true,
        }),
        NotionMock.mockWeek({
          id: 'id3',
          date: '2021-01-15',
          theme: 'theme3',
          slug: 'slug',
        }),
      ])
    })

    it('updates all weeks in firestore', async () => {
      await newCacheController().cacheWeeks(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(transaction.set).toHaveBeenCalledTimes(3)
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          FirebaseMock.mockWeek({
            id: 'id1',
            theme: 'theme1',
            date: '2021-01-01',
          }),
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-08'),
          FirebaseMock.mockWeek({
            id: 'id2',
            theme: 'theme2',
            date: '2021-01-08',
            isSkipped: true,
          }),
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-15'),
          FirebaseMock.mockWeek({
            id: 'id3',
            theme: 'theme3',
            date: '2021-01-15',
            slug: 'slug',
          }),
        )
    })

    it('should call query with the correct parameters', async () => {
      await newCacheController().cacheWeeks(req, res)

      expect(notionMock.query).toHaveBeenCalledWith({
        database_id: 'NOTION_WEEK_DATABASE_ID',
        page_size: 100,
        filter: {
          and: [
            {
              property: 'Date',
              date: { is_not_empty: true },
            },
            {
              or: [
                {
                  property: 'Last edited time',
                  date: { after: '2021-01-01T00:00:00.000Z' },
                },
                {
                  property: 'Last edited movie time',
                  date: { after: '2021-01-01T00:00:00.000Z' },
                },
              ],
            },
          ],
        },
        sorts: [{
          property: 'Date',
          direction: 'ascending',
        }],
      })
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
        NotionMock.mockWeek({
          id: 'id1',
          date: '2021-01-01',
          theme: 'theme1',
          movies: [notionResponse],
        }),
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
          date: DateTime.fromISO('2021-01-01', TZ),
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
    const setupNotionMocks = (movies: Movie[], date = '2021-01-01') => {
      const notionResponse = movies.map(NotionMovie.fromMovie)
      notionMock.mockIsFullPageOrDatabase(true)
      notionMock.mockQuery([
        NotionMock.mockWeek({
          id: 'id1',
          date,
          theme: 'theme1',
          movies: notionResponse,
        }),
      ])
      notionResponse.forEach((movie) => notionMock.mockRetrieve(movie))
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
            date: DateTime.fromISO('2021-01-01', TZ),
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
            date: DateTime.fromISO('2021-01-01', TZ),
            movies: expected,
          }).toFirebaseDTO(),
        )
        expect(notionMock.update)
          .toHaveBeenCalledWith(expected[0].toNotion())
        expect(notionMock.update)
          .toHaveBeenCalledWith(expected[1].toNotion())
      })
    })

    describe('has starter time', () => {
      let expected: Movie[]

      beforeEach(() => {
        expected = [
          new MovieFactory().make({ time: '7:00 PM', tmdbId: null }),
          new MovieFactory().make({ time: null, tmdbId: null }),
        ]
        setupNotionMocks(expected)
        expected[1].time = '8:45 PM'
      })

      it('assigns all other proper times', async () => {
        await newCacheController().cacheWeeks(req, res)

        expect(res.sendStatus).toHaveBeenCalledWith(200)
        expect(transaction.set).toHaveBeenCalledTimes(1)
        expect(transaction.set).toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          new Week({
            id: 'id1',
            theme: 'theme1',
            date: DateTime.fromISO('2021-01-01', TZ),
            movies: expected,
          }).toFirebaseDTO(),
        )
        expect(notionMock.update)
          .toHaveBeenCalledWith(expected[0].toNotion())
        expect(notionMock.update)
          .toHaveBeenCalledWith(expected[1].toNotion())
      })
    })

    describe('first time is not proper time', () => {
      let expected: Movie[]

      beforeEach(() => {
        expected = [
          new MovieFactory().make({ time: 'Afternoon', tmdbId: null }),
          new MovieFactory().make({ time: null, tmdbId: null }),
        ]
        setupNotionMocks(expected)
      })

      it('caches without update and does not update notion', async () => {
        await newCacheController().cacheWeeks(req, res)

        expect(res.sendStatus).toHaveBeenCalledWith(200)
        expect(transaction.set).toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          new Week({
            id: 'id1',
            theme: 'theme1',
            date: DateTime.fromISO('2021-01-01', TZ),
            movies: expected,
          }).toFirebaseDTO(),
        )
        expect(notionMock.update).not.toHaveBeenCalled()
      })
    })

    describe('first movie has no director', () => {
      let expected: Movie[]

      beforeEach(() => {
        expected = [
          new MovieFactory().make({ time: null, tmdbId: null, director: null }),
          new MovieFactory().make({ time: null, tmdbId: null, length: 123 }),
          new MovieFactory().make({ time: null, tmdbId: null }),
        ]
        setupNotionMocks(expected)
        expected[1].time = '6:00 PM'
        expected[2].time = '8:20 PM'
      })

      it('skips the movie', async () => {
        await newCacheController().cacheWeeks(req, res)

        expect(res.sendStatus).toHaveBeenCalledWith(200)
        expect(transaction.set).toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          new Week({
            id: 'id1',
            theme: 'theme1',
            date: DateTime.fromISO('2021-01-01', TZ),
            movies: expected,
          }).toFirebaseDTO(),
        )
        expect(notionMock.update)
          .not.toHaveBeenCalledWith(expected[0].toNotion())
        expect(notionMock.update)
          .toHaveBeenCalledWith(expected[1].toNotion())
        expect(notionMock.update)
          .toHaveBeenCalledWith(expected[2].toNotion())
      })
    })

    describe('movies in the past', () => {
      let expected: Movie[]

      beforeEach(() => {
        expected = new MovieFactory()
          .state({ time: null, tmdbId: null })
          .makeMany(2)
        setupNotionMocks(expected, '2020-01-01')
      })

      it('caches without update and does not update notion', async () => {
        await newCacheController().cacheWeeks(req, res)

        expect(res.sendStatus).toHaveBeenCalledWith(200)
        expect(transaction.set).toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2020-01-01'),
          new Week({
            id: 'id1',
            theme: 'theme1',
            date: DateTime.fromISO('2020-01-01', TZ),
            movies: expected,
          }).toFirebaseDTO(),
        )
        expect(notionMock.update).not.toHaveBeenCalled()
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
