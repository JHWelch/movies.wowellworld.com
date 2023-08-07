import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'
import FirestoreAdapter from '../../src/data/firestoreAdapter'
import {
  getFirestore,
  query,
} from 'firebase/firestore'
import { transaction } from '../../__mocks__/firebase/firestore'
import { FirebaseMock } from '../support/firebaseMock'
import Week from '../../src/models/week'

let firestore: FirestoreAdapter

beforeAll(() => {
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')
  jest.mock('firebase/firestore')
})

beforeEach(() => {
  firestore = new FirestoreAdapter()
  jest.clearAllMocks()
})

describe('constructor', () => {
  it('initializes the firestore', () => {
    firestore = new FirestoreAdapter()

    expect (applicationDefault).toHaveBeenCalledTimes(1)
    expect (initializeApp).toHaveBeenCalledTimes(1)
    expect (getFirestore).toHaveBeenCalledTimes(1)
  })
})

describe('getUpcomingWeeks', () => {
  beforeEach(() => {
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

  it('should query with the correct constraints', async () => {
    await firestore.getUpcomingWeeks()

    expect(query).toHaveBeenCalledWith(
      { firestore: { firestore: 'firestore' }, collectionPath: 'weeks' },
      { fieldPath: 'date', opStr: '>=', value: firestore.today() },
      { fieldPath: 'date' }
    )
  })
})

describe('getPastWeeks', () => {
  beforeEach(() => {
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

  it('should query with the correct constraints', async () => {
    await firestore.getPastWeeks()

    expect(query).toHaveBeenCalledWith(
      { firestore: { firestore: 'firestore' }, collectionPath: 'weeks' },
      { fieldPath: 'date', opStr: '<', value: firestore.today() },
      { fieldPath: 'date', directionStr: 'desc' }
    )
  })
})

describe('cacheWeeks', () => {
  describe('when the cache is empty', () => {
    it('updates all weeks in firestore', async () =>  {
      await firestore.cacheWeeks([
        new Week('id1', 'theme1', new Date('2021-01-01')),
        new Week('id2', 'theme2', new Date('2021-01-08')),
        new Week('id3', 'theme3', new Date('2021-01-15')),
      ])

      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          (new Week('id1', 'theme1', new Date('2021-01-01'), false)).toFirebaseDTO()
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-08'),
          (new Week('id2', 'theme2', new Date('2021-01-08'), false)).toFirebaseDTO()
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-15'),
          (new Week('id3', 'theme3', new Date('2021-01-15'), false)).toFirebaseDTO()
        )
    })
  })
})
