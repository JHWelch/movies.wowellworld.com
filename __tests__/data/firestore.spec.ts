import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'
import Firestore from '../../src/data/firestore'
import { getFirestore } from 'firebase/firestore'
import { FirebaseMock } from '../support/firebaseMock'
import Week from '../../src/models/week'

beforeAll(() => {
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')
  jest.mock('firebase/firestore')
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('constructor', () => {
  it('initializes the firestore', () => {
    new Firestore()

    expect (applicationDefault).toHaveBeenCalledTimes(1)
    expect (initializeApp).toHaveBeenCalledTimes(1)
    expect (getFirestore).toHaveBeenCalledTimes(1)
  })
})

describe('getUpcomingWeeks', () => {
  let firestore: Firestore

  beforeEach(() => {
    firestore = new Firestore()
    FirebaseMock.mockWeeks([
      {
        date: new Date('2021-01-01'),
        id: 'id1',
        isSkipped: false,
        theme: 'theme1',
      }, {
        date: new Date('2021-01-08'),
        id: 'id2',
        isSkipped: false,
        theme: 'theme2',
      }, {
        date: new Date('2021-01-15'),
        id: 'id3',
        isSkipped: false,
        theme: 'theme3',
      },
    ])
  })

  it('should return all future weeks', async () => {
    const weeks = await firestore.getUpcomingWeeks()

    expect(weeks).toEqual([
      new Week('id1', 'theme1', new Date('2021-01-01')),
      new Week('id2', 'theme2', new Date('2021-01-08')),
      new Week('id3', 'theme3', new Date('2021-01-15')),
    ])
  })
})

describe('getPastWeeks', () => {
  let firestore: Firestore

  beforeEach(() => {
    firestore = new Firestore()
    FirebaseMock.mockWeeks([
      {
        date: new Date('2021-01-01'),
        id: 'id1',
        isSkipped: false,
        theme: 'theme1',
      }, {
        date: new Date('2021-01-08'),
        id: 'id2',
        isSkipped: false,
        theme: 'theme2',
      }, {
        date: new Date('2021-01-15'),
        id: 'id3',
        isSkipped: false,
        theme: 'theme3',
      },
    ])
  })

  it ('should return only past weeks', async () => {
    const weeks = await firestore.getPastWeeks()

    expect(weeks).toEqual([
      new Week('id1', 'theme1', new Date('2021-01-01')),
      new Week('id2', 'theme2', new Date('2021-01-08')),
      new Week('id3', 'theme3', new Date('2021-01-15')),
    ])
  })
})
