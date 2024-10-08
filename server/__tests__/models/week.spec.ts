import { it, describe, expect, beforeEach } from '@jest/globals'
import { Week } from '@server/models/week'
import MovieFactory from '@tests/support/factories/movieFactory'
import WeekFactory from '@tests/support/factories/weekFactory'

describe('dateString', () => {
  let week: Week

  beforeEach(() => {
    week = new WeekFactory().make({
      date: new Date('2021-09-13'),
    })
  })

  it('returns the date as a string', () => {
    expect(week.dateString).toEqual('2021-09-13')
  })
})

describe('totalLength', () => {
  it('can get total length with no times', () => {
    const week = new WeekFactory().make({
      movies: [
        new MovieFactory().make({ length: 90 }),
        new MovieFactory().make({ length: 120 }),
      ],
    })

    expect(week.totalLength).toEqual(90 + 120 + 15)
  })
})
