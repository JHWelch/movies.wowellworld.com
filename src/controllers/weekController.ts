import { type Request, type Response } from 'express'
import type Notion from '../data/notion.js'

class WeekController {
  notion: Notion

  constructor (notion: Notion) {
    this.notion = notion
  }

  async index (req: Request, res: Response): Promise<void> {
    const { past } = this.parseIndexFilters(req)

    const weeks = past
      ? await this.notion.getPastWeeks()
      : await this.notion.getUpcomingWeeks()

    res.json(weeks.map((week) => week.toDTO()))
  }

  parseIndexFilters(req: Request): { past: boolean } {
    const { filter } = req.query

    if (filter == null) {
      return { past: false }
    }

    const filters = Array.isArray(filter) ? filter : [filter]

    return {
      past: filters.includes('past'),
    }
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
