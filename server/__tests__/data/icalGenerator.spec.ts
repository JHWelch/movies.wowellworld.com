import { beforeEach, expect, it } from '@jest/globals'
import { icalGenerator } from '@server/data/icalGenerator'
import MovieFactory from '@tests/support/factories/movieFactory'
import WeekFactory from '@tests/support/factories/weekFactory'
import MockDate from 'mockdate'

beforeEach(() => {
  MockDate.set('2021-01-01')
})

it('can generate an ical file from a week', () => {
  const week = new WeekFactory({

  }).make()
  week.movies = [
    new MovieFactory({
      time: '6:00 PM',
      length: 105,
    }).make(),
    new MovieFactory({
      time: '8:00 PM',
    }).make(),
  ]

  expect(icalGenerator(week)).toMatchSnapshot()
})
