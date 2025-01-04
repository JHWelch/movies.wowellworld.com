import { Movie, MovieConstructor } from '@server/models/movie'
import Factory from '@tests/support/factories/factory'
import { FirebaseMovie } from '@tests/support/firebaseMock'

export default class MovieFactory extends Factory<Movie, MovieConstructor> {
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

  noFields = (): MovieFactory => this.state({
    theaterName: undefined,
    showingUrl: null,
  })

  tmdbFields = (): MovieFactory => this
    .noFields()
    .state({
      time: undefined,
    })

  asFirebaseMovie = (): FirebaseMovie => ({
    title: this._state.title,
    director: this._state.director,
    year: this._state.year,
    length: this._state.length,
    time: this._state.time,
    url: this._state.url,
    tmdbId: this._state.tmdbId,
    posterPath: this._state.posterPath,
    notionId: this._state.notionId,
    theaterName: this._state.theaterName,
    showingUrl: this._state.showingUrl,
  })
}
