import { jest } from '@jest/globals'

const nCheckbox = (checked: boolean) => ({ checkbox: checked })
const nDate = (start: string) => ({ date: { start } })
const nNumber = (number: number) => ({ number })
const nRichText = (text: string) => ({ rich_text: [{ plain_text: text }] })
const nTitle = (title: string) => ({ title: [{ plain_text: title }] })
const nUrl = (url: string) => ({ url })

module.exports = {
  Client: jest.fn().mockImplementation(() => {
    return {
      pages: {
        retrieve: jest.fn().mockImplementation((id: unknown) => {
          const { page_id } = id as { page_id: string }

          if (page_id !== 'movieId') {
            throw new Error('Page not found')
          }

          return {
            id: 'movieId',
            properties: {
              Title: nTitle('movieTitle'),
              Director: nRichText('movieDirector'),
              Year: nNumber(2021),
              'Length (mins)': nNumber(120),
              IMDb: nUrl('movieImdbUrl'),
              Poster: nUrl('moviePosterUrl'),
              'Theater Name': nRichText('movieTheaterName'),
              'Showing URL': nUrl('movieShowingUrl'),
            },
          }
        }),
      },

      databases: {
        query: jest.fn().mockImplementation((query: unknown) => {
          const { database_id, filter } = query as QueryBody

          if (database_id !== 'DATABASE_ID') {
            throw new Error('Database not found')
          }
          if (filter == null){
            throw new Error('Filter not specified')
          }

          const { property, date, sorts } = filter

          if (property !== 'Date') {
            throw new Error('Invalid property')
          }
          if (date == null) {
            throw new Error('Date not specified')
          }

          const { equals, on_or_after } = date

          if (equals !== undefined) {
            return { results: [{
              id: 'weekId',
              properties: {
                Date: nDate(equals),
                Theme: nTitle('weekTheme'),
                Skipped: nCheckbox(false),
                Movies: {
                  relation: [
                    // { id: 'movieId' },
                  ],
                },
              },
            }]}
          }

        }),
      },
    }
  }),

  isFullPage: jest.fn(),
}

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
