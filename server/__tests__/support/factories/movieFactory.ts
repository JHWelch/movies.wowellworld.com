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

  make (state?: Partial<typeof this.state>): Movie  {
    if (state) {
      this.state(state)
    }

    return new Movie({
      title: this._state.title,
      director: this._state.director,
      year: this._state.year,
      length: this._state.length,
      time: this._state.time,
      url: this._state.url,
      posterPath: this._state.posterPath,
      tmdbId: this._state.tmdbId,
      notionId: this._state.notionId,
      theaterName: this._state.theaterName,
      showingUrl: this._state.showingUrl,
    })
  }

  state (state: Partial<typeof this.state>): MovieFactory {
    this._state = { ...this._state, ...state }
    return this
  }

  noFields (): MovieFactory {
    return this.state({
      theaterName: undefined,
      showingUrl: null,
    })
  }
}
