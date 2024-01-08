import {
  addDoc,
  and,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  Firestore as FirestoreType,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Query,
  runTransaction,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import Week from '../../models/week.js'
import setupFirestore from '../../config/firestore.js'
import Config from '../../config/config.js'
import User from '../../models/user.js'
import { randomUUID } from 'crypto'

export default class FirestoreAdapter {
  static readonly MAIL_COLLECTION_NAME = 'mail'
  static readonly RSVPS_COLLECTION_NAME = 'rsvps'
  static readonly TEMPLATES_COLLECTION_NAME = 'mail-templates'
  static readonly USERS_COLLECTION_NAME = 'users'
  static readonly WEEKS_COLLECTION_NAME = 'weeks'

  private config: Config
  private firestore: FirestoreType

  constructor (config: Config) {
    this.config = config
    this.firestore = setupFirestore(config)
  }

  cacheWeeks = async (weeks: Week[]): Promise<void> => {
    await runTransaction(this.firestore, async (transaction) => {
      weeks.forEach((week: Week) => {
        const ref = doc(
          this.firestore,
          this.weeksCollectionName,
          week.dateString,
        )
        transaction.set(ref, week.toFirebaseDTO())
      })
    })
  }

  getPastWeeks = async (): Promise<Week[]> => {
    return this.getWeeks(query(
      this.weekCollection,
      and(
        where('date', '<', this.today()),
        where('isSkipped', '==', false),
      ),
      orderBy('date', 'desc'),
    ))
  }

  getUpcomingWeeks = async (): Promise<Week[]> => {
    return this.getWeeks(query(
      this.weekCollection,
      where('date', '>=', this.today()),
      orderBy('date'),
    ))
  }

  getWeeks = async (firestoreQuery: Query): Promise<Week[]> => {
    const querySnapshot = await getDocs(firestoreQuery)

    return querySnapshot.docs
      .map((doc) => Week.fromFirebase(doc.data()))
  }

  getWeek = async (dateString: string): Promise<Week|null> => {
    const document = await getDoc(doc(this.weekCollection, dateString))

    if (!document.exists()) {
      return null
    }

    return Week.fromFirebase(document.data())
  }

  createRsvp = async (
    week: string,
    name: string,
    email: string,
    plusOne: boolean,
  ): Promise<void> => {
    await addDoc(this.rsvpCollection, {
      week,
      name,
      email,
      plusOne,
      createdAt: Timestamp.now(),
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
      this.usersCollectionName,
      user.id,
    ), user.toFirebaseDTO())
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
      to: string,
      data: Record<string, unknown>,
    }[],
  ): Promise<void> => {
    await runTransaction(this.firestore, async (transaction) => {
      emails.forEach((email) => {
        const ref = doc(
          this.firestore,
          this.mailCollectionName,
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
    name: string,
    subject: string,
    html: string,
  }[]): Promise<void> => {
    await runTransaction(this.firestore, async (transaction) => {
      templates.forEach((template: {
        name: string,
        subject: string,
        html: string,
      }) => {
        transaction.set(doc(
          this.firestore,
          this.templatesCollectionName,
          template.name,
        ), {
          subject: template.subject,
          html: template.html,
        })
      })
    })
  }

  today = (): Timestamp => {
    const today = new Date()
    const todayUtc = new Date(Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ))

    return Timestamp.fromDate(todayUtc)
  }

  get adminEmail (): string {
    return this.config.adminEmail
  }

  private get mailCollectionName (): string {
    return this.collectionName(FirestoreAdapter.MAIL_COLLECTION_NAME)
  }

  private get rsvpsCollectionName (): string {
    return this.collectionName(FirestoreAdapter.RSVPS_COLLECTION_NAME)
  }

  private get templatesCollectionName (): string {
    return this.collectionName(FirestoreAdapter.TEMPLATES_COLLECTION_NAME)
  }

  private get usersCollectionName (): string {
    return this.collectionName(FirestoreAdapter.USERS_COLLECTION_NAME)
  }

  private get weeksCollectionName (): string {
    return this.collectionName(FirestoreAdapter.WEEKS_COLLECTION_NAME)
  }

  private get mailCollection (): Collection {
    return collection(this.firestore, this.mailCollectionName)
  }

  private get rsvpCollection (): Collection {
    return collection(this.firestore, this.rsvpsCollectionName)
  }

  private get usersCollection (): Collection {
    return collection(this.firestore, this.usersCollectionName)
  }

  private get weekCollection (): Collection {
    return collection(this.firestore, this.weeksCollectionName)
  }

  private collectionName (name: string): string {
    return this.config.isProduction ? name : `${name}-dev`
  }
}

export type EmailMessage = {
  subject: string,
  text: string,
  html: string,
}

type Collection = CollectionReference<DocumentData,DocumentData>
