import { type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js'
import type MovieProperties from '../types/movieProperties.js'

export default class Movie {
  id: string
  title: string
  director: string
  year: number
  length: number
  imdbUrl: string
  posterUrl: string
  theaterName: string | null
  showingUrl: string | null

  constructor (
    id: string,
    title: string,
    director: string,
    year: number,
    length: number,
    imdbUrl: string,
    posterUrl: string,
    theaterName: string | null = null,
    showingUrl: string | null = null
  ) {
    this.id = id
    this.title = title
    this.director = director
    this.year = year
    this.length = length
    this.imdbUrl = imdbUrl
    this.posterUrl = posterUrl
    this.theaterName = theaterName
    this.showingUrl = showingUrl
  }

  static fromNotion (movie: PageObjectResponse): Movie {
    const properties = movie.properties as unknown as MovieProperties

    return new Movie(
      movie.id,
      properties.Title?.title[0]?.plain_text,
      properties.Director?.rich_text[0]?.plain_text,
      properties.Year?.number,
      properties['Length (mins)']?.number,
      properties.IMDb?.url,
      properties.Poster?.url,
      properties['Theater Name']?.rich_text[0]?.plain_text,
      properties['Showing URL']?.url
    )
  }

  isFieldTrip (): boolean {
    return this.theaterName !== null && this.showingUrl !== null
  }

  displayLength (): string {
    return this.length > 59
      ? `${Math.floor(this.length / 60)}h ${this.length % 60}m`
      : `${this.length}m`
  }

  toString (): string {
    return `${this.title} (${this.year})`
  }

  toDTO (): object {
    return {
      id: this.id,
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
}
