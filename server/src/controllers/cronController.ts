import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestore/firestoreAdapter'
import { dateToString } from '../data/dateUtils.js'

class CronController {
  static PATHS = {
    reminders: '/cron/reminders',
  }

  constructor (
    protected firestore: FirestoreAdapter,
  ) {}

  reminders = async (_req: Request, res: Response): Promise<void> => {
    const tomorrow = dateToString(this.tomorrow())

    const week = await this.firestore.getWeek(tomorrow)

    if (!week) {
      res.status(200).send('ok')

      return
    }

    const users = await this.firestore.getUsersWithReminders()

    const movies = week.movies.map((movie) => ({
      title: movie.title,
      time: movie.time,
      year: movie.year?.toString(),
      posterPath: movie.emailPosterUrl(),
    }))
    const displayDate = week.displayDate()

    await this.firestore.sendEmailTemplates('reminder', users.map((user) => ({
      to: user.email,
      data: {
        date: displayDate,
        theme: week.theme,
        weekId: week.dateString,
        movies: movies,
      },
    })))

    res.status(200).send('ok')
  }

  protected tomorrow = (): Date => {
    const date = new Date('2024/01/10')
    date.setDate(date.getDate() + 1)
    return date
  }
}

export {
  CronController,
}
