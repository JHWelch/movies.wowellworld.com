import { jest } from '@jest/globals'
import { Client, isFullPageOrDatabase } from '@notionhq/client'
import {
  GetPageParameters,
  GetPageResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { RichText } from '@shared/dtos'
import {
  NotionMovie,
  WithAuth,
  nCheckbox,
  nDate,
  nFormula,
  nLastEditedTime,
  nRelation,
  nRichText,
  nTitle,
  pageObjectResponse,
} from '@tests/support/notionHelpers'
import { DateTime } from 'luxon'

type CreateType = typeof Client.prototype.pages.create
type UpdateType = typeof Client.prototype.pages.update
type QueryType = typeof Client.prototype.databases.query
type RetrieveType = typeof Client.prototype.pages.retrieve

export class NotionMock {
  create: jest.MockedFunction<CreateType>
  update: jest.MockedFunction<UpdateType>
  query: jest.MockedFunction<QueryType>
  retrieve: jest.MockedFunction<RetrieveType>

  constructor () {
    this.create = jest.fn<CreateType>()
    this.update = jest.fn<UpdateType>()
    this.retrieve = jest.fn<RetrieveType>()
    this.query = jest.fn<QueryType>()

    ;(Client as unknown as jest.Mock).mockImplementation(() => ({
      pages: {
        create: this.create,
        update: this.update,
        retrieve: this.retrieve,
      },
      databases: { query: this.query },
    }))
  }

  mockIsFullPageOrDatabase = (response: boolean) =>
    (isFullPageOrDatabase as unknown as jest.Mock).mockReturnValue(response)

  mockRetrieve = (movie?: NotionMovie) => {
    const notionMovie = movie ?? NotionMovie.demo()

    this.retrieve.mockImplementationOnce(async (
      _args: WithAuth<GetPageParameters>,
    ): Promise<GetPageResponse> => notionMovie.toPageObjectResponse())

    return { pages: { retrieve: this.retrieve } }
  }

  mockQuery = (weeks: PageObjectResponse[] = []) => {
    this.query.mockImplementation(
      async (
        _args: WithAuth<QueryDatabaseParameters>,
      ): Promise<QueryDatabaseResponse> => ({
        page_or_database: {},
        type: 'page_or_database',
        object: 'list',
        next_cursor: null,
        has_more: false,
        results: weeks,
      }))

    return { databases: { query: this.query } }
  }

  mockCreate = (...ids: string[]) => {
    ids.forEach((id) => this.create.mockResolvedValueOnce({
      id: id,
      object: 'page',
    }))
  }

  static mockWeek = (week: {
    id: string
    date: string
    theme: string
    skipped?: boolean
    slug?: string | null
    movies?: NotionMovie[]
    styledTheme?: RichText[]
    lastEditedTime?: string
    lastEditedMovieTime?: string
  }): PageObjectResponse => pageObjectResponse(week.id, {
    Date: nDate(week.date),
    Theme: nTitle(week.theme),
    Skipped: nCheckbox(week.skipped ?? false),
    Slug: nRichText(week.slug ?? null),
    Movies: nRelation(week.movies ?? []),
    'Styled Theme': nRichText(week.styledTheme ?? []),
    'Last edited time': nLastEditedTime(week.lastEditedTime ?? DateTime.now().toISO()),
    'Last edited movie time': nFormula(week.lastEditedMovieTime ? week.lastEditedMovieTime ?? DateTime.now().toISO() : null),
  })
}
