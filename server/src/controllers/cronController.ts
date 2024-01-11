import { type Request, type Response } from 'express'
import FirestoreAdapter from '../data/firestore/firestoreAdapter'
import Config from '../config/config'

class CronController {
  static PATHS = {
    reminders: '/cron/reminders',
  }

  constructor (
    protected config: Config,
    protected firestore: FirestoreAdapter,
  ) {}

  reminders = async (_req: Request, res: Response): Promise<void> => {
    const tomorrow = this.tomorrow()

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
        unsubscribeUrl: this.config.appUrl + user.unsubscribeUrl(),
      },
    })))

    res.status(200).send('ok')
  }

  protected tomorrow = (): string => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const tomorrowArray = tomorrow.toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit' ,
    }).split('/')

    return [
      tomorrowArray[2],
      tomorrowArray[0],
      tomorrowArray[1],
    ].join('-')
  }
}

export {
  CronController,
}
