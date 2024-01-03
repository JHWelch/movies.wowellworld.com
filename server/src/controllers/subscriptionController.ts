import { type Request, type Response } from 'express'

export default class SubscriptionController {
  static PATHS = {
    store: '/api/subscriptions',
  }

  static async store (_req: Request, res: Response): Promise<void> {
    res.status(200).send('ok')
  }
}
