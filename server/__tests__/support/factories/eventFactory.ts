import Factory from '@tests/support/factories/factory'
import { Event, EventConstructor } from '@server/models/event'
import { DateTime } from 'luxon'

export default class EventFactory extends Factory<Event, EventConstructor> {
  protected _make = () => new Event(this._state)

  protected _state = {
    id: 'id',
    theme: 'theme',
    date: DateTime.fromISO('2021-09-13', { zone: 'utc' }),
    isSkipped: false,
    slug: null,
    movies: [],
  }
}
