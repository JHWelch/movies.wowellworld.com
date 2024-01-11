import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import SubscriptionController from '../controllers/subscriptionController.js'

export default class User {
  constructor (
    public id: string,
    public email: string,
    public reminders: boolean = true,
  ) {}

  static fromFirebase = (
    record: QueryDocumentSnapshot<DocumentData, DocumentData>,
  ): User => new User(
    record.id,
    record.data().email,
    record.data().reminders,
  )

  toFirebaseDTO = (): DocumentData => ({
    email: this.email,
    reminders: this.reminders,
  })

  unsubscribeUrl = (): string =>
    SubscriptionController.PATHS.destroy + `?token=${this.id}`
}
