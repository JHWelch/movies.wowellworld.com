import { type Request, type Response } from 'express'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { icalGenerator } from '@server/data/icalGenerator'

export default class WeekEventController {
  static PATHS = {
    show: '/weeks/:weekId/event',
  }

  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  show = async (req: Request, res: Response): Promise<void> => {
    const { weekId } = req.params

    const week = await this.firestore.getWeek(weekId)

    if (!week) {
      res.status(404).json({ message: `Week ${weekId} not found` })

      return
    }

    res.type('text/calendar').send(icalGenerator(week))
  }
}
