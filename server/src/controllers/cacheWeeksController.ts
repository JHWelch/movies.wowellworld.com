import { Request, Response } from 'express'
import NotionAdapter from '@server/data/notion/notionAdapter'
import {
  type UpdatePageResponse,
} from '@notionhq/client/build/src/api-endpoints'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { Movie } from '@server/models/movie'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import { Week } from '@server/models/week'
import { minutesAsTimeString, timeStringAsMinutes } from '@server/helpers/timeStrings'
import { Timestamp } from 'firebase/firestore'
import { CacheWeeksOutput } from '@shared/dtos'

export default class CacheWeeksController {
  constructor (
    private firestore: FirestoreAdapter,
    private notionAdapter: NotionAdapter,
    private tmdbAdapter: TmdbAdapter,
  ) {}

  store = async (_req: Request, res: Response): Promise<void> => {
    const lastUpdated = await this.firestore.getGlobal('lastUpdated') as Timestamp | undefined

    const weeks = await this.notionAdapter
      .getWeeks(lastUpdated?.toDate().toISOString())

    if (!weeks.length) {
      res.status(200).json(this.cacheWeeksOutput({
        previousLastUpdated: lastUpdated?.toDate(),
      }))
      return
    }

    const moviesWithoutDetails = weeks.flatMap(week => week.movies
      .filter(movie => !movie.director && !movie.posterPath))
    await this.fillMovieDetails(moviesWithoutDetails)

    const weeksWithoutTimes = weeks.filter(week => !week.isSkipped
      && !week.isPast
      && week.movies.some(movie => !movie.time && movie.director))

    const moviesWithoutTimes = this.updateWeekTimes(weeksWithoutTimes)

    await this.updateNotionMovies([
      ...moviesWithoutDetails,
      ...moviesWithoutTimes,
    ])

    const newUpdated = weeks.reduce((latest, week) => {
      return week.lastUpdated > latest ? week.lastUpdated : latest
    }, weeks[0].lastUpdated)

    await this.firestore.setGlobal('lastUpdated', Timestamp.fromDate(newUpdated.toJSDate()))

    await this.firestore.cacheWeeks(weeks)

    res.status(200).json(this.cacheWeeksOutput({
      updatedWeeks: weeks.length,
      previousLastUpdated: lastUpdated?.toDate(),
      newLastUpdated: newUpdated.toJSDate(),
      tmdbMoviesSynced: moviesWithoutDetails,
    }))
  }

  private fillMovieDetails = (movies: Movie[]): Promise<void[]> =>
    Promise.all(movies.map<Promise<void>>(async movie => {
      const tmdbMovie = await this.tmdbAdapter.getMovie(movie.title)
      if (!tmdbMovie) return

      movie.merge(tmdbMovie)
    }))

  private updateWeekTimes = (weeks: Week[]): Movie[] => weeks
    .flatMap(week => this.updateMovieTimes(week.movies))

  private updateMovieTimes = (movies: Movie[]): Movie[] => {
    const firstMovieIndex = movies.findIndex(movie => movie.director)
    const firstMovie = movies[firstMovieIndex]

    let minutes = firstMovie?.time
      ? timeStringAsMinutes(firstMovie.time)
      : 18 * 60 // 6pm

    if (isNaN(minutes)) {
      return []
    }

    return movies.slice(firstMovieIndex).map((movie) => {
      movie.time = minutesAsTimeString(minutes)
      minutes += (movie.length || 0) + 15
      minutes = Math.ceil(minutes / 5) * 5

      return movie
    })
  }

  private updateNotionMovies = (
    movies: Movie[],
  ): Promise<UpdatePageResponse[]> => Promise.all(
    movies.map(this.notionAdapter.setMovie),
  )

  private cacheWeeksOutput = (input: {
    updatedWeeks?: number,
    previousLastUpdated?: Date | null,
    newLastUpdated?: Date | null,
    tmdbMoviesSynced?: Movie[],
  } = {}): CacheWeeksOutput => ({
    updatedWeeks: input.updatedWeeks ?? 0,
    previousLastUpdated: input.previousLastUpdated?.toISOString() ?? null,
    newLastUpdated: input.newLastUpdated?.toISOString()
      ?? input.previousLastUpdated?.toISOString()
      ?? null,
    tmdbMoviesSynced: input.tmdbMoviesSynced?.map(movie => movie.toDTO()) ?? [],
  })
}
