import {
  DatabaseObjectResponse,
  type PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { Movie } from '@server/models/movie'
import type WeekProperties from '@server/types/weekProperties'
import { DocumentData, Timestamp, WithFieldValue } from 'firebase/firestore'
import { FirestoreWeek } from '@server/data/firestore/firestoreTypes'
import { WeekDto } from '@shared/dtos'

export type WeekConstructor = {
  id: string,
  theme: string,
  date: Date,
  isSkipped?: boolean,
  slug?: string | null,
  movies?: Movie[],
}

export class Week {
  public id: string = ''
  public theme: string = ''
  public date: Date = new Date()
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
      date: new Date(properties.Date.date.start),
      isSkipped: properties.Skipped.checkbox,
      slug: properties.Slug?.rich_text[0]?.plain_text,
    })
  }

  static fromFirebase (record: DocumentData): Week {
    return new Week({
      id: record.id,
      theme: record.theme,
      date: record.date.toDate(),
      isSkipped: record.isSkipped,
      slug: record.slug,
      movies: record.movies
        .map((movie: DocumentData) => Movie.fromFirebase(movie)),
    })
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
      slug: this.slug,
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
    return this.date.toISOString().substring(0, 10)
  }

  get isPast (): boolean {
    return this.date < new Date()
  }
}
