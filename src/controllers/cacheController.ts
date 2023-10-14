import { Request, Response } from 'express'
import NotionAdapter from '../data/notion/notionAdapter'
import FirestoreAdapter from '../data/firestore/firestoreAdapter'
import Movie from '../models/movie'
import TmdbAdapter from '../data/tmdb/tmdbAdapter'

export default class CacheController {
  constructor (
    private firestore: FirestoreAdapter,
    private notionAdapter: NotionAdapter,
    private tmdbAdapter: TmdbAdapter,
  ) {}

  async cache (_req: Request, res: Response): Promise<void> {
    const weeks = await this.notionAdapter.getWeeks()

    const moviesWithoutDirectors = weeks.flatMap<Movie>(week => {
      return week.movies.filter(movie => !movie.director)
    })

    await this.fillMovieDetails(moviesWithoutDirectors)
    await this.updateNotionMovies(moviesWithoutDirectors)

    this.firestore.cacheWeeks(weeks)

    res.sendStatus(200)
  }

  private async fillMovieDetails (movies: Movie[]): Promise<void> {
    await Promise.all(movies.map<Promise<void>>(async movie => {
      const tmdbMovie = await this.tmdbAdapter.getMovie(movie.title)
      if (!tmdbMovie) return

      movie.merge(tmdbMovie)
    }))
  }

  private async updateNotionMovies (movies: Movie[]): Promise<void> {
    await Promise.all(movies.map<Promise<void>>(async movie => {
      await this.notionAdapter.setMovie(movie)
    }))
  }
}
