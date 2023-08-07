import { Request, Response } from 'express'
import Notion from '../data/notionAdapter'
import FirestoreAdapter from '../data/firestoreAdapter'

export default class CacheController {
  firestore: FirestoreAdapter
  notion: Notion

  constructor (firestore: FirestoreAdapter, notion: Notion) {
    this.firestore = firestore
    this.notion = notion
  }

  async cache (_req: Request, res: Response): Promise<void> {
    const weeks = await this.notion.getWeeks()

    this.firestore.cacheWeeks(weeks)

    res.sendStatus(200)
  }
}
