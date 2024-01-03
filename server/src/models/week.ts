import {
  DatabaseObjectResponse,
  type PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import Movie from './movie.js'
import type WeekProperties from '../types/weekProperties.js'
import { dateToString } from '../data/dateUtils.js'
import { DocumentData, Timestamp, WithFieldValue } from 'firebase/firestore'
import { FirestoreWeek } from '../data/firestore/firestoreTypes.js'
import { WeekDto } from '../../../shared/dtos.js'

export default class Week {
  constructor (
    public id: string,
    public theme: string,
    public date: Date,
    public isSkipped: boolean = false,
    public slug: string | null = null,
    public movies: Movie[] = [],
  ) {}

  static fromNotion (
    record: PageObjectResponse | DatabaseObjectResponse,
  ): Week {
    const properties = record.properties as unknown as WeekProperties

    return new Week(
      record.id,
      properties.Theme.title[0].plain_text,
      new Date(properties.Date.date.start),
      properties.Skipped.checkbox,
      properties.Slug?.rich_text[0]?.plain_text,
    )
  }

  static fromFirebase (record: DocumentData): Week {
    return new Week(
      record.id,
      record.theme,
      record.date.toDate(),
      record.isSkipped,
      record.slug,
      record.movies.map((movie: DocumentData) => Movie.fromFirebase(movie)),
    )
  }

  displayDate (): string {
    return this.date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
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
      isSkipped: this.isSkipped,
    }
  }

  toFirebaseDTO (): WithFieldValue<FirestoreWeek> {
    return {
      id: this.id,
      theme: this.theme,
      date: Timestamp.fromDate(this.date),
      movies: this.movies.map((movie) => movie.toFirebaseDTO()),
      slug: this.slug,
      isSkipped: this.isSkipped,
    }
  }

  get dateString (): string {
    return dateToString(this.date)
  }
}
