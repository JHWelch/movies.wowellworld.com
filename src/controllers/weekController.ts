import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestoreAdapter.js'

export default class WeekController {
  firestore: FirestoreAdapter

  constructor (firestore: FirestoreAdapter) {
    this.firestore = firestore
  }

  async index (req: Request, res: Response): Promise<void> {
    const { past } = this.parseIndexQuery(req)

    const weeks = past
      ? await this.firestore.getPastWeeks()
      : await this.firestore.getUpcomingWeeks()

    res.json(weeks.map((week) => week.toDTO()))
  }

  parseIndexQuery(req: Request): { past: boolean } {
    return { past: req.query.past === 'true' }
  }

  // async show (req: Request, res: Response): Promise<void> {
  //   const week = await this.getWeek(req.params.date)

  //   if (week == null) {
  //     res.status(404).json({ error: 'Week not found' })
  //     return
  //   }

  //   res.json(week.toDTO())
  // }
}
