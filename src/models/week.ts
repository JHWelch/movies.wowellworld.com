import { type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type Movie from './movie.js'
import type WeekProperties from '../types/weekProperties.js'

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
    isSkipped = false
  ) {
    this.id = id
    this.theme = theme
    this.date = date
    this.isSkipped = isSkipped
    this.movies = []
  }

  static fromNotion (record: PageObjectResponse): Week {
    const properties = record.properties as unknown as WeekProperties

    return new Week(
      record.id,
      properties.Theme.title[0].plain_text,
      new Date(properties.Date.date.start),
      properties.Skipped.checkbox
    )
  }

  displayDate (): string {
    return this.date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'long',
      month: 'long',
      day: 'numeric'
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
      isSkipped: this.isSkipped
    }
  }
}
