import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import EventController from '@server/controllers/eventController'
import { Request } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { FirebaseMock } from '@tests/support/firebaseMock'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { mockConfig } from '@tests/support/mockConfig'
import { DateTime } from 'luxon'
import { TZ } from '@server/config/tz'
import { query } from 'firebase/firestore'
import MovieFactory from '@tests/support/factories/movieFactory'

const { res, mockClear } = getMockRes()

beforeAll(() => {
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')
  jest.mock('firebase/firestore')
})

beforeEach(() => {
  jest.clearAllMocks()
  mockClear()
})

describe('index', () => {
  describe('called without filters', () => {
    let firestore: FirestoreAdapter
    let req: Request

    beforeEach(() => {
      firestore = new FirestoreAdapter(mockConfig())
      FirebaseMock.mockEvents([
        {
          date: DateTime.fromISO('2021-01-01', TZ),
          id: 'id1',
          isSkipped: false,
          slug: null,
          theme: 'theme1',
        }, {
          date: DateTime.fromISO('2021-01-08', TZ),
          id: 'id2',
          isSkipped: false,
          slug: null,
          theme: 'theme2',
        }, {
          date: DateTime.fromISO('2021-01-15', TZ),
          id: 'id3',
          isSkipped: false,
          slug: null,
          theme: 'theme3',
        },
      ])
      req = getMockReq()
    })

    it('should return all future events', async () => {
      await new EventController(firestore).index(req, res)

      expect(res.json).toHaveBeenCalledWith([
        {
          id: 'id1',
          eventId: '2021-01-01',
          date: 'Friday, January 1',
          isSkipped: false,
          slug: null,
          movies: [],
          theme: 'theme1',
          styledTheme: [],
          submittedBy: null,
        }, {
          id: 'id2',
          eventId: '2021-01-08',
          date: 'Friday, January 8',
          isSkipped: false,
          slug: null,
          movies: [],
          theme: 'theme2',
          styledTheme: [],
          submittedBy: null,
        }, {
          id: 'id3',
          eventId: '2021-01-15',
          date: 'Friday, January 15',
          isSkipped: false,
          slug: null,
          movies: [],
          theme: 'theme3',
          styledTheme: [],
          submittedBy: null,
        },
      ])
    })

    it('should query firebase with limit', async () => {
      await new EventController(firestore).index(req, res)

      expect(query).toHaveBeenCalledWith(
        { firestore: { firestore: 'firestore' }, collectionPath: 'events' },
        { fieldPath: 'date', opStr: '>=', value: firestore.today() },
        { fieldPath: 'date' },
      )
    })
  })

  describe('called with past filter', () => {
    let firestore: FirestoreAdapter
    let req: Request

    beforeEach(() => {
      firestore = new FirestoreAdapter(mockConfig())
      FirebaseMock.mockEvents([
        {
          date: DateTime.fromISO('2021-01-01', TZ),
          id: 'id1',
          isSkipped: false,
          theme: 'theme1',
          slug: 'slug1',
        }, {
          date: DateTime.fromISO('2021-01-08', TZ),
          id: 'id2',
          isSkipped: false,
          theme: 'theme2',
          slug: null,
        }, {
          date: DateTime.fromISO('2021-01-15', TZ),
          id: 'id3',
          isSkipped: true,
          theme: 'theme3',
          slug: 'slug3',
          submittedBy: 'Jordan',
        },
      ])
      req = getMockReq()
    })

    it ('should return only past events', async () => {
      req.query = { past: 'true' }
      await new EventController(firestore).index(req, res)

      expect(res.json).toHaveBeenCalledWith([
        {
          id: 'id1',
          eventId: '2021-01-01',
          date: 'Friday, January 1',
          isSkipped: false,
          movies: [],
          theme: 'theme1',
          styledTheme: [],
          slug: 'slug1',
          submittedBy: null,
        }, {
          id: 'id2',
          eventId: '2021-01-08',
          date: 'Friday, January 8',
          isSkipped: false,
          movies: [],
          theme: 'theme2',
          styledTheme: [],
          slug: null,
          submittedBy: null,
        }, {
          id: 'id3',
          eventId: '2021-01-15',
          date: 'Friday, January 15',
          isSkipped: true,
          movies: [],
          theme: 'theme3',
          styledTheme: [],
          slug: 'slug3',
          submittedBy: 'Jordan',
        },
      ])
    })
  })

  describe('called with limit', () => {
    let firestore: FirestoreAdapter
    let req: Request

    beforeEach(() => {
      firestore = new FirestoreAdapter(mockConfig())
      FirebaseMock.mockEvents([{
        date: DateTime.fromISO('2021-01-01', TZ),
        id: 'id1',
        isSkipped: false,
        slug: null,
        theme: 'theme1',
        submittedBy: 'Jordan',
      }])
      req = getMockReq()
    })

    it('should return all future events', async () => {
      req.query = { limit: '1' }

      await new EventController(firestore).index(req, res)

      expect(res.json).toHaveBeenCalledWith([{
        id: 'id1',
        eventId: '2021-01-01',
        date: 'Friday, January 1',
        isSkipped: false,
        slug: null,
        movies: [],
        theme: 'theme1',
        styledTheme: [],
        submittedBy: 'Jordan',
      }])
    })

    it('should query firebase with limit', async () => {
      req.query = { limit: '1' }

      await new EventController(firestore).index(req, res)

      expect(query).toHaveBeenCalledWith(
        { firestore: { firestore: 'firestore' }, collectionPath: 'events' },
        { fieldPath: 'date', opStr: '>=', value: firestore.today() },
        { fieldPath: 'date' },
        { limit: 1 },
      )
    })
  })

  describe('called with custom width', () => {
    let firestore: FirestoreAdapter
    let req: Request
    let movie: MovieFactory

    beforeEach(() => {
      firestore = new FirestoreAdapter(mockConfig())

      movie = new MovieFactory()
      FirebaseMock.mockEvents([{
        date: DateTime.fromISO('2021-01-01', TZ),
        id: 'id1',
        isSkipped: false,
        theme: 'theme1',
        submittedBy: 'Jordan',
        movies: [
          movie.asFirebaseMovie(),
        ],
      }])
      req = getMockReq()
    })

    it('should return all future events', async () => {
      req.query = { posterWidth: 'w185' }

      await new EventController(firestore).index(req, res)

      const expected = movie.make()
      expect(res.json).toHaveBeenCalledWith([{
        id: 'id1',
        eventId: '2021-01-01',
        date: 'Friday, January 1',
        isSkipped: false,
        slug: null,
        movies: [
          expected.toDTO({ posterWidth: 'w185' }),
        ],
        theme: 'theme1',
        styledTheme: [],
        submittedBy: 'Jordan',
      }])
    })
  })
})
