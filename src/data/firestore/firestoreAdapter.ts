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
  orderBy,
  query,
  Query,
  runTransaction,
  Timestamp,
  where,
} from 'firebase/firestore'
import Week from '../../models/week.js'
import setupFirestore from '../../config/firestore.js'

export default class FirestoreAdapter {
  static readonly MAIL_COLLECTION_NAME = 'mail'
  static readonly RSVPS_COLLECTION_NAME = 'rsvps'
  static readonly WEEKS_COLLECTION_NAME = 'weeks'

  #firestore: FirestoreType

  constructor () {
    this.#firestore = setupFirestore()
  }

  async cacheWeeks (weeks: Week[]): Promise<void> {
    await runTransaction(this.#firestore, async (transaction) => {
      weeks.forEach((week: Week) => {
        const ref = doc(this.#firestore, 'weeks', week.dateString)
        transaction.set(ref, week.toFirebaseDTO())
      })
    })
  }

  async getPastWeeks (): Promise<Week[]> {
    return this.getWeeks(query(
      this.weekCollection,
      and(
        where('date', '<', this.today()),
        where('isSkipped', '==', false),
      ),
      orderBy('date', 'desc')
    ))
  }

  async getUpcomingWeeks (): Promise<Week[]> {
    return this.getWeeks(query(
      this.weekCollection,
      where('date', '>=', this.today()),
      orderBy('date')
    ))
  }

  async getWeeks (firestoreQuery: Query): Promise<Week[]> {
    const querySnapshot = await getDocs(firestoreQuery)

    return querySnapshot.docs
      .map((doc) => Week.fromFirebase(doc.data()))
  }

  async getWeek (dateString: string): Promise<Week|null> {
    const document = await getDoc(doc(this.weekCollection, dateString))

    if (!document.exists()) {
      return null
    }

    return Week.fromFirebase(document.data())
  }

  async createRsvp (
    week: string,
    name: string,
    email: string,
    plusOne: boolean,
  ): Promise<void> {
    await addDoc(this.rsvpCollection, {
      week,
      name,
      email,
      plusOne,
      createdAt: Timestamp.now(),
    })
  }

  async sendEmail (to: string, message: EmailMessage): Promise<void> {
    await addDoc(this.mailCollection, {
      to,
      message,
    })
  }

  today (): Timestamp {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Timestamp.fromDate(today)
  }

  private get mailCollection (): Collection {
    return collection(this.#firestore, FirestoreAdapter.MAIL_COLLECTION_NAME)
  }

  private get rsvpCollection (): Collection {
    return collection(this.#firestore, FirestoreAdapter.RSVPS_COLLECTION_NAME)
  }

  private get weekCollection (): Collection {
    return collection(this.#firestore, FirestoreAdapter.WEEKS_COLLECTION_NAME)
  }
}

export type EmailMessage = {
  subject: string,
  text: string,
  html: string,
}

type Collection = CollectionReference<DocumentData,DocumentData>
