import { MovieDto, WeekDto } from '../../../../../shared/dtos'

export default class WeekFactory {
  private state: WeekDto = {
    id: '1234',
    weekId: '2020-01-01',
    theme: 'The Matrix',
    date: '2020-01-01',
    isSkipped: false,
    slug: null,
    movies: [],
  }

  public build = (overrides?: Partial<WeekDto>): WeekDto => ({
    ...this.state,
    ...overrides,
  })

  public withMovies = (movies: MovieDto[]): WeekFactory => {
    this.state.movies = movies

    return this
  }
}
