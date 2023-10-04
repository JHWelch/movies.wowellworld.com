import Movie from '../../../src/models/movie'

export class MovieFactory {
  private _state = {
    title: 'Movie Title',
    director: 'Movie Director',
    year: 2021,
    length: 90,
    url: 'Movie Url',
    tmdbId: 1234,
    posterUrl: 'Movie Poster Url',
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
      this._state.url,
      this._state.posterUrl,
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
