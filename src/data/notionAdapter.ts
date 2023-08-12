import { Client, isFullPageOrDatabase } from '@notionhq/client'
import Movie from '../models/movie.js'
import Week from '../models/week.js'
import {
  PartialDatabaseObjectResponse,
  type PageObjectResponse,
  type PartialPageObjectResponse,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type WeekProperties from '../types/weekProperties.js'

export default class NotionAdapter {
  #notion: Client
  #databaseId: string

  constructor () {
    const { NOTION_TOKEN, DATABASE_ID } = this._envVariables()
    this.#databaseId = DATABASE_ID
    this.#notion = new Client({
      auth: NOTION_TOKEN,
    })
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
      database_id: this.#databaseId,
      filter: {
        property: 'Date',
        date: { equals: date },
      },
    })
    const record = records.results[0]

    return record != null ? await this.recordToWeek(record) : null
  }

  async getWeeks (): Promise<Week[]> {
    const records = await this.#notion.databases.query({
      database_id: this.#databaseId,
      page_size: 100,
      filter: {
        property: 'Date',
        date: { is_not_empty: true },
      },
      sorts: [{
        property: 'Date',
        direction: 'ascending',
      }],
    })

    return await Promise.all(records.results
      .map(async (record) => await this.recordToWeek(record)))
  }

  async setMovie (movie: Movie): Promise<void> {
    await this.#notion.pages.update(movie.toNotion())
  }

  async recordToWeek (record: NotionQueryResponse): Promise<Week> {
    if (!isFullPageOrDatabase(record)) {
      throw new Error('Page was not successfully retrieved')
    }

    const properties = record.properties as unknown as WeekProperties

    const movies = await Promise.all(
      properties.Movies.relation
        .map(async (relation) => await this.getMovie(relation.id))
    )

    return Week.fromNotion(record).setMovies(movies)
  }

  _envVariables (): { NOTION_TOKEN: string, DATABASE_ID: string }
  {
    const { NOTION_TOKEN, DATABASE_ID } = process.env

    if (typeof NOTION_TOKEN !== 'string') {
      throw new Error('Missing NOTION_TOKEN environment variable')
    }
    if (typeof DATABASE_ID !== 'string') {
      throw new Error('Missing DATABASE_ID environment variable')
    }

    return { NOTION_TOKEN, DATABASE_ID }
  }
}

type NotionQueryResponse =
  PageObjectResponse |
  PartialPageObjectResponse |
  PartialDatabaseObjectResponse |
  DatabaseObjectResponse
