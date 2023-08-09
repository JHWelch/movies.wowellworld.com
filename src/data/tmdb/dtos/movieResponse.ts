import CrewResponse from './crewResponse.js'

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
      this.mapCrew(tmdbResponse),
      tmdbResponse.runtime,
    )
  }

  static mapCrew(tmdbResponse: any): CrewResponse[] {
    return tmdbResponse
      .credits
      ?.crew
      ?.map((crew: any) => CrewResponse.fromTmdbResponse(crew))
    ?? []
  }

  get director(): string {
    const director = this.crew.find(crew => crew.job === 'Director')

    return director?.name ?? ''
  }
}
