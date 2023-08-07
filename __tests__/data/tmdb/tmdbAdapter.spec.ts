import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import TmdbAdapter from '../../../src/data/tmdb/tmdbAdapter'
import Movie from '../../../src/models/movie'

const mockGetMovie = (movie: Movie, id = 1234) => {
  new Response()
  global.fetch = jest.fn(async () => new Response(JSON.stringify({
    page: 1,
    results: [
      {
        adult: false,
        backdrop_path: '/2FonLz0RPxbBriOlZ9mWhYdlqCp.jpg',
        genre_ids: [ 35, 10749 ],
        id: id,
        original_language: 'en',
        original_title: movie.title,
        overview: 'Shallow, rich and socially successful Cher is at the top of her Beverly Hills high school\'s pecking scale. Seeing herself as a matchmaker, Cher first coaxes two teachers into dating each other. Emboldened by her success, she decides to give hopelessly klutzy new student Tai a makeover. When Tai becomes more popular than she is, Cher realizes that her disapproving ex-stepbrother was right about how misguided she was -- and falls for him.',
        popularity: 32.244,
        poster_path: movie.posterUrl,
        release_date: `${movie.year}-07-19`,
        title: movie.title,
        video: false,
        vote_average: 7.282,
        vote_count: 3953,
      },
    ],
    total_pages: 1,
    total_results: 9,
  })))
}

describe('getMovie', () => {
  let tmdbAdapter: TmdbAdapter

  beforeEach(() => {
    tmdbAdapter = new TmdbAdapter()
  })

  it('should return a movie', async () => {
    const expected = new Movie(
      '1234',
      'movie title',
      'director',
      2001,
      90,
      'https://www.themoviedb.org/movie/1234',
      'http://example.com/movie.jpg',
    )
    mockGetMovie(expected)
    const movie = await tmdbAdapter.getMovie('movie title')

    expect(movie).toEqual(expected)
  })
})
