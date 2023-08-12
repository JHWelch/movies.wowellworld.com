import { jest } from '@jest/globals'
import { Client, isFullPageOrDatabase } from '@notionhq/client'
import { GetPageParameters, GetPageResponse, PageObjectResponse, QueryDatabaseParameters, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionMovie, WithAuth, nCheckbox, nDate, nRelation, nTitle, pageObjectResponse } from './notionHelpers'

export class NotionMock {
  query: jest.MockedFunction<typeof Client.prototype.databases.query>
  retrieve: jest.MockedFunction<typeof Client.prototype.pages.retrieve>

  constructor () {
    this.retrieve = jest.fn<typeof Client.prototype.pages.retrieve>()
    this.query = jest.fn<typeof Client.prototype.databases.query>();

    (Client as unknown as jest.Mock).mockImplementation(() => ({
      pages: { retrieve: this.retrieve },
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
      args: WithAuth<GetPageParameters>
    ): Promise<GetPageResponse> => {
      const { page_id } = args as { page_id: string }

      if (page_id !== notionMovie.id) {
        throw new Error('Page not found')
      }

      return notionMovie.toPageObjectResponse()
    })
    return { pages: { retrieve: this.retrieve } }
  }

  mockQuery = (weeks: PageObjectResponse[] = []) => {
    this.query.mockImplementation(
      async (
        _args: WithAuth<QueryDatabaseParameters>
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

  static mockWeek = (
    id: string,
    date: string,
    theme: string,
    skipped = false,
    movies: NotionMovie[] = [],
  ): PageObjectResponse => pageObjectResponse(id, {
    Date: nDate(date),
    Theme: nTitle(theme),
    Skipped: nCheckbox(skipped),
    Movies: nRelation(movies),
  })
}
