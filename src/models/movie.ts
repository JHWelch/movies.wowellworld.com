import { type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js'
import type MovieProperties from '../types/movieProperties.js'
import { DocumentData } from 'firebase/firestore'
import MovieResponse from '../data/tmdb/dtos/movieResponse.js'

export default class Movie {
  constructor (
    public title: string,
    public director: string | null = null,
    public year: number | null = null,
    public length: number | null = null,
    public imdbUrl: string | null = null,
    public posterUrl: string | null = null,
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
      properties.IMDb?.url,
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
      movie.imdbUrl,
      movie.posterUrl,
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
      tmdbResponse.fullPosterPath,
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

  toString (): string {
    return `${this.title} (${this.year})`
  }

  toDTO (): object {
    return {
      title: this.title,
      director: this.director,
      year: this.year,
      length: this.length,
      imdbUrl: this.imdbUrl,
      posterUrl: this.posterUrl,
      theaterName: this.theaterName,
      showingUrl: this.showingUrl,
      isFieldTrip: this.isFieldTrip(),
      displayLength: this.displayLength(),
    }
  }

  toFirebaseDTO (): object {
    return {
      title: this.title,
      director: this.director,
      year: this.year,
      length: this.length,
      imdbUrl: this.imdbUrl,
      tmdbId: this.tmdbId,
      notionId: this.notionId,
      posterUrl: this.posterUrl,
      theaterName: this.theaterName,
      showingUrl: this.showingUrl,
    }
  }

  merge (other: Movie): void {
    this.title ??= other.title
    this.director ??= other.director
    this.year ??= other.year
    this.length ??= other.length
    this.imdbUrl ??= other.imdbUrl
    this.posterUrl ??= other.posterUrl
    this.tmdbId ??= other.tmdbId
    this.notionId ??= other.notionId
    this.theaterName ??= other.theaterName
    this.showingUrl ??= other.showingUrl
  }
}
