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
import { mockConfig } from '@tests/support/mockConfig'
import MovieFactory from '@tests/support/factories/movieFactory'
import { RichText } from '@shared/dtos'
import { DateTime } from 'luxon'

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

      expect(notionMock.retrieve).toHaveBeenCalledWith({ page_id: 'movieId' })
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
      NotionMock.mockWeek({ id: 'weekId', date: '2021-01-01', theme: 'weekTheme' }),
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
        date: DateTime.fromISO('2021-01-01', { zone: 'America/Chicago' }),
        id: 'weekId',
        isSkipped: false,
        slug: null,
        movies: [],
        theme: 'weekTheme',
        styledTheme: [],
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
  const styled: RichText[] = [
    {
      type: 'text',
      text: {
        content: 'week',
        link: null,
      },
      annotations: {
        bold: true,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default',
      },
      plain_text: 'week',
      href: null,
    },
    {
      type: 'text',
      text: {
        content: 'id 3',
        link: null,
      },
      annotations: {
        bold: false,
        italic: true,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'red',
      },
      plain_text: 'id 3',
      href: null,
    },
  ]
  beforeEach(() => {
    notionMock.mockIsFullPageOrDatabase(true)
    notionMock.mockQuery([
      NotionMock.mockWeek({
        id: 'weekId3',
        date: '2021-01-15',
        theme: 'theme3',
      }),
      NotionMock.mockWeek({
        id: 'weekId2',
        date: '2021-01-08',
        theme: 'theme2',
        skipped: true,
      }),
      NotionMock.mockWeek({
        id: 'weekId1',
        date: '2021-01-01',
        theme: 'theme1',
        slug: 'weekSlug',
        styledTheme: styled,
      }),
    ])
  })

  it('should return the weeks', async () => {
    const notion = new NotionAdapter(mockConfig())
    const weeks = await notion.getWeeks()

    expect(weeks).toEqual([
      {
        id: 'weekId3',
        date: DateTime.fromISO('2021-01-15', { zone: 'America/Chicago' }),
        isSkipped: false,
        slug: null,
        movies: [],
        theme: 'theme3',
        styledTheme: [],
      }, {
        id: 'weekId2',
        date: DateTime.fromISO('2021-01-08', { zone: 'America/Chicago' }),
        isSkipped: true,
        slug: null,
        movies: [],
        theme: 'theme2',
        styledTheme: [],
      }, {
        id: 'weekId1',
        date: DateTime.fromISO('2021-01-01', { zone: 'America/Chicago' }),
        isSkipped: false,
        slug: 'weekSlug',
        movies: [],
        theme: 'theme1',
        styledTheme: styled,
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
    const movie = new MovieFactory().make()
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
