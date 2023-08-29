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
    if (!this.validate(req, res)) return

    const { weekId } = req.params
    const { name, email, plusOne } = req.body

    await this.firestore.createRsvp(weekId, name, email, plusOne)

    res.status(201).json({ message: 'Successfully RSVP\'d' })
  }

  private validate (req: Request, res: Response): boolean {
    try {
      const dataSchema = z.object({
        name: z.string().min(1, { message: 'Required' }),
        email: z.string().email(),
        plusOne: z.boolean(),
      })

      dataSchema.parse(req.body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = this.mapErrors(error.issues)
        res.status(422).json(errors)

        return false
      }

      res.status(500).json({ message: 'Something went wrong' })

      return false
    }

    return true
  }

  private mapErrors (errors: Array<z.ZodIssue>): ErrorResponse {
    let mappedErrors = {}

    errors.forEach((error) => {
      mappedErrors = {
        ...mappedErrors,
        [error.path[0]]: error.message,
      }
    })

    return { errors: mappedErrors }
  }
}

type ErrorResponse = {
  errors: {
    [key: string]: string,
  }
}

export default RsvpController