import {
  DatabaseObjectResponse,
  type PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { Movie } from '@server/models/movie'
import type WeekProperties from '@server/types/weekProperties'
import { DocumentData, Timestamp, WithFieldValue } from 'firebase/firestore'
import { FirestoreWeek } from '@server/data/firestore/firestoreTypes'
import { RichText, WeekDto } from '@shared/dtos'
import { timeStringAsMinutes } from '@server/helpers/timeStrings'
import { DateTime } from 'luxon'
import { CHICAGO, TZ } from '@server/config/tz'

export type WeekConstructor = {
  id: string,
  theme: string,
  date: DateTime,
  styledTheme?: RichText[],
  isSkipped?: boolean,
  slug?: string | null,
  movies?: Movie[],
}

export class Week {
  public id: string = ''
  public theme: string = ''
  public date: DateTime = DateTime.now().setZone(CHICAGO)
  public styledTheme: RichText[] = []
  public isSkipped: boolean = false
  public slug: string | null = null
  public movies: Movie[] = []

  constructor (week: WeekConstructor) {
    Object.keys(week).forEach((key) => {
      const typedKey = key as keyof WeekConstructor
      if (week[typedKey] === undefined) {
        delete week[typedKey]
      }
    })
    Object.assign(this, week)
  }

  static fromNotion (
    record: PageObjectResponse | DatabaseObjectResponse,
  ): Week {
    const properties = record.properties as unknown as WeekProperties

    return new Week({
      id: record.id,
      theme: properties.Theme.title[0].plain_text,
      date: DateTime.fromISO(properties.Date.date.start, TZ),
      isSkipped: properties.Skipped.checkbox,
      slug: properties.Slug?.rich_text[0]?.plain_text,
      styledTheme: properties['Styled Theme']?.rich_text,
    })
  }

  static fromFirebase (record: DocumentData): Week {
    return new Week({
      id: record.id,
      theme: record.theme,
      date: DateTime.fromJSDate(record.date.toDate(), TZ),
      isSkipped: record.isSkipped,
      slug: record.slug,
      styledTheme: record.styledTheme,
      movies: record.movies
        .map((movie: DocumentData) => Movie.fromFirebase(movie)),
    })
  }

  displayDate (): string {
    return this.date.toFormat('EEEE, LLLL d')
  }

  setMovies (movies: Movie[]): Week {
    this.movies = movies

    return this
  }

  toString (): string {
    return `${this.theme}`
  }

  toDTO (): WeekDto {
    return {
      id: this.id,
      weekId: this.dateString,
      theme: this.theme,
      date: this.displayDate(),
      movies: this.movies.map((movie) => movie.toDTO()),
      slug: this.slug,
      isSkipped: this.isSkipped,
      styledTheme: this.styledTheme,
    }
  }

  toFirebaseDTO (): WithFieldValue<FirestoreWeek> {
    return {
      id: this.id,
      theme: this.theme,
      date: Timestamp.fromDate(this.date.toJSDate()),
      movies: this.movies.map((movie) => movie.toFirebaseDTO()),
      slug: this.slug,
      isSkipped: this.isSkipped,
      styledTheme: this.styledTheme,
    }
  }

  get dateString (): string {
    return this.date.toISODate() ?? ''
  }

  get isPast (): boolean {
    return this.date < DateTime.now()
  }

  get totalLength (): number {
    const beforeTime = 30
    const firstTimeIndex = this.movies.findIndex((movie) => movie.time)
    const lastTimeIndex = this.movies.length - 1 - this.movies
      .slice()
      .reverse()
      .findIndex((movie) => movie.time)

    if (firstTimeIndex === -1 || lastTimeIndex === -1) {
      return beforeTime
        + this.sumLengths(this.movies)
        + this.breaks(this.movies)
    }

    const firstTime = timeStringAsMinutes(this.movies[firstTimeIndex].time ?? '')
    const lastTime = timeStringAsMinutes(this.movies[lastTimeIndex].time ?? '')
    const moviesPostTime = this.movies.slice(lastTimeIndex)

    return beforeTime
      + lastTime
      - firstTime
      + this.sumLengths(moviesPostTime)
      + this.breaks(moviesPostTime)
  }

  get startTime (): DateTime {
    const firstTime = this.movies.find((movie) => movie.time)

    const minutes = timeStringAsMinutes(firstTime?.time ?? '6:00 PM')

    return this.date.plus({ minutes: minutes - 30 })
  }

  private breaks (movies: Movie[]): number {
    return (movies.length - 1) * 15
  }

  private sumLengths (movies: Movie[]): number {
    return movies.reduce((total, movie) => (movie.length ?? 0) + total, 0)
  }
}
