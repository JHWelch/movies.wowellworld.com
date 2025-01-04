import { type Request, type Response } from 'express'
import NotionAdapter from '@server/data/notion/notionAdapter'
import { z } from 'zod'
import { validate } from '@server/helpers/validation'
import { Movie } from '@server/models/movie'

export default class SuggestionController {
  constructor (
    private notion: NotionAdapter,
  ) {}

  store = async (req: Request, res: Response): Promise<void> => {
    if (!this.validate(req, res)) return

    const { theme, movies, submitted_by } = req.body

    const notionMovies = await Promise.all(movies.map((movieData: {
      title: string
    }) => {
      const movie = new Movie({ title: movieData.title })

      return this.notion.createMovie(movie)
    }))

    await this.notion.createWeek(theme, notionMovies, submitted_by)

    res.status(201).json({ message: 'Successfully created suggestion.' })
  }

  private validate = (req: Request, res: Response): boolean =>
    validate(req, res, z.object({
      theme: z.string().min(1, { message: 'Required' }),
      submitted_by: z.string().min(1, { message: 'Required' }),
      movies: z.array(z.object({
        title: z.string().min(1, { message: 'Required' }),
      }))
        .min(1, { message: 'Required' }),
    }))
}
