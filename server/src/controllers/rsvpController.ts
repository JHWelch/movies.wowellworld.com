import { type Request, type Response } from 'express'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { z } from 'zod'
import { validate } from '@server/helpers/validation'
import { Week } from '@server/models/week'

export default class RsvpController {
  static PATHS = {
    store: '/api/weeks/:weekId/rsvp',
  }

  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  store = async (req: Request, res: Response): Promise<void> => {
    if (!this.validate(req, res)) return

    const { weekId } = req.params
    const { name, email, reminders } = req.body

    const week = await this.firestore.getWeek(weekId)

    if (!week) {
      res.status(404).json({ message: `Week ${weekId} not found` })

      return
    }

    await this.firestore.createRsvp(weekId, name, email)

    if (reminders && email) {
      await this.subscribe(email)
    }

    res.status(201).json({ message: 'Successfully RSVP\'d' })

    await Promise.all([
      this.sendAdminEmail(name, weekId, email),
      this.sendConfirmation(week, email),
    ])
  }

  private subscribe = async (email: string): Promise<void> => {
    const user = await this.firestore.getUserByEmail(email)

    if (!user) {
      await this.firestore.createUser(email, true)

      return
    }

    if (user.reminders) {
      return
    }

    user.reminders = true
    await this.firestore.updateUser(user)
  }

  private sendAdminEmail = async (
    name: string,
    weekId: string,
    email: string,
  ): Promise<void> => this.firestore.sendEmail(this.firestore.adminEmail, {
    subject: `TNMC RSVP: ${name}`,
    text: `${name} has RSVPed for ${weekId}\n\nEmail: ${email ?? 'None'}`,
    html: `<p>${name} has RSVPed for ${weekId}<p><ul><li>Email: ${email ?? 'None'}</li></ul>`,
  })

  private sendConfirmation = async (
    week: Week,
    email: string | undefined,
  ): Promise<void> => {
    if (!email) {
      return
    }

    const movies = week.movies.map((movie) => ({
      title: movie.title,
      time: movie.time,
      year: movie.year?.toString(),
      posterPath: movie.emailPosterUrl(),
    }))

    await this.firestore.sendEmailTemplate(email, 'rsvpConfirmation', {
      date: week.displayDate(),
      theme: week.theme,
      weekId: week.dateString,
      movies: movies,
    })
  }

  private validate = (req: Request, res: Response): boolean =>
    validate(req, res, z.object({
      name: z.string().min(1, { message: 'Required' }),
      email: z.string().email().optional(),
      reminders: z.boolean().default(false),
    }).refine((data) => {
      if (data.reminders) {
        return data.email
      }

      return true
    }, {
      message: 'Email is required to receive reminders',
      path: ['email'],
    } ))
}
