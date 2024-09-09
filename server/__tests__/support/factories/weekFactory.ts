import Factory from '@tests/support/factories/factory'
import { Week, WeekConstructor } from '@server/models/week'

export default class WeekFactory extends Factory<Week, WeekConstructor> {
  protected _make = () => new Week(this._state)

  protected _state = {
    id: 'id',
    theme: 'theme',
    date: new Date('2021-09-13'),
    isSkipped: false,
    slug: null,
    movies: [],
  }
}
