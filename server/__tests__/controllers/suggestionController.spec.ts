import SuggestionController from '@server/controllers/suggestionController'
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import NotionAdapter from '@server/data/notion/notionAdapter'
import { mockConfig } from '@tests/support/mockConfig'
import { NotionMock } from '@tests/support/notionMock'
import { Movie } from '@server/models/movie'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import { TmdbMock } from '@tests/support/tmdbMock'
import { mockFetch } from '@tests/support/fetchMock'
import MovieFactory from '@tests/support/factories/movieFactory'
import { TMDB_MOVIE_URL } from '@server/data/tmdb/constants'

const { res, mockClear } = getMockRes()

let notionMock: NotionMock

beforeAll(() => {
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')
  jest.mock('firebase/firestore')
  jest.mock('@notionhq/client')
  notionMock = new NotionMock()
})

beforeEach(() => {
  mockClear()
})

const newSuggestionController = () => {
  const config = mockConfig()
  const notion = new NotionAdapter(config)
  const tmdb = new TmdbAdapter(config)

  return new SuggestionController(notion, tmdb)
}

interface MockBodyArgs {
  theme?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  submitted_by?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  movies?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const mockBody = ({
  theme = 'theme',
  submitted_by = 'submitted_by',
  movies = [
    { title: 'movie1' },
    { title: 'movie2' },
  ],
}: MockBodyArgs = {}) => ({ theme, submitted_by, movies })

describe('store', () => {
  it('should create a new event and movies', async () => {
    const req = getMockReq({
      body: mockBody(),
    })

    notionMock.mockCreate('movieId1', 'movieId2')

    await newSuggestionController().store(req, res)

    expect(notionMock.create).toHaveBeenCalledWith({
      parent: { database_id: 'NOTION_MOVIE_DATABASE_ID' },
      properties: new Movie({ title: 'movie1' }).notionProperties(),
    })
    expect(notionMock.create).toHaveBeenCalledWith({
      parent: { database_id: 'NOTION_MOVIE_DATABASE_ID' },
      properties: new Movie({ title: 'movie2' }).notionProperties(),
    })
    expect(notionMock.create).toHaveBeenCalledWith({
      parent: { database_id: 'NOTION_WEEK_DATABASE_ID' },
      properties: {
        Theme: { title: [{ text: { content: 'theme' } }] },
        'Submitted By': { rich_text: [{ text: { content: 'submitted_by' } }] },
        Movies: {
          relation: [
            { id: 'movieId1' },
            { id: 'movieId2' },
          ],
        },
      },
    })
  })

  it('should return a 201 Created', async () => {
    const req = getMockReq({ body: mockBody() })
    notionMock.mockCreate('movieId1', 'movieId2')

    await newSuggestionController().store(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Successfully created suggestion.',
    })
  })

  describe('movie id is provided', () => {
    let body: MockBodyArgs
    let movie1: Movie
    let movie2: Movie

    beforeEach(() => {
      body = mockBody()
      body.movies[0].id = 123
      body.movies[1].id = 456
      const tmdbMock = new TmdbMock(mockFetch())

      movie1 = new MovieFactory().tmdbFields().make({
        title: 'movie1',
        tmdbId: 123,
        url: `${TMDB_MOVIE_URL}/123`,
      })
      movie2 = new MovieFactory().tmdbFields().make({
        title: 'movie2',
        tmdbId: 456,
        url: `${TMDB_MOVIE_URL}/456`,
      })
      tmdbMock.mockMovieDetails(movie1, 123)
      tmdbMock.mockMovieDetails(movie2, 456)
    })

    it('should create a new event and movies', async () => {
      const req = getMockReq({ body })

      notionMock.mockCreate('movieId1', 'movieId2')

      await newSuggestionController().store(req, res)

      expect(notionMock.create).toHaveBeenCalledWith({
        parent: { database_id: 'NOTION_MOVIE_DATABASE_ID' },
        properties: movie1.notionProperties(),
      })
      expect(notionMock.create).toHaveBeenCalledWith({
        parent: { database_id: 'NOTION_MOVIE_DATABASE_ID' },
        properties: movie2.notionProperties(),
      })
      expect(notionMock.create).toHaveBeenCalledWith({
        parent: { database_id: 'NOTION_WEEK_DATABASE_ID' },
        properties: {
          Theme: { title: [{ text: { content: 'theme' } }] },
          'Submitted By': { rich_text: [{ text: { content: 'submitted_by' } }] },
          Movies: {
            relation: [
              { id: 'movieId1' },
              { id: 'movieId2' },
            ],
          },
        },
      })
    })
  })

  describe('theme is missing', () => {
    it('should return a 422', async () => {
      const body = mockBody()
      delete body.theme
      const req = getMockReq({ body })

      await newSuggestionController().store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { theme: 'Required' },
      })
    })
  })

  describe('movies is missing', () => {
    it('should return a 422', async () => {
      const body = mockBody()
      delete body.movies
      const req = getMockReq({ body })

      await newSuggestionController().store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { movies: 'Required' },
      })
    })
  })

  describe('movies is empty', () => {
    it('should return a 422', async () => {
      const req = getMockReq({
        body: mockBody({
          movies: [],
        }),
      })

      await newSuggestionController().store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { movies: 'Required' },
      })
    })
  })

  describe('movie is empty string', () => {
    it('should return a 422', async () => {
      const req = getMockReq({
        body: mockBody({
          movies: [
            { title: '' },
          ],
        }),
      })

      await newSuggestionController().store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { movies: 'Required' },
      })
    })
  })

  describe('submitted_by is missing', () => {
    it('should return a 422', async () => {
      const body = mockBody()
      delete body.submitted_by
      const req = getMockReq({ body })

      await newSuggestionController().store(req, res)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({
        errors: { submitted_by: 'Required' },
      })
    })
  })
})
