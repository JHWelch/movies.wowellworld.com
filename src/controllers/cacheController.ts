import { Request, Response } from 'express'
import NotionAdapter from '../data/notion/notionAdapter'
import FirestoreAdapter from '../data/firestore/firestoreAdapter'
import Movie from '../models/movie'
import TmdbAdapter from '../data/tmdb/tmdbAdapter'
import fs from 'fs'
import emails from '../emails/emails'

export default class CacheController {
  static PATHS = {
    weeks: '/api/cache/weeks',
  }

  constructor (
    private firestore: FirestoreAdapter,
    private notionAdapter: NotionAdapter,
    private tmdbAdapter: TmdbAdapter,
  ) {}

  async cacheWeeks (_req: Request, res: Response): Promise<void> {
    const weeks = await this.notionAdapter.getWeeks()

    const moviesWithoutDirectors = weeks.flatMap<Movie>(week => {
      return week.movies.filter(movie => !movie.director)
    })

    await this.fillMovieDetails(moviesWithoutDirectors)
    await this.updateNotionMovies(moviesWithoutDirectors)

    this.firestore.cacheWeeks(weeks)

    res.sendStatus(200)
  }

  async cacheEmailTemplates (_req: Request, res: Response): Promise<void> {
    this.firestore.updateTemplates(emails.templates.map(email => ({
      ...email,
      html: this.getHtml(email.name),
    })))

    res.sendStatus(200)
  }

  private getHtml = (name: string | null) =>
    fs.readFileSync(`./emails/built/${name}.html`, 'utf8')

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
