import { Client, isFullPageOrDatabase } from '@notionhq/client'
import { Movie } from '@server/models/movie'
import { Week } from '@server/models/week'
import {
  type DatabaseObjectResponse,
  type PartialDatabaseObjectResponse,
  type CreatePageResponse,
  type PageObjectResponse,
  type PartialPageObjectResponse,
  type UpdatePageResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints'
import type WeekProperties from '@server/types/weekProperties'
import Config from '@server/config/config'

export default class NotionAdapter {
  #notion: Client
  #movieDatabaseId: string
  #weekDatabaseId: string

  constructor (config: Config) {
    this.#movieDatabaseId = config.notionMovieDatabaseId
    this.#weekDatabaseId = config.notionWeekDatabaseId
    this.#notion = new Client({ auth: config.notionToken })
  }

  async getMovie (id: string): Promise<Movie> {
    const page = await this.#notion.pages.retrieve({ page_id: id })
    if (!isFullPageOrDatabase(page)) {
      throw new Error('Page was not successfully retrieved')
    }

    return Movie.fromNotion(page)
  }

  async getWeek (date: string): Promise<Week | null> {
    const records = await this.#notion.databases.query({
      database_id: this.#weekDatabaseId,
      filter: {
        property: 'Date',
        date: { equals: date },
      },
    })

    const record = records.results[0]

    return record != null ? await this.recordToWeek(record) : null
  }

  async getWeeks (after?: string | null): Promise<Week[]> {
    const results: (PageObjectResponse
      | PartialPageObjectResponse
      | DatabaseObjectResponse
      | PartialDatabaseObjectResponse)[] = []
    let hasMore = true
    let nextCursor: string | undefined | null

    while (hasMore) {
      const records = await this.#notion.databases.query({
        database_id: this.#weekDatabaseId,
        page_size: 100,
        filter: this.weekFilter(after),
        sorts: [{
          property: 'Date',
          direction: 'ascending',
        }],
        start_cursor: nextCursor ?? undefined,
      })
      results.push(...records.results)
      hasMore = records.has_more
      nextCursor = records.next_cursor
    }

    return await Promise.all(results
      .map(async (record) => await this.recordToWeek(record)))
  }

  setMovie = (movie: Movie): Promise<UpdatePageResponse> =>
    this.#notion.pages.update(movie.toNotion())

  createWeek = (
    theme: string,
    movies: string[],
    submittedBy: string,
  ): Promise<CreatePageResponse> =>
    this.#notion.pages.create({
      parent: { database_id: this.#weekDatabaseId },
      properties: {
        Theme: { title: [{ text: { content: theme } }] },
        'Submitted By': { rich_text: [{ text: { content: submittedBy } }] },
        Movies: { relation: movies.map((movie) => ({ id: movie })) },
      },
    })

  createMovie = async (title: string): Promise<string> => {
    const movie = await this.#notion.pages.create({
      parent: { database_id: this.#movieDatabaseId },
      properties: {
        Title: { title: [{ text: { content: title } }] },
      },
    })

    return movie.id
  }

  private weekFilter = (after?: string | null): QueryDatabaseParameters['filter'] => after
    ? {
      and: [
        {
          property: 'Date',
          date: { is_not_empty: true },
        },
        {
          or: [
            {
              property: 'Last edited time',
              date: { after },
            },
            {
              property: 'Last edited movie time',
              date: { after },
            },
          ],
        },
      ],
    }
    : {
      property: 'Date',
      date: { is_not_empty: true },
    }

  private recordToWeek = async (record: NotionQueryResponse): Promise<Week> => {
    if (!isFullPageOrDatabase(record)) {
      throw new Error('Page was not successfully retrieved')
    }

    const properties = record.properties as unknown as WeekProperties

    const movies = await Promise.all(
      properties.Movies.relation
        .map((relation) => this.getMovie(relation.id)),
    )

    return Week.fromNotion(record).setMovies(movies)
  }
}

type NotionQueryResponse =
  PageObjectResponse |
  PartialPageObjectResponse |
  PartialDatabaseObjectResponse |
  DatabaseObjectResponse
