import { doc, Firestore, runTransaction } from 'firebase/firestore'
import { Request, Response } from 'express'
import Notion from '../data/notionAdapter'
import Week from '../models/week'

export default class CacheController {
  firestore: Firestore
  notion: Notion

  constructor (firestore: Firestore, notion: Notion) {
    this.firestore = firestore
    this.notion = notion
  }

  async cache (_req: Request, res: Response): Promise<void> {
    const weeks = await this.notion.getWeeks()

    await runTransaction(this.firestore, async (transaction) => {
      weeks.forEach((week: Week) => {
        const ref = doc(this.firestore, 'weeks', week.dateString)
        transaction.set(ref, week.toFirebaseDTO())
      })
    })

    res.sendStatus(200)
  }
}
