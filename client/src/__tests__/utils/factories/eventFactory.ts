import { MovieDto, EventDto as EventDto } from '@shared/dtos'
import Factory from '@tests/utils/factories/factory'

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

  public withMovies = (movies: MovieDto[]): EventFactory => {
    this.state.movies = movies

    return this
  }
}
