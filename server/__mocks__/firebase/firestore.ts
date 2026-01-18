/* eslint-disable @typescript-eslint/no-explicit-any */
import * as firestore from 'firebase/firestore'
import { vi } from 'vitest'

export const transaction = {
  set: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

export const addDoc = vi.fn()
export const and = vi.fn((...filters: any[]) => ({ and: filters }))
export const connectFirestoreEmulator = vi
  .fn()
  .mockImplementation((app, _, __) => app)
export const collection = vi.fn((firestore: any, collectionPath: string) => ({
  collectionPath,
  firestore,
}))
export const getDoc = vi.fn()
export const getDocs = vi.fn()
export const getFirestore = vi.fn().mockReturnValue({ firestore: 'firestore' })
export const runTransaction = (
  firestore: any,
  updateFunction: any,
  _options: any
) => {
  return updateFunction(transaction)
}
export const deleteDoc = vi.fn()
export const doc = (
  firestore: any,
  collectionPath: string,
  documentPath?: string
) => ({
  firestore,
  collectionPath,
  documentPath,
})
export const limit = vi.fn((limit: number) => ({ limit }))
export const orderBy = vi.fn((fieldPath: string, directionStr?: string) => ({
  fieldPath,
  directionStr,
}))
export const query = vi.fn()
export const setDoc = vi.fn()
export const Timestamp = {
  fromDate: (date: Date) => firestore.Timestamp.fromDate(date),
  now: () => firestore.Timestamp.now(),
}
export const where = vi.fn((fieldPath: string, opStr: string, value: any) => ({
  fieldPath,
  opStr,
  value,
}))
