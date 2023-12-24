import SuggestionController from '../../src/controllers/suggestionController'
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import NotionAdapter from '../../src/data/notion/notionAdapter'
import { mockConfig } from '../support/mockConfig'
import { NotionMock } from '../support/notionMock'

const { res, mockClear } = getMockRes()

let notionMock: NotionMock

beforeAll(() => {
  jest.mock('@notionhq/client')
  notionMock = new NotionMock()
})

beforeEach(() => {
  mockClear()
})

const newSuggestionController = () => {
  const config = mockConfig()
  const notion = new NotionAdapter(config)

  return new SuggestionController(notion)
}

describe('create', () => {
  it('should render create view', async () => {
    const req = getMockReq()

    await newSuggestionController().create(req, res)

    expect(res.render).toHaveBeenCalledWith(
      'suggestions/create',
      { path: '/suggestions/create' },
    )
  })
})

interface MockBodyArgs {
  theme?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  submitted_by?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  movies?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const mockBody = ({
  theme = 'theme',
  submitted_by = 'submitted_by',
  movies = [
    'movie1',
    'movie2',
  ],
}: MockBodyArgs = {}) => ({ theme, submitted_by, movies })

describe('store', () => {
  it('should create a new week and movies', async () => {
    const req = getMockReq({
      body: mockBody(),
    })

    notionMock.mockCreate('movieId1', 'movieId2')

    await newSuggestionController().store(req, res)

    expect(notionMock.create).toHaveBeenCalledWith({
      parent: { database_id: 'NOTION_MOVIE_DATABASE_ID' },
      properties: {
        Title: { title: [{ text: { content: 'movie1' } }] },
      },
    })
    expect(notionMock.create).toHaveBeenCalledWith({
      parent: { database_id: 'NOTION_MOVIE_DATABASE_ID' },
      properties: {
        Title: { title: [{ text: { content: 'movie2' } }] },
      },
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
            '',
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
