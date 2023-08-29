/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type Request, type Response } from 'express'

class RsvpController {
  static PATHS = {
    index: '/week/:weekId/rsvp',
  }

  static async store (req: Request, res: Response): Promise<void> {

    res.status(201).json({ message: 'successfully RSVP\'d' })
  }
}

export default RsvpController
