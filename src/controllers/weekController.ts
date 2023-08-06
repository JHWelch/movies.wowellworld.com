import { type Request, type Response } from 'express'
import {
  collection,
  Firestore,
  getDocs,
  query,
  QueryFieldFilterConstraint,
  Timestamp,
  where,
} from 'firebase/firestore'
import Week from '../models/week.js'

export default class WeekController {
  firestore: Firestore

  constructor (firestore: Firestore) {
    this.firestore = firestore
  }

  async index (req: Request, res: Response): Promise<void> {
    const { past } = this.parseIndexQuery(req)

    const weeks = past
      ? await this.getPastWeeks()
      : await this.getUpcomingWeeks()

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

  async getPastWeeks(): Promise<Week[]> {
    return this.getWeeks(where('date', '<', Timestamp.now()))
  }

  async getUpcomingWeeks(): Promise<Week[]> {
    return this.getWeeks(where('date', '>=', Timestamp.now()))
  }

  async getWeeks(where: QueryFieldFilterConstraint): Promise<Week[]> {
    const weeks = collection(this.firestore, 'weeks')
    const q = query(weeks, where)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs
      .map((doc) => Week.fromFirebase(doc.data()))
  }
}
