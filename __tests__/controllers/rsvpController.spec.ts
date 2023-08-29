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

describe('store', () => {
  let  firestoreAdapter: FirestoreAdapter

  beforeEach(() => {
    firestoreAdapter = new FirestoreAdapter()
  })

  it('should save the rsvp', async () => {
    const req = getMockReq({
      params: { weekId: '2023-01-01' },
      body: {
        name: 'test',
        email: 'test@example.com',
        plusOne: true,
      } })

    await new RsvpController(firestoreAdapter).store(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(addDoc).toHaveBeenCalledWith(
      FirebaseMock.mockCollection('rsvps'),
      {
        week: '2023-01-01',
        name: 'test',
        email: 'test@example.com',
        plusOne: true,
      }
    )
  })
})
