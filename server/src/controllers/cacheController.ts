import { Request, Response } from 'express'
import NotionAdapter from '@server/data/notion/notionAdapter'
import {
  type UpdatePageResponse,
} from '@notionhq/client/build/src/api-endpoints'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import Movie from '@server/models/movie'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import fs from 'fs'
import emails from '@server/emails/emails'
import directoryPath from '@server/helpers/directoryPath'

export default class CacheController {
  static PATHS = {
    weeks: '/api/cache/weeks',
    emailTemplates: '/api/cache/email-templates',
  }

  constructor (
    private firestore: FirestoreAdapter,
    private notionAdapter: NotionAdapter,
    private tmdbAdapter: TmdbAdapter,
  ) {}

  cacheWeeks = async (_req: Request, res: Response): Promise<void> => {
    const weeks = await this.notionAdapter.getWeeks()

    const moviesForSync = weeks.flatMap<Movie>(week => {
      return week.movies.filter(movie => !movie.director && !movie.posterPath)
    })

    await this.fillMovieDetails(moviesForSync)
    await this.updateNotionMovies(moviesForSync)

    this.firestore.cacheWeeks(weeks)

    res.sendStatus(200)
  }

  cacheEmailTemplates = async (_req: Request, res: Response): Promise<void> => {
    this.firestore.updateTemplates(emails.templates.map(email => ({
      ...email,
      html: this.getHtml(email.name),
    })))

    res.sendStatus(200)
  }

  private getHtml = (name: string | null): string =>
    fs.readFileSync(`${directoryPath()}/../../../emails/built/${name}.html`, 'utf8')

  private fillMovieDetails = (movies: Movie[]): Promise<void[]> =>
    Promise.all(movies.map<Promise<void>>(async movie => {
      const tmdbMovie = await this.tmdbAdapter.getMovie(movie.title)
      if (!tmdbMovie) return

      movie.merge(tmdbMovie)
    }))

  private updateNotionMovies = (
    movies: Movie[],
  ): Promise<UpdatePageResponse[]> => Promise.all(
    movies.map(this.notionAdapter.setMovie),
  )
}
