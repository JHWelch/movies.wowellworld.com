import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import Notion from '../../src/data/notion'

beforeAll(() => {
  jest.mock('@notionhq/client')
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
          year: 'movieYear',
          tmdbId: 'movieTmdbId',
          poster: 'moviePoster',
          watched: false,
        })
      })
    })

    describe('when the movie does not exist', () => {
      it('should return null', async () => {
        const notion = new Notion()
        const movie = await notion.getMovie('invalidMovieId')

        expect(movie).toBeNull()
      })
    })
  })
})
