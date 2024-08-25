import { describe, expect, it } from '@jest/globals'
import { minutesAsTimeString } from '@server/helpers/timeStrings'

describe('minutesAsTimeString', () => {
  it('should properly format minutes to time', () => {
    expect(minutesAsTimeString(0)).toBe('12:00 AM')
    expect(minutesAsTimeString(400)).toBe('6:40 AM')
    expect(minutesAsTimeString(720)).toBe('12:00 PM')
    expect(minutesAsTimeString(1830)).toBe('6:30 PM')
  })
})
