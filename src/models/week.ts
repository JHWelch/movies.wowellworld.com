import { DatabaseObjectResponse, type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import Movie from './movie.js'
import type WeekProperties from '../types/weekProperties.js'
import { dateToString } from '../data/dateUtils.js'
import { DocumentData, Timestamp } from 'firebase/firestore'

export default class Week {
  id: string
  theme: string
  date: Date
  movies: Movie[]
  isSkipped: boolean

  constructor (
    id: string,
    theme: string,
    date: Date,
    isSkipped = false,
    movies: Movie[] = []
  ) {
    this.id = id
    this.theme = theme
    this.date = date
    this.isSkipped = isSkipped
    this.movies = movies
  }

  static fromNotion (record: PageObjectResponse | DatabaseObjectResponse): Week {
    const properties = record.properties as unknown as WeekProperties

    return new Week(
      record.id,
      properties.Theme.title[0].plain_text,
      new Date(properties.Date.date.start),
      properties.Skipped.checkbox
    )
  }

  static fromFirebase (record: DocumentData): Week {
    return new Week(
      record.id,
      record.theme,
      record.date.toDate(),
      record.isSkipped,
      record.movies.map((movie: DocumentData) => Movie.fromFirebase(movie))
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

  toDTO (): object {
    return {
      id: this.id,
      theme: this.theme,
      date: this.displayDate(),
      movies: this.movies.map((movie) => movie.toDTO()),
      isSkipped: this.isSkipped,
    }
  }

  toFirebaseDTO (): object {
    return {
      id: this.id,
      theme: this.theme,
      date: Timestamp.fromDate(this.date),
      movies: this.movies.map((movie) => movie.toFirebaseDTO()),
      isSkipped: this.isSkipped,
    }
  }

  get dateString (): string {
    return dateToString(this.date)
  }
}
