import { doc, Firestore, runTransaction } from 'firebase/firestore'
import { Request, Response } from 'express'
import Notion from '../data/notion'
import Week from '../models/week'

export default class CacheController {
  notion: Notion

  firestore: Firestore

  constructor (notion: Notion, firestore: Firestore) {
    this.notion = notion
    this.firestore = firestore
  }

  async cache (_req: Request, res: Response): Promise<void> {
    const weeks = await this.notion.getWeeks()

    await runTransaction(this.firestore, async (transaction) => {
      weeks.forEach((week: Week) => {
        const ref = doc(this.firestore, 'weeks', week.dateString)
        transaction.set(ref, week.toDTO())
      })
    })

    res.sendStatus(200)
  }
}
