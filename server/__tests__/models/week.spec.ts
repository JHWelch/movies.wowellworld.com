import { it, describe, expect, beforeEach } from '@jest/globals'
import Week from '../../src/models/week'

describe('dateString', () => {
  let week: Week

  beforeEach(() => {
    week = new Week(
      'id',
      'theme',
      new Date('2021-09-13'),
      false,
    )
  })

  it('returns the date as a string', () => {
    expect(week.dateString).toEqual('2021-09-13')
  })
})
