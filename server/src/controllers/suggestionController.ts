import { type Request, type Response } from 'express'
import NotionAdapter from '../data/notion/notionAdapter.js'
import { z } from 'zod'
import { validate } from '../helpers/validation.js'

export default class SuggestionController {
  constructor(private notion: NotionAdapter) {}

  static PATHS = {
    store: '/suggestions',
  }

  async store(req: Request, res: Response): Promise<void> {
    if (!this.validate(req, res)) return

    const { theme, movies, submitted_by } = req.body

    const notionMovies = await Promise.all(
      movies.map((movie: string) => this.notion.createMovie(movie)),
    )

    await this.notion.createWeek(theme, notionMovies, submitted_by)

    res.status(201).json({ message: 'Successfully created suggestion.' })
  }

  private validate = (req: Request, res: Response): boolean =>
    validate(
      req,
      res,
      z.object({
        theme: z.string().min(1, { message: 'Required' }),
        submitted_by: z.string().min(1, { message: 'Required' }),
        movies: z
          .array(z.string().min(1, { message: 'Required' }))
          .min(1, { message: 'Required' }),
      }),
    )
}
