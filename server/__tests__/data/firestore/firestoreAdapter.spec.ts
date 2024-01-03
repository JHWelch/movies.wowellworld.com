import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'
import FirestoreAdapter from '../../../src/data/firestore/firestoreAdapter'
import {
  Timestamp,
  addDoc,
  getFirestore,
  query,
} from 'firebase/firestore'
import { transaction } from '../../../__mocks__/firebase/firestore'
import { FirebaseMock } from '../../support/firebaseMock'
import Week from '../../../src/models/week'
import { mockConfig } from '../../support/mockConfig'
import MovieFactory from '../../support/factories/movieFactory'

let firestore: FirestoreAdapter

beforeAll(() => {
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')
  jest.mock('firebase/firestore')
})

beforeEach(() => {
  firestore = new FirestoreAdapter(mockConfig())
  jest.clearAllMocks()
})

describe('constructor', () => {
  it('initializes the firestore', () => {
    firestore = new FirestoreAdapter(mockConfig())

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
      { fieldPath: 'date' },
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
      { and: [
        { fieldPath: 'date', opStr: '<', value: firestore.today() },
        { fieldPath: 'isSkipped', opStr: '==', value: false },
      ] },
      { fieldPath: 'date', directionStr: 'desc' },
    )
  })
})

describe('getWeek', () => {
  describe('when the week exists', () => {
    beforeEach(() => {
      FirebaseMock.mockGetWeek({
        date: new Date('2021-01-01'),
        id: 'id1',
        isSkipped: false,
        theme: 'theme1',
      })
    })

    it('returns the week', async () => {
      const week = await firestore.getWeek('2021-01-01')

      expect(week).toEqual(
        new Week('id1', 'theme1', new Date('2021-01-01')),
      )
    })
  })

  describe('when the week does not exist', () => {
    beforeEach(() => {
      FirebaseMock.mockGetWeek({
        date: new Date('2021-01-01'),
        id: 'id1',
        isSkipped: false,
        theme: 'theme1',
      }, false)
    })

    it('returns null', async () => {
      expect(await firestore.getWeek('2021-01-01')).toBeNull()
    })
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
          FirebaseMock.mockWeek('id1', 'theme1', '2021-01-01'),
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-08'),
          FirebaseMock.mockWeek('id2', 'theme2', '2021-01-08'),
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-15'),
          FirebaseMock.mockWeek('id3', 'theme3', '2021-01-15'),
        )
    })
  })

  it('can update a week with movies', async () => {
    const movie = new MovieFactory().make()
    const weekWithMovie = new Week(
      'id1',
      'theme1',
      new Date('2021-01-01'),
      false,
      null,
      [movie],
    )

    await firestore.cacheWeeks([
      weekWithMovie,
    ])

    expect(transaction.set)
      .toHaveBeenCalledWith(
        FirebaseMock.mockDoc('weeks', '2021-01-01'),
        FirebaseMock.mockWeek('id1', 'theme1', '2021-01-01', [movie]),
      )
  })

  describe('when mode is development', () => {
    it('uses the development collection', async () => {
      firestore = new FirestoreAdapter(mockConfig({ nodeEnv: 'development' }))

      await firestore.cacheWeeks([
        new Week('id1', 'theme1', new Date('2021-01-01')),
      ])

      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks-dev', '2021-01-01'),
          FirebaseMock.mockWeek('id1', 'theme1', '2021-01-01'),
        )
    })
  })
})

describe('createRsvp', () => {
  it('creates an rsvp in firestore', async () => {
    await firestore.createRsvp(
      '2023-01-01',
      'test name',
      'test@example.com',
      true,
    )

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
})

describe ('sendEmail', () => {
  it('sends an email', async () => {
    await firestore.sendEmail('jsmith@example.com', {
      subject: 'test subject',
      text: 'test text',
      html: 'test <p>html</p>',
    })

    expect(addDoc).toHaveBeenCalledWith(
      FirebaseMock.mockCollection('mail'),
      {
        to: 'jsmith@example.com',
        message: {
          subject: 'test subject',
          text: 'test text',
          html: 'test <p>html</p>',
        },
      },
    )
  })
})

describe('sendEmailTemplate', () => {
  describe('rsvpConfirmation template', () => {
    it('sends an email', async () => {
      await firestore.sendEmailTemplate(
        'jsmith@example.com',
        'rsvpConfirmation',
        {
          date: 'Thursday, January 1st',
          theme: 'test theme',
          movies: [
            {
              title: 'test title',
              year: '2021',
              time: '6:00pm',
              posterPath: 'https://example.com/poster.jpg',
            },
          ],
        })

      expect(addDoc).toHaveBeenCalledWith(
        FirebaseMock.mockCollection('mail'),
        {
          to: 'jsmith@example.com',
          template: {
            name: 'rsvpConfirmation',
            data: {
              date: 'Thursday, January 1st',
              theme: 'test theme',
              movies: [
                {
                  title: 'test title',
                  year: '2021',
                  time: '6:00pm',
                  posterPath: 'https://example.com/poster.jpg',
                },
              ],
            },
          },
        },
      )
    })
  })
})

describe('updateTemplates', () => {
  it('should update the templates with new data', async () => {
    await firestore.updateTemplates([
      {
        name: 'templateId',
        subject: 'new subject',
        html: 'new html',
      }, {
        name: 'templateId2',
        subject: 'new subject 2',
        html: 'new html 2',
      },
    ])

    expect(transaction.set).toHaveBeenCalledWith(
      FirebaseMock.mockDoc('mail-templates', 'templateId'),
      {
        subject: 'new subject',
        html: 'new html',
      },
    )
    expect(transaction.set).toHaveBeenCalledWith(
      FirebaseMock.mockDoc('mail-templates', 'templateId2'),
      {
        subject: 'new subject 2',
        html: 'new html 2',
      },
    )
  })
})
