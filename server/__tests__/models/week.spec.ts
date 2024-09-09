import { it, describe, expect, beforeEach } from '@jest/globals'
import { Week } from '@server/models/week'

describe('dateString', () => {
  let week: Week

  beforeEach(() => {
    week = new Week({
      id: 'id',
      theme: 'theme',
      date: new Date('2021-09-13'),
    })
  })

  it('returns the date as a string', () => {
    expect(week.dateString).toEqual('2021-09-13')
  })
})
