/* eslint-disable @typescript-eslint/ban-ts-comment */
import { jest } from '@jest/globals'
import WeekProperties from '../../src/types/weekProperties'
import { Client, isFullPage } from '@notionhq/client'
import { GetPageParameters, GetPageResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

const nCheckbox = (checked: boolean) => ({ checkbox: checked })
const nDate = (start: string) => ({ date: { start } })
const nNumber = (number: number) => ({ number })
const nRichText = (text: string) => ({ rich_text: [{ plain_text: text }] })
const nTitle = (title: string): {
  type: 'title';
  title: Array<RichTextItemResponse>;
  id: string;
} => ({ type: 'title', title: [richTextItem(title)], id: 'some-id' })
const richTextItem = (text: string): RichTextItemResponse => ({
  type: 'text',
  text: {
    content: text,
    link: null,
  },
  annotations: {
    bold: false,
    italic: false,
    strikethrough: false,
    underline: false,
    code: false,
    color: 'default',
  },
  plain_text: text,
  href: null,
})

const nUrl = (url: string) => ({ url })

type QueryBody = {
  database_id: string
  page_size?: number
  filter?: {
    property: string
    date?: {
      equals?: string
      on_or_after?: string
    }
    sorts?: {
      property: string
      direction: string
    }[]
  }
}

type WeekResponse = {
  id: string
  properties: WeekProperties
}

type WithAuth<P> = P & {
  auth?: string;
};

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

          return {
            id: id,
            properties: {
              Title: nTitle(title),
              // @ts-ignore
              Director: nRichText(director),
              // @ts-ignore
              Year: nNumber(year),
              // @ts-ignore
              'Length (mins)': nNumber(length),
              // @ts-ignore
              IMDb: nUrl(imdbUrl),
              // @ts-ignore
              Poster: nUrl(posterUrl),
              // @ts-ignore
              'Theater Name': nRichText(theaterName),
              // @ts-ignore
              'Showing URL': nUrl(showingUrl),
            },
          }
        })

      return { pages: { retrieve: this.retrieve } }
    })
  }

  mockQuery = (weeks: WeekResponse[] = []) => {
    (Client as unknown as jest.Mock).mockImplementation(() => {
      return {
        databases: {
          query: jest.fn().mockImplementation((query: unknown) => {
            const { database_id, filter } = query as QueryBody
            if (database_id !== 'DATABASE_ID') {
              throw new Error('Database not found')
            }
            if (filter == null){
              throw new Error('Filter not specified')
            }

            const { property, date } = filter
            if (property !== 'Date') {
              throw new Error('Invalid property')
            }
            if (date == null) {
              throw new Error('Date not specified')
            }

            const { equals, on_or_after } = date
            if (equals === undefined && on_or_after === undefined) {
              throw new Error('Comparison not specified')
            }

            return NotionMock.mockWeeks(weeks)
          }),
        },
      }
    })
  }

  static mockWeek = (
    id: string,
    date: string,
    theme: string,
    skipped = false
  ): WeekResponse => ({
    id: id,
    properties: {
      Date: nDate(date),
      Theme: nTitle(theme),
      Skipped: nCheckbox(skipped),
      Movies: {
        relation: [
          // { id: 'movieId' },
        ],
      },
    },
  })

  static mockWeeks = (weeks: WeekResponse[] ) => ({ results: weeks })

}
