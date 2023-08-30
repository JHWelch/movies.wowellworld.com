import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestore/firestoreAdapter.js'
import { z } from 'zod'

class RsvpController {
  static PATHS = {
    store: '/api/weeks/:weekId/rsvp',
  }

  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  async store (req: Request, res: Response): Promise<void> {
    if (!this.validate(req, res)) return

    const { weekId } = req.params
    const { name, email, plusOne } = req.body

    const week = await this.firestore.getWeek(weekId)

    if (!week) {
      res.status(404).json({ message: `Week ${weekId} not found` })

      return
    }

    await this.firestore.createRsvp(weekId, name, email, plusOne)

    res.status(201).json({ message: 'Successfully RSVP\'d' })

    await this.firestore.sendEmail(this.firestore.adminEmail, {
      subject: `TNMC RSVP: ${name}`,
      // eslint-disable-next-line max-len
      text: `${name} has RSVPed for ${weekId}\n\nEmail: ${email}\nPlus one: ${plusOne}`,
      // eslint-disable-next-line max-len
      html: `<p>${name} has RSVPed for ${weekId}<p><ul><li>Email: ${email}</li><li>Plus one: ${plusOne}</li></ul>`,
    })

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
        [error.path[0] ?? 'Request Body']: error.message,
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
