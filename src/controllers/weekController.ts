import { type Request, type Response } from 'express'
import type Notion from '../data/notion.js'

class WeekController {
  notion: Notion

  constructor (notion: Notion) {
    this.notion = notion
  }

  async index (_req: Request, res: Response): Promise<void> {
    const weeks = await this.notion.getUpcomingWeeks()

    res.json(weeks.map((week) => week.toDTO()))
  }

  async show (req: Request, res: Response): Promise<void> {
    const week = await this.notion.getWeek(req.params.date)

    if (week == null) {
      res.status(404).json({ error: 'Week not found' })
      return
    }

    res.json(week.toDTO())
  }
}

export default WeekController
