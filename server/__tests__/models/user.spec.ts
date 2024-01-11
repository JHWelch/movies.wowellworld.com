import { describe, expect, it } from '@jest/globals'
import User from '../../src/models/user'

describe('unsubscribeUrl', () => {
  it('returns the unsubscribe url', () => {
    expect(new User('user-id', 'test@example.com').unsubscribeUrl())
      .toBe('/unsubscribe?token=user-id')
  })
})
