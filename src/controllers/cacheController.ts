import { doc, getFirestore, Firestore, runTransaction } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'
import { Request, Response } from 'express'
import Notion from '../data/notion'
import Week from '../models/week'

export default class CacheController {
  notion: Notion

  db: Firestore

  constructor (notion: Notion) {
    this.notion = notion

    const firebaseConfig = {
      credential: applicationDefault(),
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
    }

    const app = initializeApp(firebaseConfig)

    this.db = getFirestore(app)
  }

  async cache (_req: Request, res: Response): Promise<void> {
    const weeks = await this.notion.getUpcomingWeeks()

    await runTransaction(this.db, async (transaction) => {
      weeks.forEach((week: Week) => {
        const ref = doc(this.db, 'weeks', week.date.toDateString())
        transaction.set(ref, week.toDTO())
      })
    })

    res.sendStatus(200)
  }
}
