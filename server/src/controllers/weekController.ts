import { type Request, type Response } from 'express'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'

export default class WeekController {
  constructor (
    protected firestore: FirestoreAdapter,
  ) {}

  index = async (req: Request, res: Response): Promise<void> => {
    const { past, limit } = this.parseIndexQuery(req)

    const weeks = past
      ? await this.firestore.getPastWeeks()
      : await this.firestore.getUpcomingWeeks({ limit })

    res.json(weeks.map((week) => week.toDTO()))
  }

  parseIndexQuery = (req: Request): {
    past: boolean,
    limit?: number,
  } =>
    ({
      past: req.query.past === 'true',
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    })
}
