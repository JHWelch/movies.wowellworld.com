import MovieResponse from './movieResponse.js'

export default class SearchResponse {
  constructor(
    public page: number,
    public results: MovieResponse[],
    public totalPages: number,
    public totalResults: number,
  ) {}

  static fromTmdbResponse(tmdbResponse: any): SearchResponse {
    return new SearchResponse(
      tmdbResponse.page,
      tmdbResponse.results.map((movie: any) => MovieResponse.fromTmdbResponse(movie)),
      tmdbResponse.total_pages,
      tmdbResponse.total_results,
    )
  }
}
