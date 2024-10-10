import { type Request, type Response } from 'express'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import Config from '@server/config/config'
import { tomorrow } from '@server/data/dateUtils'

class CronController {
  constructor (
    protected config: Config,
    protected firestore: FirestoreAdapter,
  ) {}

  reminders = async (_req: Request, res: Response): Promise<void> => {
    const week = await this.firestore.getWeek(tomorrow())

    if (!week || week.isSkipped) {
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

    await this.firestore.sendEmailTemplates('reminder', users.map((user) => ({
      to: user.email,
      data: {
        date: week.displayDate(),
        theme: week.theme,
        weekId: week.dateString,
        movies: movies,
        unsubscribeUrl: this.config.appUrl + user.unsubscribeUrl(),
      },
    })))

    res.status(200).send('ok')
  }
}

export {
  CronController,
}
