export default class CrewResponse {
  constructor(
    public name: string,
    public job: string,
  ) {}

  static fromTmdbResponse(crew: any): CrewResponse {
    return new CrewResponse(
      crew.name,
      crew.job,
    )
  }
}
