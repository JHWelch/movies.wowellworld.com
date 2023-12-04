import { type Request, type Response } from 'express'
import NotionAdapter from '../data/notion/notionAdapter.js'
import { z } from 'zod'
import { validate } from '../helpers/validation.js'

export default class SuggestionController {
  constructor (
    private notion: NotionAdapter,
  ) {}

  static PATHS = {
    create: '/suggestions/create',
    store: '/suggestions',
  }

  async create (_req: Request, res: Response): Promise<void> {
    res.render('suggestions/create', {
      path: SuggestionController.PATHS.create,
    })
  }

  async store (req: Request, res: Response): Promise<void> {
    if (!this.validate(req, res)) return

    const { theme, movies } = req.body

    const notionMovies = await Promise.all(
      movies.map((movie: string) => this.notion.createMovie(movie)),
    )

    await this.notion.createWeek(theme, notionMovies)

    res.sendStatus(201)
  }

  private validate = (req: Request, res: Response): boolean =>
    validate(req, res, z.object({
      theme: z.string().min(1, { message: 'Required' }),
      movies: z.array(z.string().min(1, { message: 'Required' }))
        .min(1, { message: 'Required' }),
    }))
}
