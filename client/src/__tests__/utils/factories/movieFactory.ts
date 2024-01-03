import { MovieDto } from '../../../../../shared/dtos'

export default class MovieFactory {
  private state: MovieDto = {
    title: 'The Matrix',
    director: 'The Wachowskis',
    year: 1999,
    length: 136,
    time: '8:00 PM',
    url: 'https://www.imdb.com/title/tt0133093/',
    posterUrl: 'https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg',
    theaterName: 'Theater 1',
    showingUrl: 'https://www.fandango.com/1',
    isFieldTrip: false,
    displayLength: '2h 16m',
  }

  public build = (overrides?: Partial<MovieDto>): MovieDto => ({
    ...this.state,
    ...overrides,
  })
}
