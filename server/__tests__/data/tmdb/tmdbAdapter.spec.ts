import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import { Movie } from '@server/models/movie'
import { TmdbMock } from '@tests/support/tmdbMock'
import { mockFetch } from '@tests/support/fetchMock'
import { mockConfig } from '@tests/support/mockConfig'

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
    const expected = new Movie({
      title: 'movie title',
      director: 'director',
      year: 2001,
      length: 90,
      url: 'https://www.themoviedb.org/movie/1234',
      posterPath: '/posterPath.jpg',
      tmdbId: 1234,
    })
    tmdbMock.mockSearchMovie(expected)
    tmdbMock.mockMovieDetails(expected)

    const movie = await tmdbAdapter.getMovie('movie title')

    expect(movie?.toDTO()).toMatchObject(expected.toDTO())
  })

  describe('when movie is not found', () => {
    it('should return undefined', async () => {
      tmdbMock.mockSearchMovie(undefined)

      const movie = await tmdbAdapter.getMovie('movie title')

      expect(movie).toBeUndefined()
    })
  })
})
