import {
  addDoc,
  and,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  Firestore as FirestoreType,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Primitive,
  query,
  Query,
  runTransaction,
  setDoc,
  Timestamp,
  where,
  WithFieldValue,
} from 'firebase/firestore'
import { Event } from '@server/models/event'
import setupFirestore from '@server/config/firestore'
import Config from '@server/config/config'
import User from '@server/models/user'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { CHICAGO } from '@server/config/tz'

export default class FirestoreAdapter {
  static readonly globalsCollectionName = 'globals'
  static readonly mailCollectionName = 'mail'
  static readonly rsvpsCollectionName = 'rsvps'
  static readonly templatesCollectionName = 'mail-templates'
  static readonly usersCollectionName = 'users'
  static readonly eventsCollectionName = 'events'

  private config: Config
  private firestore: FirestoreType

  constructor (config: Config) {
    this.config = config
    this.firestore = setupFirestore(config)
  }

  getGlobal = async <AppDataType>(
    key: string
  ): Promise<Primitive|Timestamp|WithFieldValue<AppDataType>|null> => {
    const document = await getDoc(doc(
      this.firestore,
      FirestoreAdapter.globalsCollectionName,
      key,
    ))

    if (!document.exists()) {
      return null
    }

    return document.data().value
  }

  setGlobal = async <AppDataType>(
    key: string,
    value: Primitive|Timestamp|WithFieldValue<AppDataType>,
  ): Promise<void> => {
    setDoc(doc(
      this.firestore,
      FirestoreAdapter.globalsCollectionName,
      key,
    ), { value })
  }

  cacheEvents = async (events: Event[]): Promise<void> => {
    await runTransaction(this.firestore, async (transaction) => {
      events.forEach((event: Event) => {
        const ref = doc(
          this.firestore,
          FirestoreAdapter.eventsCollectionName,
          event.dateString,
        )
        transaction.set(ref, event.toFirebaseDTO())
      })
    })
  }

  getPastEvents = async (): Promise<Event[]> => {
    return this.getEvents(query(
      this.eventCollection,
      and(
        where('date', '<', this.today()),
        where('isSkipped', '==', false),
      ),
      orderBy('date', 'desc'),
    ))
  }

  getUpcomingEvents = async (args: {
    limit?: number
  } = {}): Promise<Event[]> => {
    return this.getEvents(query(
      this.eventCollection,
      where('date', '>=', this.today()),
      orderBy('date'),
      ...(args.limit ? [limit(args.limit)] : []),
    ))
  }

  getEvents = async (firestoreQuery: Query): Promise<Event[]> => {
    const querySnapshot = await getDocs(firestoreQuery)

    return querySnapshot.docs
      .map((doc) => Event.fromFirebase(doc.data()))
  }

  getEvent = async (dateString: string): Promise<Event|null> => {
    const document = await getDoc(doc(this.eventCollection, dateString))

    if (!document.exists()) {
      return null
    }

    return Event.fromFirebase(document.data())
  }

  createRsvp = async (
    event: string,
    name: string,
    email: string | undefined,
  ): Promise<void> => {
    await addDoc(this.rsvpCollection, {
      event,
      name,
      createdAt: Timestamp.now(),
      email: email || null,
    })
  }

  createUser = async (email: string, reminders: boolean): Promise<void> => {
    await addDoc(this.usersCollection, {
      email,
      reminders,
    })
  }

  getUserByEmail = async (email: string): Promise<User|null> => {
    const users = await getDocs(query(
      this.usersCollection,
      where('email', '==', email),
      limit(1),
    ))

    if (users.docs.length === 0) {
      return null
    }

    return User.fromFirebase(users.docs[0])
  }

  getUsersWithReminders = async (): Promise<User[]> => {
    const users = await getDocs(query(
      this.usersCollection,
      where('reminders', '==', true),
    ))

    return users.docs.map(User.fromFirebase)
  }

  updateUser = async (user: User): Promise<void> => {
    setDoc(doc(
      this.firestore,
      FirestoreAdapter.usersCollectionName,
      user.id,
    ), user.toFirebaseDTO())
  }

  deleteUser = async (id: string): Promise<void> => {
    await deleteDoc(doc(
      this.firestore,
      FirestoreAdapter.usersCollectionName,
      id,
    ))
  }

  sendEmail = async (to: string, message: EmailMessage): Promise<void> => {
    await addDoc(this.mailCollection, {
      to,
      message,
    })
  }

  sendEmailTemplate = async (
    to: string,
    templateName: string,
    templateData: Record<string, unknown>,
  ): Promise<void> => {
    await addDoc(this.mailCollection, {
      to,
      template: {
        name: templateName,
        data: templateData,
      },
    })
  }

  sendEmailTemplates = async (
    templateName: string,
    emails: {
      to: string
      data: Record<string, unknown>
    }[],
  ): Promise<void> => {
    await runTransaction(this.firestore, async (transaction) => {
      emails.forEach((email) => {
        const ref = doc(
          this.firestore,
          FirestoreAdapter.mailCollectionName,
          randomUUID(),
        )

        transaction.set(ref, {
          to: email.to,
          template: {
            name: templateName,
            data: email.data,
          },
        })
      })
    })
  }
  updateTemplates = async (templates: {
    name: string
    data: Record<string, unknown>
  }[]): Promise<void> => {
    await runTransaction(this.firestore, async (transaction) => {
      templates.forEach((template) => {
        transaction.set(doc(
          this.firestore,
          FirestoreAdapter.templatesCollectionName,
          template.name,
        ), template.data)
      })
    })
  }

  today = (): Timestamp => {
    return Timestamp.fromDate(
      DateTime.now().setZone(CHICAGO).startOf('day').toJSDate()
    )
  }

  get adminEmail (): string {
    return this.config.adminEmail
  }

  private get mailCollection (): Collection {
    return collection(this.firestore, FirestoreAdapter.mailCollectionName)
  }

  private get rsvpCollection (): Collection {
    return collection(this.firestore, FirestoreAdapter.rsvpsCollectionName)
  }

  private get usersCollection (): Collection {
    return collection(this.firestore, FirestoreAdapter.usersCollectionName)
  }

  private get eventCollection (): Collection {
    return collection(this.firestore, FirestoreAdapter.eventsCollectionName)
  }
}

export type EmailMessage = {
  subject: string
  text: string
  html: string
}

type Collection = CollectionReference<DocumentData,DocumentData>
