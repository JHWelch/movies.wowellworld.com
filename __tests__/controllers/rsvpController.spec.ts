import RsvpController from '../../src/controllers/rsvpController'
import { beforeEach, describe, expect, it } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { addDoc } from 'firebase/firestore'
import { FirebaseMock } from '../support/firebaseMock'
import FirestoreAdapter from '../../src/data/firestore/firestoreAdapter'

const { res, mockClear } = getMockRes()

beforeEach(() => {
  mockClear()
})

const mockBody = ({
  name = 'test name',
  email = 'test@example.com',
  plusOne = true,
} = {}) => ({ name, email, plusOne })

describe('store', () => {
  let  firestoreAdapter: FirestoreAdapter

  beforeEach(() => {
    firestoreAdapter = new FirestoreAdapter()
  })

  it('should save the rsvp', async () => {
    const req = getMockReq({
      params: { weekId: '2023-01-01' },
      body: mockBody(),
    })

    await new RsvpController(firestoreAdapter).store(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(addDoc).toHaveBeenCalledWith(
      FirebaseMock.mockCollection('rsvps'),
      {
        week: '2023-01-01',
        name: 'test name',
        email: 'test@example.com',
        plusOne: true,
      }
    )
  })

  describe('when email is missing', () => {
    it('should return a 422', async () => {
      const req = getMockReq({
        params: { weekId: '2023-01-01' },
        body: {
          name: 'test',
          plusOne: true,
        } })

      await new RsvpController(firestoreAdapter).store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: 'Required' },
      })
    })
  })

  describe('when email is invalid', () => {
    it('should return a 422', async () => {
      const req = getMockReq({
        params: { weekId: '2023-01-01' },
        body: mockBody({ email: 'invalid' }),
      })

      await new RsvpController(firestoreAdapter).store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: 'Invalid email' },
      })
    })
  })

  describe('when name is missing', () => {
    it('should return a 422', async () => {
      const req = getMockReq({
        params: { weekId: '2023-01-01' },
        body: {
          email: 'test@example.com',
          plusOne: true,
        } })

      await new RsvpController(firestoreAdapter).store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { name: 'Required' },
      })
    })
  })

  describe('when name is empty string', () => {
    it('should return a 422', async () => {
      const req = getMockReq({
        params: { weekId: '2023-01-01' },
        body: mockBody({ name: '' }),
      })

      await new RsvpController(firestoreAdapter).store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { name: 'Required' },
      })
    })
  })

  describe('when plusOne is missing', () => {
    it('should return a 422', async () => {
      const req = getMockReq({
        params: { weekId: '2023-01-01' },
        body: {
          name: 'test',
          email: 'test@example.com',
        } })

      await new RsvpController(firestoreAdapter).store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { plusOne: 'Required' },
      })
    })
  })

  describe('when plusOne is not a boolean', () => {
    it('should return a 422', async () => {
      const req = getMockReq({
        params: { weekId: '2023-01-01' },
        body: {
          name: 'test',
          email: 'test@example.com',
          plusOne: 'invalid',
        },
      })

      await new RsvpController(firestoreAdapter).store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { plusOne: 'Expected boolean, received string' },
      })
    })
  })
})