import { jest } from '@jest/globals'
import { Client, isFullPageOrDatabase } from '@notionhq/client'
import {
  GetPageParameters,
  GetPageResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'
import {
  NotionMovie,
  WithAuth,
  nCheckbox,
  nDate,
  nRelation,
  nRichText,
  nTitle,
  pageObjectResponse,
} from '@tests/support/notionHelpers'

export class NotionMock {
  create: jest.MockedFunction<typeof Client.prototype.pages.create>
  update: jest.MockedFunction<typeof Client.prototype.pages.update>
  query: jest.MockedFunction<typeof Client.prototype.databases.query>
  retrieve: jest.MockedFunction<typeof Client.prototype.pages.retrieve>

  constructor () {
    this.create = jest.fn<typeof Client.prototype.pages.create>()
    this.update = jest.fn<typeof Client.prototype.pages.update>()
    this.retrieve = jest.fn<typeof Client.prototype.pages.retrieve>()
    this.query = jest.fn<typeof Client.prototype.databases.query>();

    (Client as unknown as jest.Mock).mockImplementation(() => ({
      pages: {
        create: this.create,
        update: this.update,
        retrieve: this.retrieve,
      },
      databases: { query: this.query },
    }))
  }

  mockNotionEnv = () => {
    process.env = {
      NOTION_TOKEN: 'NOTION_TOKEN',
      DATABASE_ID: 'DATABASE_ID',
    }
  }

  mockIsFullPageOrDatabase = (response: boolean) => {
    (isFullPageOrDatabase as unknown as jest.Mock).mockReturnValue(response)
  }

  mockRetrieve = (movie: NotionMovie | undefined = undefined) => {
    const notionMovie = movie ?? NotionMovie.demo()

    this.retrieve.mockImplementation(async (
      _args: WithAuth<GetPageParameters>,
    ): Promise<GetPageResponse> =>
      notionMovie.toPageObjectResponse())

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

  static mockWeek = (
    id: string,
    date: string,
    theme: string,
    skipped = false,
    slug: string | null = null,
    movies: NotionMovie[] = [],
  ): PageObjectResponse => pageObjectResponse(id, {
    Date: nDate(date),
    Theme: nTitle(theme),
    Skipped: nCheckbox(skipped),
    Slug: nRichText(slug),
    Movies: nRelation(movies),
  })
}
