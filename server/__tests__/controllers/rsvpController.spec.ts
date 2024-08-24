import RsvpController from '@server/controllers/rsvpController'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Timestamp, addDoc } from 'firebase/firestore'
import { FirebaseMock } from '@tests/support/firebaseMock'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { mockConfig } from '@tests/support/mockConfig'

const { res, mockClear } = getMockRes()

beforeEach(() => {
  jest.clearAllMocks()
  mockClear()
})

interface MockBodyArgs {
  name?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  email?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  plusOne?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const mockBody = ({
  name = 'test name',
  email = 'test@example.com',
  plusOne = true,
}: MockBodyArgs = {}) => ({ name, email, plusOne })

describe('store', () => {
  let  firestoreAdapter: FirestoreAdapter

  beforeEach(() => {
    firestoreAdapter = new FirestoreAdapter(mockConfig())
  })

  describe('has correct week', () => {
    beforeEach(() => {
      FirebaseMock.mockGetWeek({
        date: new Date('2023-01-01'),
        id: 'id1',
        isSkipped: false,
        theme: 'theme1',
      })
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
          createdAt: expect.any(Timestamp.constructor),
        },
      )
    })

    it('sends an email to admins', async () => {
      const req = getMockReq({
        params: { weekId: '2023-01-01' },
        body: mockBody(),
      })

      await new RsvpController(firestoreAdapter).store(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(addDoc).toHaveBeenCalledWith(
        FirebaseMock.mockCollection('mail'),
        {
          to: 'ADMIN_EMAIL@example.com',
          message: {
            subject: 'TNMC RSVP: test name',
            text: 'test name has RSVPed for 2023-01-01\n\nEmail: test@example.com\nPlus one: true',
            html: '<p>test name has RSVPed for 2023-01-01<p><ul><li>Email: test@example.com</li><li>Plus one: true</li></ul>',
          },
        },
      )
    })

    describe('when email is missing', () => {
      it('should return a 422', async () => {
        const body = mockBody()
        delete body.email
        const req = getMockReq({
          params: { weekId: '2023-01-01' },
          body: body,
        })

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
        const body = mockBody()
        delete body.name
        const req = getMockReq({
          params: { weekId: '2023-01-01' },
          body: body,
        })

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
        const body = mockBody()
        delete body.plusOne
        const req = getMockReq({
          params: { weekId: '2023-01-01' },
          body: body,
        })

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
          body: mockBody({ plusOne: 'invalid' }),
        })

        await new RsvpController(firestoreAdapter).store(req, res)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({
          errors: { plusOne: 'Expected boolean, received string' },
        })
      })
    })
  })

  describe('when week does not exist', () => {
    beforeEach(() => {
      FirebaseMock.mockGetWeek()
    })

    it('should return a 404', async () => {
      const req = getMockReq({
        params: { weekId: '2023-01-01' },
        body: mockBody(),
      })

      await new RsvpController(firestoreAdapter).store(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Week 2023-01-01 not found',
      })
    })
  })
})
