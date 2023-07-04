import type Movie from './movie'

export default class Week {
  id: string
  theme: string
  date: Date
  movies: Movie[]
  isSkipped: boolean

  constructor (id, theme, date, isSkipped = false) {
    this.id = id
    this.theme = theme
    this.date = date
    this.isSkipped = isSkipped
    this.movies = []
  }

  static fromNotion (record): Week {
    return new Week(
      record.id,
      record.properties.Theme.title[0].plain_text,
      new Date(record.properties.Date.date.start),
      record.properties.Skipped.checkbox
    )
  }

  static fromObject (obj): Week {
    return new Week(
      obj.id,
      obj.theme,
      new Date(obj.date),
      obj.isSkipped
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

  setMovies (movies): Week {
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
