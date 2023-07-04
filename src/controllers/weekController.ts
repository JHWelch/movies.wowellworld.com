import type Notion from '../data/notion'

class WeekController {
  notion: Notion

  constructor (notion) {
    this.notion = notion
  }

  async index (_req, res): Promise<void> {
    const weeks = await this.notion.getUpcomingWeeks()

    res.json(weeks.map((week) => week.toDTO()))
  }

  async show (req, res): Promise<void> {
    const week = await this.notion.getWeek(req.params.date)

    if (week == null) {
      res.status(404).json({ error: 'Week not found' })
      return
    }

    res.json(week.toDTO())
  }
}

export default WeekController
