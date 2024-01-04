
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
import { addDoc, setDoc } from 'firebase/firestore'

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

    describe('user does not exist', () => {
      beforeEach(() => {
        FirebaseMock.mockGetUserByEmail()
      })

      it('should return 201', async () => {
        await new SubscriptionController(firestore).store(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
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

    describe('user already exists and is subscribed', () => {
      beforeEach(() => {
        FirebaseMock.mockGetUserByEmail({
          id: 'id',
          email: 'test@example.com',
          reminders: true,
        })
      })

      it('should return 409', async () => {
        await new SubscriptionController(firestore).store(req, res)

        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith({
          errors: { email: 'Already subscribed' },
          message: "You're already subscribed! Check your spam folder if you don't get the emails.",
        })
      })
    })

    describe('user already exists and is unsubscribed', () => {
      beforeEach(() => {
        FirebaseMock.mockGetUserByEmail({
          id: 'id',
          email: 'test@example.com',
          reminders: false,
        })
      })

      it('should return 200', async () => {
        await new SubscriptionController(firestore).store(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
      })

      it('updates the user to be subscribed', async () => {
        await new SubscriptionController(firestore).store(req, res)

        expect(setDoc).toHaveBeenCalledWith(
          FirebaseMock.mockDoc('users', 'id'),
          {
            email: 'test@example.com',
            reminders: true,
          },
        )
      })
    })
  })

  describe('when email is missing', () => {
    beforeEach(() => {
      const body = mockBody()
      delete body.email
      req = getMockReq({
        body: body,
      })
    })

    it('should return a 422', async () => {
      await new SubscriptionController(firestore).store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: 'Required' },
      })
    })
  })

  describe('when email is malformed', () => {
    beforeEach(() => {
      req = getMockReq({
        body: mockBody({ email: 'test' }),
      })
    })

    it('should return a 422', async () => {
      await new SubscriptionController(firestore).store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: 'Invalid email' },
      })
    })
  })
})
