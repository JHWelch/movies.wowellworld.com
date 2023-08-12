import { TMDB_MOVIE_URL, TMDB_POSTER_URL } from '../constants.js'
import CrewResponse from './crewResponse.js'
import { MovieResponseTmdb, isMovieResponseTmdb } from './responseTypes.js'

export default class MovieResponse {
  constructor (
    public readonly adult: boolean,
    public readonly backdropPath: string | null,
    public readonly id: number,
    public readonly originalLanguage: string,
    public readonly originalTitle: string,
    public readonly overview: string,
    public readonly popularity: number,
    public readonly posterPath: string | null,
    public readonly releaseDate: string,
    public readonly title: string,
    public readonly video: boolean,
    public readonly voteAverage: number,
    public readonly voteCount: number,
    public readonly crew: CrewResponse[] = [],
    public readonly runtime: number | null | undefined = null,
  ) {}

  static fromTmdbResponse(tmdbResponse: unknown): MovieResponse {
    if (!isMovieResponseTmdb(tmdbResponse)) {
      throw new Error('Invalid response')
    }

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
      this.mapCrew(tmdbResponse),
      tmdbResponse.runtime,
    )
  }

  static mapCrew(tmdbResponse: MovieResponseTmdb): CrewResponse[] {
    if (!tmdbResponse.credits) return []

    return tmdbResponse.credits.crew
      .map(CrewResponse.fromTmdbResponse)
  }

  get director(): string {
    const director = this.crew.find(crew => crew.job === 'Director')

    return director?.name ?? ''
  }

  get fullMovieUrl(): string {
    return `${TMDB_MOVIE_URL}/${this.id}`
  }

  get fullPosterPath(): string {
    if (this.posterPath === null) return ''

    return `${TMDB_POSTER_URL}${this.posterPath}`
  }
}
