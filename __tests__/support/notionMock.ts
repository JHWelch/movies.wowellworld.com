import { jest } from '@jest/globals'
import { Client, isFullPage } from '@notionhq/client'
import { GetPageParameters, GetPageResponse, PageObjectResponse, QueryDatabaseParameters, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { QueryBody, WithAuth, nCheckbox, nDate, nNumber, nRelation, nRichText, nTitle, nUrl, pageObjectResponse } from './notionHelpers'

export class NotionMock {
  query: jest.MockedFunction<typeof Client.prototype.databases.query> | undefined
  retrieve: jest.MockedFunction<typeof Client.prototype.pages.retrieve> | undefined
  isFullPage: jest.MockedFunction<typeof isFullPage> | undefined

  mockNotionEnv = () => {
    process.env = {
      NOTION_TOKEN: 'NOTION_TOKEN',
      DATABASE_ID: 'DATABASE_ID',
    }
  }

  mockIsFullPage = (response: boolean) => {
    (isFullPage as unknown as jest.Mock).mockReturnValue(response)
  }

  mockRetrieve = (
    id = 'movieId',
    title = 'movieTitle',
    director = 'movieDirector',
    year = 2021,
    length = 120,
    imdbUrl = 'movieImdbUrl',
    posterUrl = 'moviePosterUrl',
    theaterName = 'movieTheaterName',
    showingUrl = 'movieShowingUrl'
  ) => {
    (Client as unknown as jest.Mock).mockImplementation(() => {
      this.retrieve = jest.fn<typeof Client.prototype.pages.retrieve>()
        .mockImplementation(async (args: WithAuth<GetPageParameters>): Promise<GetPageResponse> => {
          const { page_id } = args as { page_id: string }

          if (page_id !== id) {
            throw new Error('Page not found')
          }

          return pageObjectResponse(id, {
            Title: nTitle(title),
            Director: nRichText(director),
            Year: nNumber(year),
            'Length (mins)': nNumber(length),
            IMDb: nUrl(imdbUrl),
            Poster: nUrl(posterUrl),
            'Theater Name': nRichText(theaterName),
            'Showing URL': nUrl(showingUrl),
          })
        })
      return { pages: { retrieve: this.retrieve } }
    })
  }

  mockQuery = (weeks: PageObjectResponse[] = []) => {
    (Client as unknown as jest.Mock).mockImplementation(() => {
      this.query = jest.fn<typeof Client.prototype.databases.query>()
        .mockImplementation(
          async (_args: WithAuth<QueryDatabaseParameters>): Promise<QueryDatabaseResponse> => ({
            page: {},
            type: 'page',
            object: 'list',
            next_cursor: null,
            has_more: false,
            results: weeks,
          }))

      return { databases: { query: this.query } }
    })
  }

  static mockWeek = (
    id: string,
    date: string,
    theme: string,
    skipped = false,
  ): PageObjectResponse => pageObjectResponse(id, {
    Date: nDate(date),
    Theme: nTitle(theme),
    Skipped: nCheckbox(skipped),
    Movies: nRelation([]),
  })
}
