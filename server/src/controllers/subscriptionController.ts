import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestore/firestoreAdapter'

export default class SubscriptionController {
  static PATHS = {
    store: '/api/subscriptions',
  }

  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  store = async (req: Request, res: Response): Promise<void> => {
    this.firestore.createUser(req.body.email, true)

    res.status(200).send('ok')
  }
}
