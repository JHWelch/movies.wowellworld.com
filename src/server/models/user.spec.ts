import { describe, expect, it } from 'vitest'
import User from '@server/models/user'

describe('unsubscribeUrl', () => {
  it('returns the unsubscribe url', () => {
    expect(new User('user-id', 'test@example.com').unsubscribeUrl())
      .toBe('/unsubscribe?token=user-id')
  })
})
