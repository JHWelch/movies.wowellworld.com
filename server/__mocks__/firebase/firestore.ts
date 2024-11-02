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
  addDoc: jest.fn(),
  and: jest.fn((...filters: any[]) => ({ and: filters })),
  connectFirestoreEmulator: jest.fn().mockImplementation((app, _, __) => app),
  collection: jest.fn((firestore: any, collectionPath: string) => ({
    collectionPath,
    firestore,
  })),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  getFirestore: jest.fn().mockReturnValue({ firestore: 'firestore' }),
  runTransaction: (firestore: any, updateFunction: any, _options: any) => {
    return updateFunction(transaction)
  },
  deleteDoc: jest.fn(),
  doc: (firestore: any, collectionPath: string, documentPath?: string) => ({
    firestore,
    collectionPath,
    documentPath,
  }),
  limit: jest.fn((limit: number) => ({ limit })),
  orderBy: jest.fn((fieldPath: string, directionStr?: string) => ({
    fieldPath,
    directionStr,
  })),
  query: jest.fn(),
  setDoc: jest.fn(),
  transaction: transaction,
  Timestamp: {
    fromDate: (date: Date) => Timestamp.fromDate(date),
    now: () => Timestamp.now(),
  },
  where: jest.fn((fieldPath: string, opStr: string, value: any) => ({
    fieldPath,
    opStr,
    value,
  })),
}
