import { describe, expect, it, test } from '@jest/globals'
import Movie from '../../src/models/movie'
import { MovieFactory } from '../support/factories/movieFactory'
import { TMDB_POSTER_URL } from '../../src/data/tmdb/constants'

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
      'Movie Url',
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
        URL: { url: movie.url },
        Poster: { url: movie.posterPath },
        'Theater Name': { rich_text: [
          { text: { content: movie.theaterName } },
        ] },
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
        'Movie Url',
        'Movie Poster Url',
        1234,
        null,
        'Theater',
        'Showing Url',
      )

      expect(() => movie.toNotion())
        .toThrowError('Movie does not have notionId')
    })
  })
})

describe('toDTO', () => {
  it('should return a DTO', () => {
    const movie = new MovieFactory().make()

    expect(movie.toDTO()).toEqual({
      title: movie.title,
      director: movie.director,
      year: movie.year,
      length: movie.length,
      url: movie.url,
      posterPath: movie.posterPath,
      theaterName: movie.theaterName,
      showingUrl: movie.showingUrl,
      isFieldTrip: true,
      displayLength: '1h 30m',
    })
  })

  describe('No showingUrl or theaterName', () => {
    it('marks isFieldTrip as false', () => {
      const movie = new MovieFactory().state({
        showingUrl: null,
        theaterName: null,
      }).make()

      expect(movie.toDTO()).toEqual({
        title: movie.title,
        director: movie.director,
        year: movie.year,
        length: movie.length,
        url: movie.url,
        posterPath: movie.posterPath,
        theaterName: null,
        showingUrl: movie.showingUrl,
        isFieldTrip: false,
        displayLength: '1h 30m',
      })
    })
  })
})

describe('posterUrl', () => {
  it('appends the posterPath to the base url', () => {
    const movie = new MovieFactory().make()

    expect(movie.posterUrl()).toEqual(
      `${TMDB_POSTER_URL}${movie.posterPath}`
    )
  })

  describe('posterPath is null', () => {
    it('returns an empty string', () => {
      const movie = new MovieFactory().state({ posterPath: null }).make()

      expect(movie.posterUrl()).toEqual('')
    })
  })
})
