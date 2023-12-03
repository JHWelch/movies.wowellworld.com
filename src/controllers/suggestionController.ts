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

  async store (req: Request, res: Response): Promise<void> {
    const { theme, movies } = req.body

    const notionMovies = await Promise.all(
      movies.map((movie: string) => this.notion.createMovie(movie)),
    )

    await this.notion.createWeek(theme, notionMovies)

    res.redirect('/')
  }
}
