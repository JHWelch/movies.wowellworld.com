import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestore/firestoreAdapter'
import { z } from 'zod'

class RsvpController {
  static PATHS = {
    index: '/week/:weekId/rsvp',
  }

  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  async store (req: Request, res: Response): Promise<void> {
    try {
      const dataSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        plusOne: z.boolean(),
      })

      dataSchema.parse(req.body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        let errors = {}

        error.errors.forEach((error) => {
          errors = {
            ...errors,
            [error.path[0]]: error.message,
          }
        })
        res.status(422).json({ errors })
      }

      res.status(500).json({ message: 'Something went wrong' })
    }


    const { weekId } = req.params
    const { name, email, plusOne } = req.body

    await this.firestore.createRsvp(weekId, name, email, plusOne)

    res.status(201).json({ message: 'successfully RSVP\'d' })
  }
}

export default RsvpController
