import Movie from '../../models/movie.js'
import { TMDB_BASE_URL } from './constants.js'
import MovieResponse from './dtos/movieResponse.js'
import SearchResponse from './dtos/searchResponse.js'

export default class TmdbAdapter {
  async getMovie(name: string): Promise<Movie> {
    const search = await this.searchMovie(name)

    return await this.movieDetails(search.results[0].id)
  }

  async searchMovie(name: string): Promise<SearchResponse> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${name}`,
      this.options,
    )

    return SearchResponse.fromTmdbResponse(await response.json())
  }

  async movieDetails(id: number): Promise<Movie> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?append_to_response=credits`,
      this.options,
    )

    const json = await response.json()

    return Movie.fromTmdbResponse(MovieResponse.fromTmdbResponse(json))
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
}
