import { jest } from '@jest/globals'

module.exports = {
  getFirestore: jest.fn().mockReturnValue({}),
}

// jest.mock('firebase/firestore', () => ({
//   getFirestore: jest.fn().mockReturnValue({}),
//   doc: jest.fn().mockReturnValue({}),
//   runTransaction: (firestore: Firestore, updateFunction: (transaction: Transaction) => Promise<void>, options?: TransactionOptions): Promise<void> => {
//     const transaction = {
//       set: jest.fn(),
//       get: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//     }

//     return updateFunction(transaction)
//   },
// }))
