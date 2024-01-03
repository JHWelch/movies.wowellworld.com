import MovieResponse from './movieResponse.js'
import { isSearchResponseTmdb } from './responseTypes.js'

export default class SearchResponse {
  constructor(
    public page: number,
    public results: MovieResponse[],
    public totalPages: number,
    public totalResults: number,
  ) {}

  static fromTmdbResponse(tmdbResponse: unknown): SearchResponse {
    if (!isSearchResponseTmdb(tmdbResponse)) {
      throw new Error('Invalid response')
    }

    return new SearchResponse(
      tmdbResponse.page,
      tmdbResponse.results.map(MovieResponse.fromTmdbResponse),
      tmdbResponse.total_pages,
      tmdbResponse.total_results,
    )
  }
}
