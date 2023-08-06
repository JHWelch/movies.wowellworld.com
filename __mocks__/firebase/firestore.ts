/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from '@jest/globals'
import { Timestamp } from 'firebase/firestore'

export const transaction = {
  set: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

module.exports = {
  collection: jest.fn().mockReturnValue({}),
  getDocs: jest.fn(),
  getFirestore: jest.fn().mockReturnValue({}),
  runTransaction: (firestore: any, updateFunction: any, _options: any) => {
    return updateFunction(transaction)
  },
  doc: (firestore: any, collectionPath: string, documentPath?: string) => ({
    firestore,
    collectionPath,
    documentPath,
  }),
  orderBy: jest.fn(),
  query: jest.fn(),
  transaction: transaction,
  Timestamp: {
    fromDate: (date: Date) => Timestamp.fromDate(date),
    now: () => Timestamp.now(),
  },
  where: jest.fn(),
}
