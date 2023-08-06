import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import WeekController from '../../src/controllers/weekController'
import { Request } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import setupFirestore from '../../src/config/firestore'
import {
  Firestore,
  getDocs,
  Timestamp,
} from 'firebase/firestore'

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
    let firestore: Firestore
    let req: Request

    beforeEach(() => {
      firestore = setupFirestore();
      (getDocs as unknown as jest.Mock).mockImplementation(() => {
        return {
          docs: [
            {
              data: () => ({
                date: Timestamp.fromDate(new Date('2021-01-01')),
                id: 'id1',
                isSkipped: false,
                movies: [],
                theme: 'theme1',
              }),
            }, {
              data: () => ({
                date: Timestamp.fromDate(new Date('2021-01-08')),
                id: 'id2',
                isSkipped: false,
                movies: [],
                theme: 'theme2',
              }),
            }, {
              data: () => ({
                date: Timestamp.fromDate(new Date('2021-01-15')),
                id: 'id3',
                isSkipped: false,
                movies: [],
                theme: 'theme3',
              }),
            },
          ],
        }
      })
      req = getMockReq()
    })

    it('should return all future weeks', async () => {
      await new WeekController(firestore).index(req, res)

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

  describe('called with past filter', () => {
    let firestore: Firestore
    let req: Request

    beforeEach(() => {
      firestore = setupFirestore();
      (getDocs as unknown as jest.Mock).mockImplementation(() => {
        return {
          docs: [
            {
              data: () => ({
                date: Timestamp.fromDate(new Date('2021-01-01')),
                id: 'id1',
                isSkipped: false,
                movies: [],
                theme: 'theme1',
              }),
            }, {
              data: () => ({
                date: Timestamp.fromDate(new Date('2021-01-08')),
                id: 'id2',
                isSkipped: false,
                movies: [],
                theme: 'theme2',
              }),
            }, {
              data: () => ({
                date: Timestamp.fromDate(new Date('2021-01-15')),
                id: 'id3',
                isSkipped: false,
                movies: [],
                theme: 'theme3',
              }),
            },
          ],
        }
      })
      req = getMockReq()
    })

    it ('should return only past weeks', async () => {
      req.query = { past: 'true' }
      await new WeekController(firestore).index(req, res)

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
