import { describe, expect, it } from '@jest/globals'
import { minutesAsTimeString, timeStringAsMinutes } from '@server/helpers/timeStrings'

describe('minutesAsTimeString', () => {
  it('should properly format minutes to time', () => {
    expect(minutesAsTimeString(0)).toBe('12:00 AM')
    expect(minutesAsTimeString(400)).toBe('6:40 AM')
    expect(minutesAsTimeString(720)).toBe('12:00 PM')
    expect(minutesAsTimeString(1830)).toBe('6:30 PM')
  })
})

describe('timeStringAsMinutes', () => {
  it('should properly format time to minutes', () => {
    expect(timeStringAsMinutes('12:00 AM')).toBe(0)
    expect(timeStringAsMinutes('6:40 AM')).toBe(400)
    expect(timeStringAsMinutes('12:00 PM')).toBe(720)
    expect(timeStringAsMinutes('6:30 PM')).toBe(1110)
  })
})
