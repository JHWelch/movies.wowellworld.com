import {
  addDoc,
  and,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  Firestore as FirestoreType,
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
  static readonly WEEKS_COLLECTION_NAME = 'weeks'
  static readonly RSVPS_COLLECTION_NAME = 'rsvps'

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
      this.collection,
      and(
        where('date', '<', this.today()),
        where('isSkipped', '==', false),
      ),
      orderBy('date', 'desc')
    ))
  }

  async getUpcomingWeeks (): Promise<Week[]> {
    return this.getWeeks(query(
      this.collection,
      where('date', '>=', this.today()),
      orderBy('date')
    ))
  }

  async getWeeks (firestoreQuery: Query): Promise<Week[]> {
    const querySnapshot = await getDocs(firestoreQuery)

    return querySnapshot.docs
      .map((doc) => Week.fromFirebase(doc.data()))
  }

  async createRsvp (
    week: string,
    name: string,
    email: string,
    plusOne: boolean,
  ): Promise<void> {
    const rsvps = collection(
      this.#firestore,
      FirestoreAdapter.RSVPS_COLLECTION_NAME,
    )

    await addDoc(rsvps, {
      week,
      name,
      email,
      plusOne,
    })
  }

  today (): Timestamp {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Timestamp.fromDate(today)
  }

  private get collection (): CollectionReference<DocumentData, DocumentData> {
    return collection(this.#firestore, FirestoreAdapter.WEEKS_COLLECTION_NAME)
  }
}
