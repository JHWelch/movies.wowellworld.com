import { type Request, type Response } from 'express'
import NotionAdapter from '../data/notion/notionAdapter'

export default class SuggestionController {
  constructor (
    private notion: NotionAdapter,
  ) {}

  static PATHS = {
    create: '/suggestions/create',
  }

  async create (_req: Request, res: Response): Promise<void> {
    res.render('suggestions/create', {
      path: SuggestionController.PATHS.create,
    })
  }
}
