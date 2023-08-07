export default class MovieResponse {
  constructor (
    public adult: boolean,
    public backdropPath: string | null,
    public id: number,
    public originalLanguage: string,
    public originalTitle: string,
    public overview: string,
    public popularity: number,
    public posterPath: string | null,
    public releaseDate: string,
    public title: string,
    public video: boolean,
    public voteAverage: number,
    public voteCount: number,
  ) {}

  static fromTmdbResponse(tmdbResponse: any): MovieResponse {
    return new MovieResponse(
      tmdbResponse.adult,
      tmdbResponse.backdrop_path,
      tmdbResponse.id,
      tmdbResponse.original_language,
      tmdbResponse.original_title,
      tmdbResponse.overview,
      tmdbResponse.popularity,
      tmdbResponse.poster_path,
      tmdbResponse.release_date,
      tmdbResponse.title,
      tmdbResponse.video,
      tmdbResponse.vote_average,
      tmdbResponse.vote_count,
    )
  }
}
