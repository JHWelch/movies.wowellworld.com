import { Request, Response } from 'express'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'

export default class MovieController {
  constructor (
    private tmdbAdapter: TmdbAdapter,
  ) {}

  show = async (req: Request, res: Response): Promise<void> => {
    const search = req.query.search

    if (!search) {
      res.status(400).json({ error: 'No search query provided' })

      return
    }
    const { results } = await this.tmdbAdapter.searchMovie(search.toString())

    res.status(200).json({ movies: results.map((movie) => movie.toDto()) })
  }
}
