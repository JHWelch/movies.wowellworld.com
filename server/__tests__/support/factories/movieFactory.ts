import { Movie, MovieConstructor } from '@server/models/movie'
import Factory from '@tests/support/factories/factory'

export default class MovieFactory extends Factory<MovieConstructor, Movie> {
  protected _make = () => new Movie(this._state)

  protected _state = {
    title: 'Movie Title',
    director: 'Movie Director',
    year: 2021,
    length: 90,
    time: '8:00 PM',
    url: 'https://example.com/movie1234',
    tmdbId: 1234,
    posterPath: '/path/to/poster.jpg',
    notionId: 'notionId',
    theaterName: 'Theater',
    showingUrl: 'Showing Url',
  }

  noFields (): MovieFactory {
    return this.state({
      theaterName: undefined,
      showingUrl: null,
    })
  }
}
