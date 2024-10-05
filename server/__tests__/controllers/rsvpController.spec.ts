import RsvpController from '@server/controllers/rsvpController'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Timestamp, addDoc, setDoc } from 'firebase/firestore'
import { FirebaseMock } from '@tests/support/firebaseMock'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { mockConfig } from '@tests/support/mockConfig'
import { Request } from 'express'

const { res, mockClear } = getMockRes()

beforeEach(() => {
  jest.clearAllMocks()
  mockClear()
})

const mockBody = ({
  name = 'test name',
  email = 'test@example.com',
  plusOne = true,
  reminders = false,
}: {
  name?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  email?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  plusOne?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  reminders?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
} = {}) => ({ name, email, plusOne, reminders })

describe('store', () => {
  let firestoreAdapter: FirestoreAdapter
  let req: Request

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
      req = getMockReq({
        params: { weekId: '2023-01-01' },
        body: mockBody(),
      })
    })

    it('submits the form', async () => {
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

    describe('reminders are enabled', () => {
      beforeEach(() => {
        req.body.reminders = true
      })

      describe('user does not exist', () => {
        beforeEach(() => {
          FirebaseMock.mockGetUserByEmail()
        })

        it('submits the form', async () => {
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

        it('creates a new user with reminders enabled', async () => {
          await new RsvpController(firestoreAdapter).store(req, res)

          expect(addDoc).toHaveBeenCalledWith(
            FirebaseMock.mockCollection('users'),
            {
              email: 'test@example.com',
              reminders: true,
            },
          )
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

        it('submits the form', async () => {
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

        it('updates the user to be subscribed', async () => {
          await new RsvpController(firestoreAdapter).store(req, res)

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

    describe('reminders is not boolean', () => {
      beforeEach(() => {
        req.body.reminders = 'invalid'
      })

      it('should return a 422', async () => {
        await new RsvpController(firestoreAdapter).store(req, res)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({
          errors: { reminders: 'Expected boolean, received string' },
        })
      })
    })

    describe('email is missing', () => {
      beforeEach(() => {
        delete req.body.email
      })

      it('submits the form', async () => {
        await new RsvpController(firestoreAdapter).store(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(addDoc).toHaveBeenCalledWith(
          FirebaseMock.mockCollection('rsvps'),
          {
            week: '2023-01-01',
            name: 'test name',
            email: null,
            plusOne: true,
            createdAt: expect.any(Timestamp.constructor),
          },
        )
      })

      it('sends an email to admins', async () => {
        await new RsvpController(firestoreAdapter).store(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(addDoc).toHaveBeenCalledWith(
          FirebaseMock.mockCollection('mail'),
          {
            to: 'ADMIN_EMAIL@example.com',
            message: {
              subject: 'TNMC RSVP: test name',
              text: 'test name has RSVPed for 2023-01-01\n\nEmail: None\nPlus one: true',
              html: '<p>test name has RSVPed for 2023-01-01<p><ul><li>Email: None</li><li>Plus one: true</li></ul>',
            },
          },
        )
      })

      describe('reminders is selected', () => {
        it('should return a 422', async () => {
          req.body.reminders = true

          await new RsvpController(firestoreAdapter).store(req, res)

          expect(res.status).toHaveBeenCalledWith(422)
          expect(res.json).toHaveBeenCalledWith({
            errors: { email: 'Email is required to receive reminders' },
          })
        })
      })
    })

    describe('email is invalid', () => {
      beforeEach(() => {
        req.body.email = 'invalid'
      })

      it('should return a 422', async () => {
        await new RsvpController(firestoreAdapter).store(req, res)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({
          errors: { email: 'Invalid email' },
        })
      })
    })

    describe('name is missing', () => {
      beforeEach(() => {
        delete req.body.name
      })

      it('should return a 422', async () => {
        await new RsvpController(firestoreAdapter).store(req, res)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({
          errors: { name: 'Required' },
        })
      })
    })

    describe('name is empty string', () => {
      beforeEach(() => {
        req.body.name = ''
      })

      it('should return a 422', async () => {
        await new RsvpController(firestoreAdapter).store(req, res)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({
          errors: { name: 'Required' },
        })
      })
    })

    describe('plusOne is missing', () => {
      beforeEach(() => {
        delete req.body.plusOne
      })

      it('should return a 422', async () => {
        await new RsvpController(firestoreAdapter).store(req, res)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({
          errors: { plusOne: 'Required' },
        })
      })
    })

    describe('plusOne is not a boolean', () => {
      beforeEach(() => {
        req.body.plusOne = 'invalid'
      })

      it('should return a 422', async () => {
        await new RsvpController(firestoreAdapter).store(req, res)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({
          errors: { plusOne: 'Expected boolean, received string' },
        })
      })
    })
  })

  describe('week does not exist', () => {
    beforeEach(() => {
      FirebaseMock.mockGetWeek()
      req = getMockReq({
        params: { weekId: '2023-01-01' },
        body: mockBody(),
      })
    })

    it('should return a 404', async () => {
      await new RsvpController(firestoreAdapter).store(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Week 2023-01-01 not found',
      })
    })
  })
})
