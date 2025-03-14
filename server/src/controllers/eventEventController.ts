import { type Request, type Response } from 'express'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { icalGenerator } from '@server/data/icalGenerator'

export default class EventEventController {
  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  show = async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.params

    const event = await this.firestore.getEvent(eventId)

    if (!event) {
      res.status(404).json({ message: `Event ${eventId} not found` })

      return
    }

    res.type('text/calendar').send(await icalGenerator(event))
  }
}
