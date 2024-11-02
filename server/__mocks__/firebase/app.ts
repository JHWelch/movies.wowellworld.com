import { jest } from '@jest/globals'

module.exports = {
  initializeApp: jest.fn()
    .mockImplementation((config) => ({ initialize: config })),
}
