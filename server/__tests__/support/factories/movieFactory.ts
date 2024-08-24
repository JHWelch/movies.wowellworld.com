import Movie from '@server/models/movie'

export default class MovieFactory {
  private _state = {
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

  make (): Movie  {
    return new Movie(
      this._state.title,
      this._state.director,
      this._state.year,
      this._state.length,
      this._state.time,
      this._state.url,
      this._state.posterPath,
      this._state.tmdbId,
      this._state.notionId,
      this._state.theaterName,
      this._state.showingUrl,
    )
  }

  state (state: Partial<typeof this.state>): MovieFactory {
    this._state = { ...this._state, ...state }
    return this
  }
}
