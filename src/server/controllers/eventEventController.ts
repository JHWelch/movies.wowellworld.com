import { type Request, type Response } from 'express'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { icalGenerator } from '@server/data/icalGenerator'

export default class EventEventController {
  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  show = async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.params
    const id = Array.isArray(eventId) ? eventId[0] : eventId

    const event = await this.firestore.getEvent(id)

    if (!event) {
      res.status(404).json({ message: `Event ${id} not found` })

      return
    }

    res.type('text/calendar').send(await icalGenerator(event))
  }
}
