import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestore/firestoreAdapter'

class RsvpController {
  static PATHS = {
    index: '/week/:weekId/rsvp',
  }

  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  async store (req: Request, res: Response): Promise<void> {
    const { weekId } = req.params
    const { name, email, plusOne } = req.body

    await this.firestore.createRsvp(weekId, name, email, plusOne)

    res.status(201).json({ message: 'successfully RSVP\'d' })
  }
}

export default RsvpController
