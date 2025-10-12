import { type Request, type Response } from 'express'
import NotionAdapter from '@server/data/notion/notionAdapter'
import { z } from 'zod'
import { validate } from '@server/helpers/validation'
import { Movie } from '@server/models/movie'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'

export default class SuggestionController {
  constructor (
    private notion: NotionAdapter,
    private tmdb: TmdbAdapter,
  ) {}

  store = async (req: Request, res: Response): Promise<void> => {
    if (!this.validate(req, res)) return

    const { theme, movies, submitted_by } = req.body

    const notionMovies = await Promise.all(movies.map(async (movieData: {
      id?: number
      title: string
    }) => {
      let movie: Movie
      if (movieData.id) {
        movie = await this.tmdb.movieDetails(movieData.id)
      }

      movie ??= new Movie({ title: movieData.title })

      return await this.notion.createMovie(movie)
    }))

    await this.notion.createEvent(
      theme,
      notionMovies.map(m => m.notionId),
      submitted_by
    )

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
