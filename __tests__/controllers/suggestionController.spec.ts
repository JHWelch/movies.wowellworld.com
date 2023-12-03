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
      { path: '/suggestions/create' }
    )
  })
})

describe('store', () => {
  it('should create a new week and movies', async () => {
    const req = getMockReq({
      body: {
        theme: 'theme',
        movies: [
          'movie1',
          'movie2',
        ],
      },
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
        Movies: {
          relation: [
            { id: 'movieId1' },
            { id: 'movieId2' },
          ],
        },
      },
    })
  })

  it('should return a 200 OK', async () => {
    const req = getMockReq({
      body: {
        theme: 'theme',
        movies: [
          'movie1',
          'movie2',
        ],
      },
    })
    notionMock.mockCreate('movieId1', 'movieId2')

    await newSuggestionController().store(req, res)

    expect(res.sendStatus).toHaveBeenCalledWith(201)
  })
})
