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
      const movie = new MovieFactory().make()
      const tmdbMock = new TmdbMock(mockFetch())
      tmdbMock.mockSearchMovie(movie)

      req.query = { search: movie.title }
      await newMovieController().show(req, res)

      expect(res.json).toHaveBeenCalledWith({ movies: [{
        title: movie.title,
        year: movie.year,
        tmdbId: movie.tmdbId,
        posterPath: movie.posterPath,
      }] })
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
