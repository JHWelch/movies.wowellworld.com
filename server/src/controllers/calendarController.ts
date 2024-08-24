import { Request, Response } from 'express'
import Config from '@server/config/config'

export default class CalendarController {
  static PATH = '/calendar'

  constructor (
    private config: Config,
  ) {}

  index = (_req: Request, res: Response): void => {
    res.redirect(this.config.calendarUrl)
  }
}
