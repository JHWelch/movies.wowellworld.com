import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestore/firestoreAdapter'

class CronController {
  static PATHS = {
    reminders: '/cron/reminders',
  }

  constructor (
    protected firestore: FirestoreAdapter,
  ) {}

  async reminders (_req: Request, res: Response): Promise<void> {
    const tomorrow = this.tomorrow()

    const week = await this.firestore.getWeek(tomorrow.toDateString())

    if (!week) {
      res.status(200).send('ok')

      return
    }

    const users = await this.firestore.getUsersWithReminders()

    const movies = week.movies.map((movie) => ({
      title: movie.title,
      time: movie.time,
      year: movie.year?.toString(),
      posterPath: movie.posterPath,
    }))
    const displayDate = week.displayDate()

    await this.firestore.sendEmailTemplates('reminder', users.map((user) => ({
      to: user.id,
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
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date
  }
}

export {
  CronController,
}
