import { vi } from 'vitest'

export const initializeApp = vi.fn()
  .mockImplementation((config) => ({ initialize: config }))
