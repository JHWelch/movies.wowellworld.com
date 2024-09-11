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
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import {
  Timestamp,
  addDoc,
  deleteDoc,
  getFirestore,
  query,
  setDoc,
} from 'firebase/firestore'
import { transaction } from '@mocks/firebase/firestore'
import { FirebaseMock } from '@tests/support/firebaseMock'
import { Week } from '@server/models/week'
import { mockConfig } from '@tests/support/mockConfig'
import MovieFactory from '@tests/support/factories/movieFactory'
import User from '@server/models/user'
import { RichText } from '@shared/dtos'

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
  const styled: RichText[] = [
    {
      type: 'text',
      text: {
        content: 'week',
        link: null,
      },
      annotations: {
        bold: true,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default',
      },
      plain_text: 'week',
      href: null,
    },
    {
      type: 'text',
      text: {
        content: 'id 3',
        link: null,
      },
      annotations: {
        bold: false,
        italic: true,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'red',
      },
      plain_text: 'id 3',
      href: null,
    },
  ]

  beforeEach(() => {
    FirebaseMock.mockWeeks([
      {
        date: new Date('2021-01-01'),
        id: 'id1',
        isSkipped: false,
        theme: 'theme1',
        slug: null,
        styledTheme: [],
      }, {
        date: new Date('2021-01-08'),
        id: 'id2',
        isSkipped: true,
        theme: 'theme2',
        slug: null,
        styledTheme: [],
      }, {
        date: new Date('2021-01-15'),
        id: 'id3',
        isSkipped: false,
        theme: 'theme3',
        slug: 'slug',
        styledTheme: styled,
      },
    ])
  })

  it('should return all future weeks', async () => {
    const weeks = await firestore.getUpcomingWeeks()

    expect(weeks).toEqual([
      new Week({
        id: 'id1',
        theme: 'theme1',
        date: new Date('2021-01-01') }),
      new Week({
        id: 'id2',
        theme: 'theme2',
        date: new Date('2021-01-08'),
        isSkipped: true,
      }),
      new Week({
        id: 'id3',
        theme: 'theme3',
        date: new Date('2021-01-15'),
        slug: 'slug',
        styledTheme: styled,
      }),
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
        slug: null,
      }, {
        date: new Date('2021-01-08'),
        id: 'id2',
        isSkipped: false,
        theme: 'theme2',
        slug: null,
      }, {
        date: new Date('2021-01-15'),
        id: 'id3',
        isSkipped: false,
        theme: 'theme3',
        slug: null,
      },
    ])
  })

  it ('should return only past weeks', async () => {
    const weeks = await firestore.getPastWeeks()

    expect(weeks).toEqual([
      new Week({ id: 'id1', theme: 'theme1',date:  new Date('2021-01-01') }),
      new Week({ id: 'id2', theme: 'theme2',date:  new Date('2021-01-08') }),
      new Week({ id: 'id3', theme: 'theme3',date:  new Date('2021-01-15') }),
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
        slug: null,
      })
    })

    it('returns the week', async () => {
      const week = await firestore.getWeek('2021-01-01')

      expect(week).toEqual(
        new Week({ id: 'id1', theme: 'theme1', date: new Date('2021-01-01') }),
      )
    })
  })

  describe('when the week does not exist', () => {
    beforeEach(() => {
      FirebaseMock.mockGetWeek()
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
        new Week({ id: 'id1', theme: 'theme1', date: new Date('2021-01-01') }),
        new Week({ id: 'id2', theme: 'theme2', date: new Date('2021-01-08') }),
        new Week({ id: 'id3', theme: 'theme3', date: new Date('2021-01-15') }),
      ])

      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-01'),
          FirebaseMock.mockWeek({
            id: 'id1',
            theme: 'theme1',
            date: '2021-01-01',
          }),
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-08'),
          FirebaseMock.mockWeek({
            id: 'id2',
            theme: 'theme2',
            date: '2021-01-08',
          }),
        )
      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks', '2021-01-15'),
          FirebaseMock.mockWeek({
            id: 'id3',
            theme: 'theme3',
            date: '2021-01-15',
          }),
        )
    })
  })

  it('can update a week with movies', async () => {
    const movie = new MovieFactory().make()
    const weekWithMovie = new Week({
      id: 'id1',
      theme: 'theme1',
      date: new Date('2021-01-01'),
      movies: [movie],
    })

    await firestore.cacheWeeks([
      weekWithMovie,
    ])

    expect(transaction.set)
      .toHaveBeenCalledWith(
        FirebaseMock.mockDoc('weeks', '2021-01-01'),
        FirebaseMock.mockWeek({
          id: 'id1',
          theme: 'theme1',
          date: '2021-01-01',
          movies: [movie],
        }),
      )
  })

  describe('when mode is development', () => {
    it('uses the development collection', async () => {
      firestore = new FirestoreAdapter(mockConfig({ nodeEnv: 'development' }))

      await firestore.cacheWeeks([
        new Week({ id: 'id1', theme: 'theme1', date: new Date('2021-01-01') }),
      ])

      expect(transaction.set)
        .toHaveBeenCalledWith(
          FirebaseMock.mockDoc('weeks-dev', '2021-01-01'),
          FirebaseMock.mockWeek({
            id: 'id1',
            theme: 'theme1',
            date: '2021-01-01',
          }),
        )
    })
  })
})

describe('createUser', () => {
  it('creates a user in firestore', async () => {
    await firestore.createUser(
      'test@example.com',
      true,
    )

    expect(addDoc).toHaveBeenCalledWith(
      FirebaseMock.mockCollection('users'),
      {
        email: 'test@example.com',
        reminders: true,
      },
    )
  })
})

describe('getUserByEmail', () => {
  describe('when the user exists', () => {
    beforeEach(() => {
      FirebaseMock.mockGetUserByEmail({
        id: 'id1',
        email: 'test@example.com',
        reminders: true,
      })
    })

    it('returns the user', async () => {
      const user = await firestore.getUserByEmail('test@example.com')

      expect(user).toMatchObject({
        id: 'id1',
        email: 'test@example.com',
        reminders: true,
      })
    })
  })

  describe('when the user does not exist', () => {
    beforeEach(() => {
      FirebaseMock.mockGetUserByEmail()
    })

    it('returns null', async () => {
      expect(await firestore.getUserByEmail('test@example.com')).toBeNull()
    })
  })
})

describe('getUsersWithReminders', () => {
  describe('there are users with reminders', () => {
    beforeEach(() => {
      FirebaseMock.mockGetUsers([
        {
          id: 'id1',
          email: 'user_with_reminder1@example.com',
          reminders: true,
        }, {
          id: 'id2',
          email: 'user_with_reminder2@example.com',
          reminders: true,
        },
      ])
    })

    it('should query for users with reminders', async () => {
      await firestore.getUsersWithReminders()

      expect(query).toHaveBeenCalledWith(
        { firestore: { firestore: 'firestore' }, collectionPath: 'users' },
        { fieldPath: 'reminders', opStr: '==', value: true },
      )
    })

    it('returns those users', async () => {
      const users = await firestore.getUsersWithReminders()

      expect(users).toMatchObject([
        {
          id: 'id1',
          email: 'user_with_reminder1@example.com',
          reminders: true,
        }, {
          id: 'id2',
          email: 'user_with_reminder2@example.com',
          reminders: true,
        },
      ])
    })
  })

  describe('there are no users with reminders', () => {
    beforeEach(() => {
      FirebaseMock.mockGetUsers([])
    })

    it('returns an empty array', async () => {
      const users = await firestore.getUsersWithReminders()

      expect(users).toEqual([])
    })
  })
})

describe('updateUser', () => {
  it('updates a user in firestore', async () => {
    await firestore.updateUser(new User('id', 'test@example.com', true))

    expect(setDoc).toHaveBeenCalledWith(
      FirebaseMock.mockDoc('users', 'id'),
      {
        email: 'test@example.com',
        reminders: true,
      },
    )
  })
})

describe('deleteUser', () => {
  it('deletes a user in firestore', async () => {
    await firestore.deleteUser('id')

    expect(deleteDoc).toHaveBeenCalledWith(
      FirebaseMock.mockDoc('users', 'id'),
    )
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

describe('sendEmailTemplates', () => {
  it('sends an email', async () => {
    await firestore.sendEmailTemplates(
      'reminder',
      [
        {
          to: 'user1@example.com',
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
        }, {
          to: 'user2@example.com',
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
      ],
    )

    expect(transaction.set).toHaveBeenCalledWith(
      FirebaseMock.mockDoc('mail', expect.anything()),
      {
        to: 'user1@example.com',
        template: {
          name: 'reminder',
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

    expect(transaction.set).toHaveBeenCalledWith(
      FirebaseMock.mockDoc('mail', expect.anything()),
      {
        to: 'user2@example.com',
        template: {
          name: 'reminder',
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
