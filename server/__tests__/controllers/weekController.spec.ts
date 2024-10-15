import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import WeekController from '@server/controllers/weekController'
import { Request } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { FirebaseMock } from '@tests/support/firebaseMock'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { mockConfig } from '@tests/support/mockConfig'
import { DateTime } from 'luxon'
import { TZ } from '@server/config/tz'
import { query } from 'firebase/firestore'

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
      FirebaseMock.mockWeeks([
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

    it('should return all future weeks', async () => {
      await new WeekController(firestore).index(req, res)

      expect(res.json).toHaveBeenCalledWith([
        {
          id: 'id1',
          weekId: '2021-01-01',
          date: 'Friday, January 1',
          isSkipped: false,
          slug: null,
          movies: [],
          theme: 'theme1',
          styledTheme: [],
        }, {
          id: 'id2',
          weekId: '2021-01-08',
          date: 'Friday, January 8',
          isSkipped: false,
          slug: null,
          movies: [],
          theme: 'theme2',
          styledTheme: [],
        }, {
          id: 'id3',
          weekId: '2021-01-15',
          date: 'Friday, January 15',
          isSkipped: false,
          slug: null,
          movies: [],
          theme: 'theme3',
          styledTheme: [],
        },
      ])
    })

    it('should query firebase with limit', async () => {
      await new WeekController(firestore).index(req, res)

      expect(query).toHaveBeenCalledWith(
        { firestore: { firestore: 'firestore' }, collectionPath: 'weeks' },
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
      FirebaseMock.mockWeeks([
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
        },
      ])
      req = getMockReq()
    })

    it ('should return only past weeks', async () => {
      req.query = { past: 'true' }
      await new WeekController(firestore).index(req, res)

      expect(res.json).toHaveBeenCalledWith([
        {
          id: 'id1',
          weekId: '2021-01-01',
          date: 'Friday, January 1',
          isSkipped: false,
          movies: [],
          theme: 'theme1',
          styledTheme: [],
          slug: 'slug1',
        }, {
          id: 'id2',
          weekId: '2021-01-08',
          date: 'Friday, January 8',
          isSkipped: false,
          movies: [],
          theme: 'theme2',
          styledTheme: [],
          slug: null,
        }, {
          id: 'id3',
          weekId: '2021-01-15',
          date: 'Friday, January 15',
          isSkipped: true,
          movies: [],
          theme: 'theme3',
          styledTheme: [],
          slug: 'slug3',
        },
      ])
    })
  })

  describe('called with limit', () => {
    let firestore: FirestoreAdapter
    let req: Request

    beforeEach(() => {
      firestore = new FirestoreAdapter(mockConfig())
      FirebaseMock.mockWeeks([
        {
          date: DateTime.fromISO('2021-01-01', TZ),
          id: 'id1',
          isSkipped: false,
          slug: null,
          theme: 'theme1',
        },
      ])
      req = getMockReq()
    })

    it('should return all future weeks', async () => {
      req.query = { limit: '1' }

      await new WeekController(firestore).index(req, res)

      expect(res.json).toHaveBeenCalledWith([
        {
          id: 'id1',
          weekId: '2021-01-01',
          date: 'Friday, January 1',
          isSkipped: false,
          slug: null,
          movies: [],
          theme: 'theme1',
          styledTheme: [],
        },
      ])
    })

    it('should query firebase with limit', async () => {
      req.query = { limit: '1' }

      await new WeekController(firestore).index(req, res)

      expect(query).toHaveBeenCalledWith(
        { firestore: { firestore: 'firestore' }, collectionPath: 'weeks' },
        { fieldPath: 'date', opStr: '>=', value: firestore.today() },
        { fieldPath: 'date' },
        { limit: 1 },
      )
    })
  })
})
