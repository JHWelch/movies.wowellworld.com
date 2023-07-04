import { jest } from '@jest/globals'
import WeekProperties from '../../src/types/weekProperties'

const nCheckbox = (checked: boolean) => ({ checkbox: checked })
const nDate = (start: string) => ({ date: { start } })
const nNumber = (number: number) => ({ number })
const nRichText = (text: string) => ({ rich_text: [{ plain_text: text }] })
const nTitle = (title: string) => ({ title: [{ plain_text: title }] })
const nUrl = (url: string) => ({ url })
const weeks = (weeks: WeekResponse[] ) => ({ results: weeks })
const week = (
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
            return weeks([week('weekId', equals, 'weekTheme')])
          }
          if (on_or_after !== undefined) {
            return weeks([
              week('weekId1','2021-01-01', 'theme1'),
              week('weekId2','2021-01-08', 'theme2'),
              week('weekId3','2021-01-15', 'theme3'),
            ])
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

type WeekResponse = {
  id: string
  properties: WeekProperties
}
