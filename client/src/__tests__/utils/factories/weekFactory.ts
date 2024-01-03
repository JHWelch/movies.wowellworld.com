import { MovieDto, WeekDto } from '../../../../../shared/dtos'
import Factory from './factory'

export default class WeekFactory extends Factory<WeekDto> {
  protected state: WeekDto = {
    id: '1234',
    weekId: '2020-01-01',
    theme: 'The Matrix',
    date: '2020-01-01',
    isSkipped: false,
    slug: null,
    movies: [],
  }

  public withMovies = (movies: MovieDto[]): WeekFactory => {
    this.state.movies = movies

    return this
  }
}
