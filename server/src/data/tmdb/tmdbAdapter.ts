import Config from '@server/config/config'
import Movie from '@server/models/movie'
import { TMDB_BASE_URL } from '@server/data/tmdb/constants'
import MovieResponse from '@server/data/tmdb/dtos/movieResponse'
import SearchResponse from '@server/data/tmdb/dtos/searchResponse'

export default class TmdbAdapter {
  private tmdbApiKey: string

  constructor (config: Config) {
    this.tmdbApiKey = config.tmdbApiKey
  }

  async getMovie (name: string): Promise<Movie | undefined> {
    const search = await this.searchMovie(name)

    if (search.results.length === 0) return undefined

    return await this.movieDetails(search.results[0].id)
  }

  async searchMovie (name: string): Promise<SearchResponse> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${name}`,
      this.options,
    )

    return SearchResponse.fromTmdbResponse(await response.json())
  }

  async movieDetails (id: number): Promise<Movie> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?append_to_response=credits`,
      this.options,
    )

    const json = await response.json()

    return Movie.fromTmdbResponse(MovieResponse.fromTmdbResponse(json))
  }

  get options (): RequestInit {
    return {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.tmdbApiKey}`,
      },
    }
  }
}
