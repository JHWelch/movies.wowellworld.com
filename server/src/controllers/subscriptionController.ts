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

    const user = await this.firestore.getUser(req.body.email)

    if (user?.reminders) {
      res.status(409).json({
        errors: { email: 'Already subscribed' },
        message: "You're already subscribed! Check your spam folder if you don't get the emails.",
      })

      return
    }

    this.firestore.createUser(req.body.email, true)

    res.status(200)
  }

  private validate = (req: Request, res: Response): boolean =>
    validate(req, res, z.object({
      email: z.string().email(),
    }))
}
