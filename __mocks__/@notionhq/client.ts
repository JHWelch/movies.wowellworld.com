import { jest } from '@jest/globals'

const title = (title: string) => ({ title: [{ plain_text: title }] })
const richText = (text: string) => ({ rich_text: [{ plain_text: text }] })
const url = (url: string) => ({ url })
const number = (number: number) => ({ number })

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
              Title: title('movieTitle'),
              Director: richText('movieDirector'),
              Year: number(2021),
              'Length (mins)': number(120),
              IMDb: url('movieImdbUrl'),
              Poster: url('moviePosterUrl'),
              'Theater Name': richText('movieTheaterName'),
              'Showing URL': url('movieShowingUrl'),
            },
          }
        }),
      },
    }
  }),

  isFullPage: jest.fn(),
}
