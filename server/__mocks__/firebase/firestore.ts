/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from 'firebase/firestore'
import { vi } from 'vitest'

export const transaction = {
  set: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

module.exports = {
  addDoc: vi.fn(),
  and: vi.fn((...filters: any[]) => ({ and: filters })),
  connectFirestoreEmulator: vi.fn().mockImplementation((app, _, __) => app),
  collection: vi.fn((firestore: any, collectionPath: string) => ({
    collectionPath,
    firestore,
  })),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  getFirestore: vi.fn().mockReturnValue({ firestore: 'firestore' }),
  runTransaction: (firestore: any, updateFunction: any, _options: any) => {
    return updateFunction(transaction)
  },
  deleteDoc: vi.fn(),
  doc: (firestore: any, collectionPath: string, documentPath?: string) => ({
    firestore,
    collectionPath,
    documentPath,
  }),
  limit: vi.fn((limit: number) => ({ limit })),
  orderBy: vi.fn((fieldPath: string, directionStr?: string) => ({
    fieldPath,
    directionStr,
  })),
  query: vi.fn(),
  setDoc: vi.fn(),
  transaction: transaction,
  Timestamp: {
    fromDate: (date: Date) => Timestamp.fromDate(date),
    now: () => Timestamp.now(),
  },
  where: vi.fn((fieldPath: string, opStr: string, value: any) => ({
    fieldPath,
    opStr,
    value,
  })),
}
