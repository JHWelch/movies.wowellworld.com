import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import TmdbAdapter from '../../../src/data/tmdb/tmdbAdapter'
import Movie from '../../../src/models/movie'
import { TmdbMock } from '../../support/tmdbMock'
import { mockFetch } from '../../support/fetchMock'

let tmdbMock: TmdbMock

beforeAll(() => {
  tmdbMock = new TmdbMock(mockFetch())
})

describe('getMovie', () => {
  let tmdbAdapter: TmdbAdapter

  beforeEach(() => {
    tmdbAdapter = new TmdbAdapter()
  })

  it('should return a movie', async () => {
    const expected = new Movie(
      'movie title',
      'director',
      2001,
      90,
      'https://www.themoviedb.org/movie/1234',
      'http://example.com/movie.jpg',
      '1234',
    )
    tmdbMock.mockSearchMovie(expected)
    tmdbMock.mockMovieDetails(expected)

    const movie = await tmdbAdapter.getMovie('movie title')

    expect(movie).toEqual(expected)
  })
})
