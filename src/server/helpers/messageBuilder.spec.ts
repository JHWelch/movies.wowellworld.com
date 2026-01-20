import { withMessage } from '@server/helpers/messageBuilder'
import { describe, expect, it } from 'vitest'

describe('withMessage', () => {
  describe('called with defaults', () => {
    it('builds success url', () => {
      expect(withMessage('route', 'message')).toBe(
        'route?message=message&type=success',
      )
    })

    it('escapes longer messages', () => {
      expect(withMessage('route', 'message&message and message')).toBe(
        'route?message=message%26message%20and%20message&type=success',
      )
    })
  })

  describe('called with type', () => {
    it('builds url with type', () => {
      expect(withMessage('route', 'message', 'error')).toBe(
        'route?message=message&type=error',
      )
    })
  })
})
