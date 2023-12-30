import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestore/firestoreAdapter.js'
import { z } from 'zod'
import { validate } from '../helpers/validation.js'

export default class RsvpController {
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
      text: `${name} has RSVPed for ${weekId}\n\nEmail: ${email}\nPlus one: ${plusOne}`, // eslint-disable-line max-len
      html: `<p>${name} has RSVPed for ${weekId}<p><ul><li>Email: ${email}</li><li>Plus one: ${plusOne}</li></ul>`, // eslint-disable-line max-len
    })

  }

  private validate = (req: Request, res: Response): boolean =>
    validate(req, res, z.object({
      name: z.string().min(1, { message: 'Required' }),
      email: z.string().email(),
      plusOne: z.boolean(),
    }))
}
