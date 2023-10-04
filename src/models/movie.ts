import {
  UpdatePageParameters,
  type PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints.js'
import type MovieProperties from '../types/movieProperties.js'
import { DocumentData, WithFieldValue } from 'firebase/firestore'
import MovieResponse from '../data/tmdb/dtos/movieResponse.js'
import {
  notionNumber,
  notionRichText,
  notionTitle,
  notionUrl,
} from '../data/notion/notionFormatters.js'
import { FirestoreMovie } from '../data/firestore/firestoreTypes.js'
import { TMDB_POSTER_URL } from '../data/tmdb/constants.js'

export default class Movie {
  constructor (
    public title: string,
    public director: string | null = null,
    public year: number | null = null,
    public length: number | null = null,
    public url: string | null = null,
    public posterPath: string | null = null,
    public tmdbId: number | null = null,
    public notionId: string | null = null,
    public theaterName: string | null = null,
    public showingUrl: string | null = null
  ) {}

  static fromNotion (movie: PageObjectResponse): Movie {
    const properties = movie.properties as unknown as MovieProperties

    return new Movie(
      properties.Title?.title[0]?.plain_text,
      properties.Director?.rich_text[0]?.plain_text,
      properties.Year?.number,
      properties['Length (mins)']?.number,
      properties.URL?.url,
      properties.Poster?.url,
      null,
      movie.id,
      properties['Theater Name']?.rich_text[0]?.plain_text,
      properties['Showing URL']?.url,
    )
  }

  static fromFirebase (movie: DocumentData): Movie {
    return new Movie(
      movie.title,
      movie.director,
      movie.year,
      movie.length,
      movie.url,
      movie.posterPath,
      movie.tmdbId,
      movie.notionId,
      movie.theaterName,
      movie.showingUrl,
    )
  }

  static fromTmdbResponse (tmdbResponse: MovieResponse): Movie {
    return new Movie(
      tmdbResponse.title,
      tmdbResponse.director,
      parseInt(tmdbResponse.releaseDate.split('-')[0]),
      tmdbResponse.runtime ?? -1,
      tmdbResponse.fullMovieUrl,
      tmdbResponse.posterPath,
      tmdbResponse.id,
    )
  }

  isFieldTrip (): boolean {
    return this.theaterName !== null && this.showingUrl !== null
  }

  displayLength (): string {
    if (this.length === null) {
      return ''
    }

    return this.length > 59
      ? `${Math.floor(this.length / 60)}h ${this.length % 60}m`
      : `${this.length}m`
  }

  posterUrl (): string {
    return this.posterPath
      ? `${TMDB_POSTER_URL}${this.posterPath}`
      : ''
  }

  toString (): string {
    return `${this.title} (${this.year})`
  }

  toDTO (): object {
    return {
      title: this.title,
      director: this.director,
      year: this.year,
      length: this.length,
      url: this.url,
      posterUrl: this.posterUrl(),
      theaterName: this.theaterName,
      showingUrl: this.showingUrl,
      isFieldTrip: this.isFieldTrip(),
      displayLength: this.displayLength(),
    }
  }

  toFirebaseDTO (): WithFieldValue<FirestoreMovie> {
    return {
      title: this.title,
      director: this.director,
      year: this.year,
      length: this.length,
      url: this.url,
      tmdbId: this.tmdbId,
      notionId: this.notionId,
      posterPath: this.posterPath,
      theaterName: this.theaterName,
      showingUrl: this.showingUrl,
    }
  }

  toNotion (): UpdatePageParameters {
    if (this.notionId == null) throw new Error('Movie does not have notionId')

    return {
      page_id: this.notionId,
      properties: {
        Title: notionTitle(this.title),
        Director: notionRichText(this.director),
        Year: notionNumber(this.year),
        'Length (mins)': notionNumber(this.length),
        URL: notionUrl(this.url),
        Poster: notionUrl(this.posterPath),
        'Theater Name': notionRichText(this.theaterName),
        'Showing URL': notionUrl(this.showingUrl),
      },
    }
  }

  merge (other: Movie): void {
    this.title ??= other.title
    this.director ??= other.director
    this.year ??= other.year
    this.length ??= other.length
    this.url ??= other.url
    this.posterPath ??= other.posterPath
    this.tmdbId ??= other.tmdbId
    this.notionId ??= other.notionId
    this.theaterName ??= other.theaterName
    this.showingUrl ??= other.showingUrl
  }
}
