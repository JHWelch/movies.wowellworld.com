import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestore/firestoreAdapter'
import { z } from 'zod'
import { validate } from '../helpers/validation.js'

export default class SubscriptionController {
  static PATHS = {
    store: '/api/subscriptions',
  }

  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  store = async (req: Request, res: Response): Promise<void> => {
    if (!this.validate(req, res)) return

    this.firestore.createUser(req.body.email, true)

    res.status(200).send('ok')
  }

  private validate = (req: Request, res: Response): boolean =>
    validate(req, res, z.object({
      email: z.string().email(),
    }))
}
