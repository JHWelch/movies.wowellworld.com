import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import TmdbAdapter from '../../../src/data/tmdb/tmdbAdapter'
import Movie from '../../../src/models/movie'
import { TmdbMock } from '../../support/tmdbMock'
import { mockFetch } from '../../support/fetchMock'
import { mockConfig } from '../../support/mockConfig'

let tmdbMock: TmdbMock

beforeAll(() => {
  tmdbMock = new TmdbMock(mockFetch())
})

describe('getMovie', () => {
  let tmdbAdapter: TmdbAdapter

  beforeEach(() => {
    tmdbAdapter = new TmdbAdapter(mockConfig())
  })

  it('should return a movie', async () => {
    const expected = new Movie(
      'movie title',
      'director',
      2001,
      90,
      'https://www.themoviedb.org/movie/1234',
      '/posterPath.jpg',
      1234,
    )
    tmdbMock.mockSearchMovie(expected)
    tmdbMock.mockMovieDetails(expected)

    const movie = await tmdbAdapter.getMovie('movie title')

    expect(movie).toEqual(expected)
  })

  describe('when movie is not found', () => {
    it('should return undefined', async () => {
      tmdbMock.mockSearchMovie(undefined)

      const movie = await tmdbAdapter.getMovie('movie title')

      expect(movie).toBeUndefined()
    })
  })
})
