import {
  collection,
  doc,
  Firestore as FirestoreType,
  getDocs,
  orderBy,
  query,
  QueryFieldFilterConstraint,
  QueryConstraint,
  runTransaction,
  Timestamp,
  where,
} from 'firebase/firestore'
import Week from '../models/week.js'
import setupFirestore from '../config/firestore.js'

export default class FirestoreAdapter {
  static readonly COLLECTION_NAME = 'weeks'
  #firestore: FirestoreType

  constructor () {
    this.#firestore = setupFirestore()
  }

  async cacheWeeks(weeks: Week[]): Promise<void> {
    await runTransaction(this.#firestore, async (transaction) => {
      weeks.forEach((week: Week) => {
        const ref = doc(this.#firestore, 'weeks', week.dateString)
        transaction.set(ref, week.toFirebaseDTO())
      })
    })
  }

  async getPastWeeks(): Promise<Week[]> {
    return this.getWeeks(where('date', '<', this.today()), orderBy('date', 'desc'))
  }

  async getUpcomingWeeks(): Promise<Week[]> {
    return this.getWeeks(where('date', '>=', this.today()), orderBy('date'))
  }

  async getWeeks(where: QueryFieldFilterConstraint, constraint: QueryConstraint): Promise<Week[]> {
    const weeks = collection(this.#firestore, FirestoreAdapter.COLLECTION_NAME)
    const q = query(weeks, where, constraint)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs
      .map((doc) => Week.fromFirebase(doc.data()))
  }

  today(): Timestamp {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Timestamp.fromDate(today)
  }
}
