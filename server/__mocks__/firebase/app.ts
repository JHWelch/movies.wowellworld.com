import { vi } from 'vitest'

module.exports = {
  initializeApp: vi.fn()
    .mockImplementation((config) => ({ initialize: config })),
}
