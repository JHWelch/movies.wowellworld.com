import { Request, Response } from 'express'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import NotionAdapter from '@server/data/notion/notionAdapter'
import { validate } from '@server/helpers/validation'
import { z } from 'zod'

export default class MovieController {
  constructor (
    private notion: NotionAdapter,
    private tmdb: TmdbAdapter,
  ) {}

  show = async (req: Request, res: Response): Promise<void> => {
    const search = req.query.search

    if (!search) {
      res.status(400).json({ error: 'No search query provided' })

      return
    }
    const { results } = await this.tmdb.searchMovie(search.toString())

    res.status(200).json({ movies: results.map((movie) => movie.toDto()) })
  }

  store = async (req: Request, res: Response): Promise<void> => {
    if (!this.validate(req, res)) return

    const { id, watchWhere } = req.body

    const movie = await this.tmdb.movieDetails(id)
    movie.watchWhere = watchWhere || []

    this.notion.createMovie(movie)

    res.status(201).json({ message: 'Successfully created movie.' })
  }

  private validate = (req: Request, res: Response): boolean =>
    validate(req, res, z.object({
      id: z.number().int(),
    }))
}
