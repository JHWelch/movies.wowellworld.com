/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from '@jest/globals'

export const transaction = {
  set: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

module.exports = {
  getFirestore: jest.fn().mockReturnValue({}),
  runTransaction: (firestore: any, updateFunction: any, _options: any) => {
    return updateFunction(transaction)
  },
  doc: jest.fn().mockReturnValue({}),
  transaction: transaction,
}
