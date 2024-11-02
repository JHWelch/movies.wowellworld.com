import WeekEventController from '@server/controllers/weekEventController'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { FirebaseMock } from '@tests/support/firebaseMock'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { mockConfig } from '@tests/support/mockConfig'
import { Request } from 'express'
import { icalGenerator } from '@server/data/icalGenerator'
import { Week } from '@server/models/week'
import WeekFactory from '@tests/support/factories/weekFactory'
import MovieFactory from '@tests/support/factories/movieFactory'
import { DateTime } from 'luxon'
import { TZ } from '@server/config/tz'
import _directoryPath from '@server/helpers/directoryPath'

const directoryPath = _directoryPath as jest.Mock

const { res, mockClear } = getMockRes()

beforeEach(() => {
  jest.clearAllMocks()
  mockClear()
})

describe('show', () => {
  let firestoreAdapter: FirestoreAdapter
  let req: Request
  let week: Week

  beforeEach(() => {
    firestoreAdapter = new FirestoreAdapter(mockConfig())
    directoryPath.mockReturnValue(__dirname + '/../../src/data')
  })

  describe('has correct week', () => {
    beforeEach(() => {
      week = new WeekFactory().make({
        date: DateTime.fromISO('2021-01-01', TZ),
      })
      week.movies = [
        new MovieFactory().make(),
        new MovieFactory().make(),
      ]

      FirebaseMock.mockGetWeek({
        date: week.date,
        id: week.id,
        isSkipped: week.isSkipped,
        theme: week.theme,
        slug: week.slug,
        movies:  week.movies.map(movie => ({
          director: movie.director ?? '',
          length: movie.length ?? 0,
          notionId: movie.notionId ?? '',
          posterPath: movie.posterPath ?? '',
          showingUrl: movie.showingUrl,
          theaterName: movie.theaterName,
          time: movie.time,
          title: movie.title,
          tmdbId: movie.tmdbId,
          url: movie.url,
          year: movie.year,
        })),
      })
      req = getMockReq({
        params: { weekId: '2021-01-01' },
      })
    })

    it('returns a calendar event for the week', async () => {
      await new WeekEventController(firestoreAdapter).show(req, res)

      expect(res.type).toHaveBeenCalledWith('text/calendar')
      expect(res.send).toHaveBeenCalledWith(await icalGenerator(week))
    })
  })

  describe('week does not exist', () => {
    beforeEach(() => {
      FirebaseMock.mockGetWeek()
      req = getMockReq({
        params: { weekId: '2021-01-01' },
      })
    })

    it('should return a 404', async () => {
      await new WeekEventController(firestoreAdapter).show(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Week 2021-01-01 not found',
      })
    })
  })
})
