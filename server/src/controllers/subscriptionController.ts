import { type Request, type Response } from 'express'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { z } from 'zod'
import { validate } from '@server/helpers/validation'
import { withMessage } from '@server/helpers/messageBuilder'

export default class SubscriptionController {
  static readonly SUCCESS_MESSAGE = {
    message: 'Thank you for signing up! See you soon.',
  }

  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  store = async (req: Request, res: Response): Promise<void> => {
    if (!this.validate(req, res)) return

    const user = await this.firestore.getUserByEmail(req.body.email)

    if (!user) {
      await this.firestore.createUser(req.body.email, true)
      res.status(201).json(SubscriptionController.SUCCESS_MESSAGE)

      return
    }

    if (user.reminders) {
      res.status(409).json({
        errors: { email: 'Already subscribed' },
        message: "You're already subscribed! Check your spam folder if you don't get the emails.",
      })

      return
    }

    user.reminders = true
    await this.firestore.updateUser(user)
    res.status(200).json(SubscriptionController.SUCCESS_MESSAGE)

    return
  }

  destroy = async (req: Request, res: Response): Promise<void> => {
    if (!req.query.token) {
      res.redirect('/')

      return
    }

    this.firestore.deleteUser(req.query.token.toString())
    res.redirect(withMessage('/', "You've been unsubscribed from the reminder emails."))
  }

  private validate = (req: Request, res: Response): boolean =>
    validate(req, res, z.object({
      email: z.string().email(),
    }))
}
