
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import SubscriptionController
  from '../../src/controllers/subscriptionController'
import { Request } from 'express'
import FirestoreAdapter from '../../src/data/firestore/firestoreAdapter'
import { mockConfig } from '../support/mockConfig'
import { FirebaseMock } from '../support/firebaseMock'
import { addDoc } from 'firebase/firestore'

const { res, mockClear } = getMockRes()
let req: Request
let firestore: FirestoreAdapter

beforeAll(() => {
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')
  jest.mock('firebase/firestore')
})

beforeEach(() => {
  firestore = new FirestoreAdapter(mockConfig())
  mockClear()
})

interface MockBodyArgs {
  email?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const mockBody = ({
  email = 'test@example.com',
}: MockBodyArgs = {}) => ({ email })

describe('store', () => {
  describe('all fields correct', () => {
    beforeEach(() => {
      req = getMockReq({
        body: mockBody(),
      })
    })

    it('should return 200', async () => {
      await new SubscriptionController(firestore).store(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('creates a new user with reminders enabled', async () => {
      await new SubscriptionController(firestore).store(req, res)

      expect(addDoc).toHaveBeenCalledWith(
        FirebaseMock.mockCollection('users'),
        {
          email: 'test@example.com',
          reminders: true,
        },
      )
    })
  })
})
