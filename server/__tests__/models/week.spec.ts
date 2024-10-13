import { it, describe, expect, beforeEach } from '@jest/globals'
import { Week } from '@server/models/week'
import MovieFactory from '@tests/support/factories/movieFactory'
import WeekFactory from '@tests/support/factories/weekFactory'
import { DateTime } from 'luxon'

describe('dateString', () => {
  let week: Week

  beforeEach(() => {
    week = new WeekFactory().make({
      date: DateTime.fromISO('2021-09-13'),
    })
  })

  it('returns the date as a string', () => {
    expect(week.dateString).toEqual('2021-09-13')
  })
})

describe('totalLength', () => {
  it('calculates total length with no times', () => {
    const week = new WeekFactory().make({
      movies: [
        new MovieFactory().make({ length: 90, time: null }),
        new MovieFactory().make({ length: 120, time: null }),
      ],
    })

    expect(week.totalLength).toEqual(30 + 90 + 120 + 15)
  })

  it('calculates total length with no times with many movies', () => {
    const week = new WeekFactory().make({
      movies: [
        new MovieFactory().make({ length: 90, time: null }),
        new MovieFactory().make({ length: 120, time: null }),
        new MovieFactory().make({ length: 45, time: null }),
        new MovieFactory().make({ length: 100, time: null }),
      ],
    })

    expect(week.totalLength).toEqual(
      30 +
      90 + 15 +
      120 + 15 +
      45 + 15 +
      100
    )
  })

  it('calculates total length with times on all', () => {
    const week = new WeekFactory().make({
      movies: [
        new MovieFactory().make({ time: '6:00 PM', length: 60 }),
        new MovieFactory().make({ time: '8:00 PM', length: 120 }),
      ],
    })

    expect(week.totalLength).toEqual(30 + 240)
  })

  it('calculates total length with times on some', () => {
    const week = new WeekFactory().make({
      movies: [
        new MovieFactory().make({ time: '6:00 PM', length: 60 }),
        new MovieFactory().make({ time: '8:00 PM', length: 120 }),
        new MovieFactory().make({ time: null, length: 45 }),
        new MovieFactory().make({ time: null, length: 100 }),
      ],
    })

    expect(week.totalLength).toEqual(
      30 +
      240 + 15 +
      45 + 15 +
      100
    )
  })
})

describe('startTime', () => {
  describe('with start time', () => {
    it('returns 30 minutes before start time', () => {
      const week = new WeekFactory().make({
        date: DateTime.fromISO('2021-09-13'),
        movies: [
          new MovieFactory().make({ length: 105, time: '6:00 PM' }),
          new MovieFactory().make({ length: 120, time: '8:00 PM' }),
        ],
      })

      expect(week.startTime).toEqual(DateTime.fromISO('2021-09-13T17:30:00'))
    })
  })
})
