import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import NotionAdapter from '../../../src/data/notion/notionAdapter'
import { NotionMock } from '../../support/notionMock'
import Movie from '../../../src/models/movie'

let notionMock: NotionMock

beforeAll(() => {
  jest.mock('@notionhq/client')
  notionMock = new NotionMock()
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
      expect(() => new NotionAdapter()).not.toThrow()
    })
  })


  describe('when NOTION_TOKEN is not set', () => {
    beforeEach(() => {
      process.env = {
        DATABASE_ID: 'DATABASE_ID',
      }
    })

    it('should throw an error', () => {
      expect(() => new NotionAdapter())
        .toThrowError('Missing NOTION_TOKEN environment variable')
    })
  })

  describe('when DATABASE_ID is not set', () => {
    beforeEach(() => {
      process.env = {
        NOTION_TOKEN: 'NOTION_TOKEN',
      }
    })

    it('should throw an error', () => {
      expect(() => new NotionAdapter())
        .toThrowError('Missing DATABASE_ID environment variable')
    })
  })
})

describe('getMovie', () => {
  beforeEach(() => {
    process.env = {
      NOTION_TOKEN: 'NOTION_TOKEN',
      DATABASE_ID: 'DATABASE_ID',
    }
    notionMock.mockRetrieve()
  })

  describe('when the movie exists', () => {
    beforeEach(() => {
      notionMock.mockIsFullPageOrDatabase(true)
    })

    it('should return the movie', async () => {
      const movie = await new NotionAdapter().getMovie('movieId')

      expect(movie).toEqual({
        notionId: 'movieId',
        title: 'movieTitle',
        director: 'movieDirector',
        year: 2021,
        length: 120,
        url: 'movieUrl',
        posterUrl: 'moviePosterUrl',
        theaterName: 'movieTheaterName',
        showingUrl: 'movieShowingUrl',
        tmdbId: null,
      })
    })

    it ('calls the retrieve method with page_id', async () => {
      await new NotionAdapter().getMovie('movieId')

      expect(notionMock.retrieve).toHaveBeenCalledWith({ 'page_id': 'movieId' })
    })
  })

  describe('returns not full page', () => {
    beforeEach(() => {
      notionMock.mockIsFullPageOrDatabase(false)
    })

    it('should throw an error', async () => {
      await expect(new NotionAdapter().getMovie('movieId'))
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
    notionMock.mockQuery([
      NotionMock.mockWeek('weekId', '2021-01-01', 'weekTheme'),
    ])
  })

  describe('when the week exists', () => {
    beforeEach(() => {
      notionMock.mockIsFullPageOrDatabase(true)
    })

    it('should return the week', async () => {
      const notion = new NotionAdapter()
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
      notionMock.mockIsFullPageOrDatabase(false)
    })

    it('should throw an error', async () => {
      const notion = new NotionAdapter()

      expect(notion.getWeek('2021-01-01'))
        .rejects.toThrowError('Page was not successfully retrieved')
    })
  })
})

describe('getWeeks', () => {
  beforeEach(() => {
    notionMock.mockIsFullPageOrDatabase(true)
    notionMock.mockQuery([
      NotionMock.mockWeek('weekId3','2021-01-15', 'theme3'),
      NotionMock.mockWeek('weekId2','2021-01-08', 'theme2'),
      NotionMock.mockWeek('weekId1','2021-01-01', 'theme1'),
    ])
  })

  it('should return the weeks', async () => {
    const notion = new NotionAdapter()
    const weeks = await notion.getWeeks()

    expect(weeks).toEqual([
      {
        'id': 'weekId3',
        'date': new Date('2021-01-15'),
        'isSkipped': false,
        'movies': [],
        'theme': 'theme3',
      }, {
        'id': 'weekId2',
        'date': new Date('2021-01-08'),
        'isSkipped': false,
        'movies': [],
        'theme': 'theme2',
      }, {
        'id': 'weekId1',
        'date': new Date('2021-01-01'),
        'isSkipped': false,
        'movies': [],
        'theme': 'theme1',
      },
    ])
  })

  it('should call query with the correct parameters', async () => {
    const notion = new NotionAdapter()
    await notion.getWeeks()

    expect(notionMock.query).toHaveBeenCalledWith({
      database_id: 'DATABASE_ID',
      page_size: 100,
      filter: {
        property: 'Date',
        date: { is_not_empty: true },
      },
      sorts: [{
        property: 'Date',
        direction: 'ascending',
      }],
    })
  })
})

describe('setMovie', () => {
  it('should call the update method with the correct parameters', async () => {
    const movie = new Movie(
      'Movie Title',
      'Movie Director',
      2021,
      120,
      'Movie Url',
      'Movie Poster Url',
      1234,
      'notionId',
      'Theater',
      'Showing Url',
    )
    const notion = new NotionAdapter()
    await notion.setMovie(movie)

    expect(notionMock.update).toHaveBeenCalledWith(movie.toNotion())
  })
})