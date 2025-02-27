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
import { LastUpdated } from '@server/data/globals/types'

export default class CacheWeeksController {
  constructor (
    private firestore: FirestoreAdapter,
    private notionAdapter: NotionAdapter,
    private tmdbAdapter: TmdbAdapter,
  ) {}

  show = async (_req: Request, res: Response): Promise<void> => {
    const lastUpdated = await this.firestore.getGlobal('lastUpdated') as LastUpdated | null

    if (!lastUpdated) {
      res.status(200).json(null)

      return
    }

    const { previousLastUpdated, newLastUpdated } = lastUpdated

    res.status(200).json({
      ...lastUpdated,
      previousLastUpdated: previousLastUpdated?.toDate().toISOString() ?? null,
      newLastUpdated: newLastUpdated?.toDate().toISOString() ?? null,
    })
  }

  store = async (_req: Request, res: Response): Promise<void> => {
    const lastUpdated = await this.firestore.getGlobal('lastUpdated') as LastUpdated | null
    const previousLastUpdated = lastUpdated?.newLastUpdated?.toDate()

    const weeks = await this.notionAdapter
      .getWeeks(previousLastUpdated?.toISOString())

    if (!weeks.length) {
      const { dto, meta } = this.generateCacheWeeksData({ previousLastUpdated })

      res.status(200).json(dto)

      await this.firestore.setGlobal('lastUpdated', meta)

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

    const { dto, meta } = this.generateCacheWeeksData({
      previousLastUpdated,
      updatedWeeks: weeks.length,
      newLastUpdated: newUpdated.toJSDate(),
      tmdbMoviesSynced: moviesWithoutDetails,
    })
    await Promise.all([
      this.firestore.setGlobal('lastUpdated', meta),
      this.firestore.cacheWeeks(weeks),
    ])

    res.status(200).json(dto)
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

  private generateCacheWeeksData = (input: {
    updatedWeeks?: number
    previousLastUpdated?: Date | null
    newLastUpdated?: Date | null
    tmdbMoviesSynced?: Movie[]
  } ): { dto: CacheWeeksOutput, meta: LastUpdated } => {
    const baseData = {
      updatedWeeks: input.updatedWeeks ?? 0,
      previousLastUpdated: input.previousLastUpdated ?? null,
      newLastUpdated: input.newLastUpdated
        ?? input.previousLastUpdated
        ?? null,
      tmdbMoviesSynced: input.tmdbMoviesSynced?.map(
        movie => movie.toDTO()
      ) ?? [],
    }

    return {
      dto: {
        ...baseData,
        previousLastUpdated: baseData
          .previousLastUpdated?.toISOString() ?? null,
        newLastUpdated: baseData
          .newLastUpdated?.toISOString() ?? null,
      },
      meta: {
        ...baseData,
        previousLastUpdated: this.dateToTimestamp(baseData.previousLastUpdated),
        newLastUpdated: this.dateToTimestamp(baseData.newLastUpdated),
      },
    }
  }

  private dateToTimestamp = (date: Date | null): Timestamp | null =>
    date ? Timestamp.fromDate(date) : null
}
