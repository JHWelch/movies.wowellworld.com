import Movie from '../../../src/models/movie'

export class MovieFactory {
  private state = {
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
      this.state.title,
      this.state.director,
      this.state.year,
      this.state.length,
      this.state.url,
      this.state.posterUrl,
      this.state.tmdbId,
      this.state.notionId,
      this.state.theaterName,
      this.state.showingUrl,
    )
  }
}
