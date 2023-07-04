import { jest } from '@jest/globals'

module.exports = {
  Client: jest.fn().mockImplementation(() => {
    return {
      pages: {
        retrieve: jest.fn().mockImplementation((id: unknown) => {
          const { page_id } = id as { page_id: string }

          if (page_id === 'movieId') {
            return {
              id: 'movieId',
              properties: {
                Title: {
                  title: [{
                    plain_text: 'movieTitle',
                  }],
                },
                Director: {
                  rich_text: [{
                    plain_text: 'movieDirector',
                  }],
                },
                Year: {
                  number: 2021,
                },
                'Length (mins)': {
                  number: 120,
                },
                IMDb: {
                  url: 'movieImdbUrl',
                },
                Poster: {
                  url: 'moviePosterUrl',
                },
                'Theater Name': {
                  rich_text: [{
                    plain_text: 'movieTheaterName',
                  }],
                },
                'Showing URL': {
                  url: 'movieShowingUrl',
                },
              },
            }
          } else {
            throw new Error('Page not found')
          }
        }),
      },
    }
  }),

  isFullPage: jest.fn(),
}
