
import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { CronController } from '../../src/controllers/cronController'
import FirestoreAdapter from '../../src/data/firestore/firestoreAdapter'
import { mockConfig } from '../support/mockConfig'
import { FirebaseMock } from '../support/firebaseMock'
import { transaction } from '../../__mocks__/firebase/firestore'

const { res, mockClear } = getMockRes()

let firestore: FirestoreAdapter

beforeAll(() => {
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')
  jest.mock('firebase/firestore')
})

beforeEach(() => {
  mockClear()
  firestore = new FirestoreAdapter(mockConfig())
  jest.clearAllMocks()
})

describe('reminders', () => {
  describe('there is an event tomorrow', () => {
    beforeEach(() => {
      FirebaseMock.mockGetWeek({
        date: new Date('2021-01-01'),
        id: 'week-id1',
        isSkipped: false,
        theme: 'theme1',
        slug: null,
        movies: [{
          director: 'director1',
          length: 100,
          notionId: 'notion-id1',
          posterPath: 'poster1',
          showingUrl: null,
          theaterName: null,
          time: '6:00 PM',
          title: 'movie1',
          tmdbId: 1,
          url: 'https://example.com',
          year: 2021,
        }, {
          director: 'director2',
          length: 200,
          notionId: 'notion-id2',
          posterPath: 'poster2',
          showingUrl: null,
          theaterName: null,
          time: '8:00 PM',
          title: 'movie2',
          tmdbId: 2,
          url: 'https://example.com',
          year: 1999,
        }],
      })
    })

    describe('there are users subscribed', () => {
      beforeEach(() => {
        FirebaseMock.mockGetUsers([
          {
            id: 'user-id1',
            email: 'user_with_reminder1@example.com',
            reminders: true,
          }, {
            id: 'user-id2',
            email: 'user_with_reminder2@example.com',
            reminders: true,
          },
        ])
      })

      it('should send a reminder to those users', async () => {
        await new CronController(firestore).reminders(getMockReq(), res)

        expect(transaction.set).toHaveBeenCalledWith(
          FirebaseMock.mockDoc('mail', expect.anything()),
          {
            to: 'user_with_reminder1@example.com',
            template: {
              name: 'reminder',
              data: {
                date: 'Friday, January 1',
                theme: 'theme1',
                weekId: '2021-01-01',
                movies: [{
                  title: 'movie1',
                  posterPath: 'poster1',
                  year: '2021',
                  time: '6:00 PM',
                }, {
                  title: 'movie2',
                  posterPath: 'poster2',
                  year: '1999',
                  time: '8:00 PM',
                }],
              },
            },
          },
        )

        expect(transaction.set).toHaveBeenCalledWith(
          FirebaseMock.mockDoc('mail', expect.anything()),
          {
            to: 'user_with_reminder2@example.com',
            template: {
              name: 'reminder',
              data: {
                date: 'Friday, January 1',
                theme: 'theme1',
                weekId: '2021-01-01',
                movies: [{
                  title: 'movie1',
                  posterPath: 'poster1',
                  year: '2021',
                  time: '6:00 PM',
                }, {
                  title: 'movie2',
                  posterPath: 'poster2',
                  year: '1999',
                  time: '8:00 PM',
                }],
              },
            },
          },
        )
      })
    })
  })
})
