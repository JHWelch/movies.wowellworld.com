import { DocumentData } from 'firebase/firestore'

export default class User {
  constructor (
    public id: string,
    public email: string,
    public reminders: boolean,
  ) {}

  static fromFirebase = (record: DocumentData): User => new User(
    record.id,
    record.email,
    record.reminders,
  )
}
