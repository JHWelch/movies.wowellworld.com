import { MovieDto, EventDto as EventDto } from '@shared/dtos'
import Factory from '@tests/utils/factories/factory'
import MovieFactory from './movieFactory'

export default class EventFactory extends Factory<EventDto> {
  protected state: EventDto = {
    id: '1234',
    eventId: '2020-01-01',
    theme: 'The Matrix',
    date: '2020-01-01',
    isSkipped: false,
    slug: null,
    styledTheme: [],
    movies: [],
    submittedBy: null,
  }

  public withMovies = (movies: MovieDto[]|number): EventFactory => {
    this.state.movies = Array.isArray(movies)
      ? movies
      : new Array(movies).fill(null).map(() => new MovieFactory().build())

    return this
  }
}
