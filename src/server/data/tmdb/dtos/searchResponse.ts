import MovieResponse from '@server/data/tmdb/dtos/movieResponse'
import { isMovieResponseTmdb, isSearchResponseTmdb } from '@server/data/tmdb/dtos/responseTypes'

export default class SearchResponse {
  constructor (
    public page: number,
    public results: MovieResponse[],
    public totalPages: number,
    public totalResults: number,
  ) {}

  static fromTmdbResponse (tmdbResponse: unknown): SearchResponse {
    if (!(isSearchResponseTmdb(tmdbResponse))) {
      throw new Error('Invalid response')
    }

    return new SearchResponse(
      tmdbResponse.page,
      tmdbResponse.results
        .filter(isMovieResponseTmdb)
        .map(MovieResponse.fromTmdbResponse),
      tmdbResponse.total_pages,
      tmdbResponse.total_results,
    )
  }
}
