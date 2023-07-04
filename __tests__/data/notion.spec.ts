import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import Notion from '../../src/data/notion'

jest.mock('@notionhq/client')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const notionMock = require('@notionhq/client')

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
      beforeEach(() => {
        notionMock.isFullPage.mockReturnValue(true)
      })

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

    describe('returns not full page', () => {
      beforeEach(() => {
        notionMock.isFullPage.mockReturnValue(false)
      })

      it('should throw an error', async () => {
        const notion = new Notion()

        await expect(notion.getMovie('movieId'))
          .rejects.toThrowError('Page was not successfully retrieved')
      })
    })
  })

  describe('getWeek', () => {
    beforeEach(() => {
      process.env = {
        NOTION_TOKEN: 'NOTION_TOKEN',
        DATABASE_ID: 'DATABASE_ID',
      }
    })

    describe('when the week exists', () => {
      beforeEach(() => {
        notionMock.isFullPage.mockReturnValue(true)
      })

      it('should return the week', async () => {
        const notion = new Notion()
        const week = await notion.getWeek('2021-01-01')

        expect(week).toEqual({
          'date': new Date('2021-01-01'),
          'id': 'weekId',
          'isSkipped': false,
          'movies': [],
          'theme': 'weekTheme',
        })
      })
    })

    describe('when the week does not exist', () => {
      beforeEach(() => {
        notionMock.isFullPage.mockReturnValue(false)
      })

      it('should throw an error', async () => {
        const notion = new Notion()

        expect(notion.getWeek('2021-01-01'))
          .rejects.toThrowError('Page was not successfully retrieved')
      })
    })
  })
})
