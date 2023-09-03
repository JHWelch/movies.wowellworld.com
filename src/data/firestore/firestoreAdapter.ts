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
import Config from '../../config/config.js'

export default class FirestoreAdapter {
  static readonly MAIL_COLLECTION_NAME = 'mail'
  static readonly RSVPS_COLLECTION_NAME = 'rsvps'
  static readonly TEMPLATES_COLLECTION_NAME = 'templates'
  static readonly WEEKS_COLLECTION_NAME = 'weeks'

  private config: Config
  private firestore: FirestoreType

  constructor (config: Config) {
    this.config = config
    this.firestore = setupFirestore(config)
  }

  async cacheWeeks (weeks: Week[]): Promise<void> {
    await runTransaction(this.firestore, async (transaction) => {
      weeks.forEach((week: Week) => {
        const ref = doc(
          this.firestore,
          FirestoreAdapter.WEEKS_COLLECTION_NAME,
          week.dateString
        )
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

  async sendEmailTemplate (
    to: string,
    templateName: string,
    templateData: Record<string, unknown>,
  ): Promise<void> {
    await addDoc(this.mailCollection, {
      to,
      template: {
        name: templateName,
        data: templateData,
      },
    })
  }

  async updateTemplates (templates: {
    name: string,
    subject: string,
    html: string,
  }[]): Promise<void> {
    await runTransaction(this.#firestore, async (transaction) => {
      templates.forEach((template: {
        name: string,
        subject: string,
        html: string,
      }) => {
        transaction.set(doc(
          this.#firestore,
          FirestoreAdapter.TEMPLATES_COLLECTION_NAME,
          template.name
        ), {
          subject: template.subject,
          html: template.html,
        })
      })
    })
  }

  today (): Timestamp {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Timestamp.fromDate(today)
  }

  get adminEmail (): string {
    return this.config.adminEmail
  }

  private get mailCollection (): Collection {
    return collection(this.firestore, FirestoreAdapter.MAIL_COLLECTION_NAME)
  }

  private get rsvpCollection (): Collection {
    return collection(this.firestore, FirestoreAdapter.RSVPS_COLLECTION_NAME)
  }

  private get weekCollection (): Collection {
    return collection(this.firestore, FirestoreAdapter.WEEKS_COLLECTION_NAME)
  }
}

export type EmailMessage = {
  subject: string,
  text: string,
  html: string,
}

type Collection = CollectionReference<DocumentData,DocumentData>
