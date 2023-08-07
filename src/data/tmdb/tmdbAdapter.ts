import Movie from '../../models/movie.js'
import SearchResponse from './dtos/searchResponse.js'

export default class TmdbAdapter {
  static readonly BASE_URL = 'https://api.themoviedb.org/3'
  static readonly MOVIE_URL = 'https://www.themoviedb.org/movie'

  async getMovie(name: string): Promise<Movie> {
    const response = await fetch(
      `${TmdbAdapter.BASE_URL}/search/movie?query=${name}`,
      this.options,
    )

    const search = SearchResponse.fromTmdbResponse(await response.json())

    return Movie.fromTmdbResponse(search.results[0])
  }

  get options(): RequestInit {
    return {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_READ_KEY}`,
      },
    }
  }

  static movieUrl(id: number): string {
    return `${TmdbAdapter.MOVIE_URL}/${id}`
  }
}
