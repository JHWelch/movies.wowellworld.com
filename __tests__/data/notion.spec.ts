import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import Notion from '../../src/data/notion'


jest.mock('@notionhq/client', () => {
  return {
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
    isFullPage: jest.fn(() => true),
  }
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('notion', () => {
  describe('constructor', () => {
    describe('when NOTION_TOKEN and DATABASE_ID are set', () => {
      beforeEach(() => {
        process.env = {
          NOTION_TOKEN: 'NOTION_TOKEN',
          DATABASE_ID: 'DATABASE_ID',
        }
      })

      it('should be created successfully', () => {
        expect(() => new Notion()).not.toThrow()
      })
    })


    describe('when NOTION_TOKEN is not set', () => {
      beforeEach(() => {
        process.env = {
          DATABASE_ID: 'DATABASE_ID',
        }
      })

      it('should throw an error', () => {
        expect(() => new Notion()).toThrowError('Missing NOTION_TOKEN environment variable')
      })
    })

    describe('when DATABASE_ID is not set', () => {
      beforeEach(() => {
        process.env = {
          NOTION_TOKEN: 'NOTION_TOKEN',
        }
      })

      it('should throw an error', () => {
        expect(() => new Notion()).toThrowError('Missing DATABASE_ID environment variable')
      })
    })
  })

  describe('getMovie', () => {
    beforeEach(() => {
      process.env = {
        NOTION_TOKEN: 'NOTION_TOKEN',
        DATABASE_ID: 'DATABASE_ID',
      }
    })

    describe('when the movie exists', () => {
      it('should return the movie', async () => {
        const notion = new Notion()
        const movie = await notion.getMovie('movieId')

        expect(movie).toEqual({
          id: 'movieId',
          title: 'movieTitle',
          director: 'movieDirector',
          year: 2021,
          length: 120,
          imdbUrl: 'movieImdbUrl',
          posterUrl: 'moviePosterUrl',
          theaterName: 'movieTheaterName',
          showingUrl: 'movieShowingUrl',
        })
      })
    })

    // describe('when the movie does not exist', () => {
    //   it('should return null', async () => {
    //     const notion = new Notion()
    //     const movie = await notion.getMovie('invalidMovieId')

    //     expect(movie).toBeNull()
    //   })
    // })
  })
})
