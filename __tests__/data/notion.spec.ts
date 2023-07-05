import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import Notion from '../../src/data/notion'
import { mockIsFullPage, mockQuery, mockRetrieve, mockWeek } from '../support/notionHelper'

beforeAll(() => {
  jest.mock('@notionhq/client')
})

beforeEach(() => {
  jest.clearAllMocks()
})

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
    mockRetrieve()
  })

  describe('when the movie exists', () => {
    beforeEach(() => {
      mockIsFullPage(true)
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
      mockIsFullPage(false)
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
    mockQuery([mockWeek('weekId', '2021-01-01', 'weekTheme')])
  })

  describe('when the week exists', () => {
    beforeEach(() => {
      mockIsFullPage(true)
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
      mockIsFullPage(false)
    })

    it('should throw an error', async () => {
      const notion = new Notion()

      expect(notion.getWeek('2021-01-01'))
        .rejects.toThrowError('Page was not successfully retrieved')
    })
  })
})

describe('getUpcomingWeeks', () => {
  describe('when the weeks exist', () => {
    beforeEach(() => {
      mockIsFullPage(true)
      mockQuery([
        mockWeek('weekId1','2021-01-01', 'theme1'),
        mockWeek('weekId2','2021-01-08', 'theme2'),
        mockWeek('weekId3','2021-01-15', 'theme3'),
      ])
    })

    it('should return the weeks', async () => {
      const notion = new Notion()
      const weeks = await notion.getUpcomingWeeks()

      expect(weeks).toEqual([
        {
          'id': 'weekId1',
          'date': new Date('2021-01-01'),
          'isSkipped': false,
          'movies': [],
          'theme': 'theme1',
        }, {
          'id': 'weekId2',
          'date': new Date('2021-01-08'),
          'isSkipped': false,
          'movies': [],
          'theme': 'theme2',
        }, {
          'id': 'weekId3',
          'date': new Date('2021-01-15'),
          'isSkipped': false,
          'movies': [],
          'theme': 'theme3',
        },
      ])
    })
  })
})
