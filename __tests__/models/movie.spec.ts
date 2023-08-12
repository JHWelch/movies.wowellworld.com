import { describe, expect, it, test } from '@jest/globals'
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

describe('toNotion', () => {
  it('returns a notion update object', () => {
    const movie = new Movie(
      'Movie Title',
      'Movie Director',
      2021,
      120,
      'Movie Imdb Url',
      'Movie Poster Url',
      1234,
      'notionId',
      'Theater',
      'Showing Url',
    )

    expect(movie.toNotion()).toEqual({
      page_id: movie.notionId,
      properties: {
        Title: { title: [{ text: { content: movie.title } }] },
        Director: { rich_text: [{ text: { content: movie.director } }] },
        Year: { number: movie.year },
        'Length (mins)': { number: movie.length },
        IMDb: { url: movie.imdbUrl },
        Poster: { url: movie.posterUrl },
        'Theater Name': { rich_text: [{ text: { content: movie.theaterName } }] },
        'Showing URL': { url: movie.showingUrl },
      },
    })
  })

  describe('movie does not have notionId', () => {
    it('should throw an error', async () => {
      const movie = new Movie(
        'Movie Title',
        'Movie Director',
        2021,
        120,
        'Movie Imdb Url',
        'Movie Poster Url',
        1234,
        null,
        'Theater',
        'Showing Url',
      )

      expect(() => movie.toNotion()).toThrowError('Movie does not have notionId')
    })
  })
})
