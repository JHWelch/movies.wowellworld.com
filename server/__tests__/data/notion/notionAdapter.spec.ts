import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import NotionAdapter from '@server/data/notion/notionAdapter'
import { NotionMock } from '@tests/support/notionMock'
import Movie from '@server/models/movie'
import { mockConfig } from '@tests/support/mockConfig'

let notionMock: NotionMock

beforeAll(() => {
  jest.mock('@notionhq/client')
  notionMock = new NotionMock()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getMovie', () => {
  beforeEach(() => {
    notionMock.mockRetrieve()
  })

  describe('when the movie exists', () => {
    beforeEach(() => {
      notionMock.mockIsFullPageOrDatabase(true)
    })

    it('should return the movie', async () => {
      const movie = await new NotionAdapter(mockConfig()).getMovie('movieId')

      expect(movie).toMatchObject({
        notionId: 'movieId',
        title: 'movieTitle',
        director: 'movieDirector',
        year: 2021,
        length: 120,
        time: '8:00 PM',
        url: 'movieUrl',
        posterPath: 'moviePosterPath',
        theaterName: 'movieTheaterName',
        showingUrl: 'movieShowingUrl',
        tmdbId: null,
      })
    })

    it ('calls the retrieve method with page_id', async () => {
      await new NotionAdapter(mockConfig()).getMovie('movieId')

      expect(notionMock.retrieve).toHaveBeenCalledWith({ 'page_id': 'movieId' })
    })
  })

  describe('returns not full page', () => {
    beforeEach(() => {
      notionMock.mockIsFullPageOrDatabase(false)
    })

    it('should throw an error', async () => {
      await expect(new NotionAdapter(mockConfig()).getMovie('movieId'))
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
      const notion = new NotionAdapter(mockConfig())
      const week = await notion.getWeek('2021-01-01')

      expect(week).toEqual({
        'date': new Date('2021-01-01'),
        'id': 'weekId',
        'isSkipped': false,
        'slug': null,
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
      const notion = new NotionAdapter(mockConfig())

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
    const notion = new NotionAdapter(mockConfig())
    const weeks = await notion.getWeeks()

    expect(weeks).toEqual([
      {
        'id': 'weekId3',
        'date': new Date('2021-01-15'),
        'isSkipped': false,
        'slug': null,
        'movies': [],
        'theme': 'theme3',
      }, {
        'id': 'weekId2',
        'date': new Date('2021-01-08'),
        'isSkipped': false,
        'slug': null,
        'movies': [],
        'theme': 'theme2',
      }, {
        'id': 'weekId1',
        'date': new Date('2021-01-01'),
        'isSkipped': false,
        'slug': null,
        'movies': [],
        'theme': 'theme1',
      },
    ])
  })

  it('should call query with the correct parameters', async () => {
    const notion = new NotionAdapter(mockConfig())
    await notion.getWeeks()

    expect(notionMock.query).toHaveBeenCalledWith({
      database_id: 'NOTION_WEEK_DATABASE_ID',
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
      '8:00 PM',
      'Movie Url',
      'Movie Poster Url',
      1234,
      'notionId',
      'Theater',
      'Showing Url',
    )
    const notion = new NotionAdapter(mockConfig())
    await notion.setMovie(movie)

    expect(notionMock.update).toHaveBeenCalledWith(movie.toNotion())
  })
})

describe('createMovie', () => {
  beforeEach(() => {
    notionMock.mockCreate('movieId')
  })

  it('should call the create method with the correct parameters', async () => {
    const notion = new NotionAdapter(mockConfig())
    await notion.createMovie('Movie Title')

    expect(notionMock.create).toHaveBeenCalledWith({
      parent: { database_id: 'NOTION_MOVIE_DATABASE_ID' },
      properties: {
        Title: { title: [{ text: { content: 'Movie Title' } }] },
      },
    })
  })

  it('should return the movie id', async () => {
    const notion = new NotionAdapter(mockConfig())

    const movieId = await notion.createMovie('Movie Title')

    expect(movieId).toEqual('movieId')
  })
})

describe('createWeek', () => {
  it('should call the create method with the correct parameters', async () => {
    const notion = new NotionAdapter(mockConfig())
    await notion.createWeek('Theme', ['movieId1', 'movieId2'], 'Anonymous')

    expect(notionMock.create).toHaveBeenCalledWith({
      parent: { database_id: 'NOTION_WEEK_DATABASE_ID' },
      properties: {
        Theme: { title: [{ text: { content: 'Theme' } }] },
        'Submitted By': { rich_text: [{ text: { content: 'Anonymous' } }] },
        Movies: { relation: [
          { id: 'movieId1' },
          { id: 'movieId2' },
        ] },
      },
    })
  })
})
