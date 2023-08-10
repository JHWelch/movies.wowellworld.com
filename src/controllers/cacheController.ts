import { Request, Response } from 'express'
import Notion from '../data/notionAdapter'
import FirestoreAdapter from '../data/firestoreAdapter'
import Movie from '../models/movie'
import TmdbAdapter from '../data/tmdb/tmdbAdapter'

export default class CacheController {
  constructor (
    private firestore: FirestoreAdapter,
    private notion: Notion,
    private tmdbAdapter: TmdbAdapter,
  ) {}

  async cache (_req: Request, res: Response): Promise<void> {
    const weeks = await this.notion.getWeeks()

    const moviesWithoutDirectors = weeks.flatMap<Movie>(week => {
      return week.movies.filter(movie => !movie.director)
    })

    await this.fillMovieDetails(moviesWithoutDirectors)

    this.firestore.cacheWeeks(weeks)

    res.sendStatus(200)
  }

  async fillMovieDetails (movies: Movie[]) {
    await Promise.all(movies.map<Promise<void>>(async movie => {
      const tmdbMovie = await this.tmdbAdapter.getMovie(movie.title)
      movie.merge(tmdbMovie)
    }))
  }
}
