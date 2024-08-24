import { CrewResponseTmdb } from '@server/data/tmdb/dtos/responseTypes'

export default class CrewResponse {
  constructor (
    public name: string,
    public job: string,
  ) {}

  static fromTmdbResponse (crew: CrewResponseTmdb): CrewResponse {
    return new CrewResponse(
      crew.name,
      crew.job,
    )
  }
}
