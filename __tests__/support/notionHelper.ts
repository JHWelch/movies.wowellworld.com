import { jest } from '@jest/globals'
import MovieProperties from '../../src/types/movieProperties'
import WeekProperties from '../../src/types/weekProperties'
import { Client, isFullPage } from '@notionhq/client'

export const mockIsFullPage = (response: boolean) => {
  (isFullPage as unknown as jest.Mock).mockReturnValue(response)
}

export const mockRetrieve = (
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
    return {
      pages: {
        retrieve: jest.fn().mockImplementation((idArg: unknown) => {
          const { page_id } = idArg as { page_id: string }

          if (page_id !== id) {
            throw new Error('Page not found')
          }

          return {
            id: id,
            properties: {
              Title: nTitle(title),
              Director: nRichText(director),
              Year: nNumber(year),
              'Length (mins)': nNumber(length),
              IMDb: nUrl(imdbUrl),
              Poster: nUrl(posterUrl),
              'Theater Name': nRichText(theaterName),
              'Showing URL': nUrl(showingUrl),
            },
          }
        }),
      },
    }
  })
}

export const mockQuery = () => {
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
  })
}



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

type MovieResponse = {
  id: string
  properties: MovieProperties
}
