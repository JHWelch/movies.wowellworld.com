import { jest } from '@jest/globals'
import { Client, isFullPageOrDatabase } from '@notionhq/client'
import { GetPageParameters, GetPageResponse, PageObjectResponse, QueryDatabaseParameters, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionMovie, WithAuth, nCheckbox, nDate, nNumber, nRelation, nRichText, nTitle, nUrl, pageObjectResponse } from './notionHelpers'

export class NotionMock {
  query: jest.MockedFunction<typeof Client.prototype.databases.query>
  retrieve: jest.MockedFunction<typeof Client.prototype.pages.retrieve>

  constructor() {
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
    this.retrieve.mockImplementation(async (args: WithAuth<GetPageParameters>): Promise<GetPageResponse> => {
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
  }

  mockQuery = (weeks: PageObjectResponse[] = []) => {
    this.query.mockImplementation(
      async (_args: WithAuth<QueryDatabaseParameters>): Promise<QueryDatabaseResponse> => ({
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
