import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import MovieController from '@server/controllers/movieController'
import { Request } from 'express'
import { TmdbMock } from '@tests/support/tmdbMock'
import { mockFetch } from '@tests/support/fetchMock'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import { mockConfig } from '@tests/support/mockConfig'
import MovieFactory from '@tests/support/factories/movieFactory'
import { posterUrl } from '@server/data/tmdb/helpers'

const { res, mockClear } = getMockRes()
let req: Request

const newMovieController = () => {
  const config = mockConfig()
  const tmdbAdapter = new TmdbAdapter(config)

  return new MovieController(tmdbAdapter)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockClear()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('show', () => {
  beforeEach(() => {
    req = getMockReq()
  })

  describe('movies found', () => {
    it('returns a list of searched movies', async () => {
      const movie1 = new MovieFactory().make({
        title: 'Movie Title 1',
        year: 2021,
        tmdbId: 1234,
        posterPath: '/path/to/poster1.jpg',
      })
      const movie2 = new MovieFactory().make({
        title: 'Movie Title 2',
        year: 2022,
        tmdbId: 5678,
        posterPath: '/path/to/poster2.jpg',
      })
      const tmdbMock = new TmdbMock(mockFetch())
      tmdbMock.mockSearchMovie([movie1, movie2])

      req.query = { search: 'Movie Title' }
      await newMovieController().show(req, res)

      expect(res.json).toHaveBeenCalledWith({ movies: [
        {
          title: 'Movie Title 1',
          year: 2021,
          tmdbId: 1234,
          posterPath: posterUrl('/path/to/poster1.jpg', 'w154'),
        },
        {
          title: 'Movie Title 2',
          year: 2022,
          tmdbId: 5678,
          posterPath: posterUrl('/path/to/poster2.jpg', 'w154'),
        },
      ] })
    })
  })

  describe('no search provided', () => {
    it('returns a 400 error', async () => {
      req.query = {}
      await newMovieController().show(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'No search query provided' })
    })
  })
})
