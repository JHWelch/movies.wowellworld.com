import { jest } from '@jest/globals'
import { Client as _Client, isFullPage as _isFullPage } from '@notionhq/client'
import {
  GetPageParameters,
  GetPageResponse,
  PageObjectResponse,
  QueryDataSourceParameters,
  QueryDataSourceResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { RichText } from '@shared/dtos'
import {
  NotionMovie,
  WithAuth,
  nCheckbox,
  nDate,
  nFormula,
  nLastEditedTime,
  nMultiSelect,
  nRelation,
  nRichText,
  nTitle,
  pageObjectResponse,
} from '@tests/support/notionHelpers'
import { DateTime } from 'luxon'

const Client = _Client as unknown as jest.Mock
const isFullPage = _isFullPage as unknown as jest.Mock

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

    Client.mockImplementation(() => ({
      pages: {
        create: this.create,
        update: this.update,
        retrieve: this.retrieve,
      },
      dataSources: { query: this.query },
    }))
  }

  mockIsFullPage = (response: boolean) =>
    isFullPage.mockReturnValue(response)

  mockRetrieve = (movie?: NotionMovie) => {
    const notionMovie = movie ?? NotionMovie.demo()

    this.retrieve.mockImplementationOnce(async (
      _args: WithAuth<GetPageParameters>,
    ): Promise<GetPageResponse> => notionMovie.toPageObjectResponse())

    return { pages: { retrieve: this.retrieve } }
  }

  mockQuery = (events: PageObjectResponse[] = []) => {
    this.query.mockImplementation(
      async (
        _args: WithAuth<QueryDataSourceParameters>,
      ): Promise<QueryDataSourceResponse> => ({
        page_or_data_source: {},
        type: 'page_or_data_source',
        object: 'list',
        next_cursor: null,
        has_more: false,
        results: events,
      }))

    return { databases: { query: this.query } }
  }

  mockCreate = (...ids: string[]) => {
    ids.forEach((id) => this.create.mockResolvedValueOnce({
      id: id,
      object: 'page',
    }))
  }

  static mockEvent = (event: {
    id: string
    date: string
    theme: string
    skipped?: boolean
    slug?: string | null
    movies?: NotionMovie[]
    styledTheme?: RichText[]
    lastEditedTime?: string
    lastEditedMovieTime?: string
    submittedBy?: string | null
    tags?: string[]
    hideFromHome?: boolean
  }): PageObjectResponse => pageObjectResponse(event.id, {
    Date: nDate(event.date),
    Theme: nTitle(event.theme),
    Skipped: nCheckbox(event.skipped ?? false),
    Slug: nRichText(event.slug ?? null),
    Movies: nRelation(event.movies ?? []),
    'Styled Theme': nRichText(event.styledTheme ?? []),
    'Last edited time': nLastEditedTime(event.lastEditedTime ?? DateTime.now().toISO()),
    'Last edited movie time': nFormula(event.lastEditedMovieTime || null),
    'Submitted By': nRichText(event.submittedBy ?? null),
    Tags: nMultiSelect(event.tags ?? []),
    'Hide from Home': nCheckbox(event.hideFromHome ?? false),
  })
}
