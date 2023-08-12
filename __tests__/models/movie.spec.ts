import { describe, expect, test } from '@jest/globals'
import Movie from '../../src/models/movie'

describe('merge', () => {
  test('only null/undefined fields are overwritten by merge', () => {
    const movieA = new Movie('Title', null, 2004, 120)
    const movieB = new Movie (
      'Title',
      'Director',
      2001,
      null,
      'https://www.themoviedb.org/movie/1234',
      'https://image.tmdb.org/t/p/original/poster.jpg',
      1234,
    )

    movieA.merge(movieB)

    expect(movieA).toEqual(new Movie(
      'Title',
      'Director',
      2004,
      120,
      'https://www.themoviedb.org/movie/1234',
      'https://image.tmdb.org/t/p/original/poster.jpg',
      1234,
    ))
  })
})
