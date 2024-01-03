import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestore/firestoreAdapter.js'

export default class WeekController {
  constructor (
    public firestore: FirestoreAdapter,
  ) {}

  index = async (req: Request, res: Response): Promise<void> => {
    const { past } = this.parseIndexQuery(req)

    const weeks = past
      ? await this.firestore.getPastWeeks()
      : await this.firestore.getUpcomingWeeks()

    res.json(weeks.map((week) => week.toDTO()))
  }

  parseIndexQuery = (req: Request): { past: boolean } =>
    ({ past: req.query.past === 'true' })
}
