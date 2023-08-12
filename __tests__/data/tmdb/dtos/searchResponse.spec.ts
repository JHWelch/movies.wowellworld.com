import { describe, expect, it } from '@jest/globals'
import SearchResponse from '../../../../src/data/tmdb/dtos/searchResponse'
import MovieResponse from '../../../../src/data/tmdb/dtos/movieResponse'

describe('fromTmdbResponse', () => {
  it('should assign all fields correctly', () => {
    const input = {
      page: 1,
      results: [
        {
          adult: false,
          backdrop_path: '/2FonLz0RPxbBriOlZ9mWhYdlqCp.jpg',
          genre_ids: [
            35,
            10749,
          ],
          id: 9603,
          original_language: 'en',
          original_title: 'Clueless',
          overview: 'Shallow, rich and socially successful Cher is at the top of her Beverly Hills high school\'s pecking scale. Seeing herself as a matchmaker, Cher first coaxes two teachers into dating each other. Emboldened by her success, she decides to give hopelessly klutzy new student Tai a makeover. When Tai becomes more popular than she is, Cher realizes that her disapproving ex-stepbrother was right about how misguided she was -- and falls for him.',
          popularity: 32.244,
          poster_path: '/8AwVTcgpTnmeOs4TdTWqcFDXEsA.jpg',
          release_date: '1995-07-19',
          title: 'Clueless',
          video: false,
          vote_average: 7.282,
          vote_count: 3953,
        },
        {
          adult: false,
          backdrop_path: null,
          genre_ids: [],
          id: 556767,
          original_language: 'en',
          original_title: 'Clueless',
          overview: 'A remake of the 1995 film.',
          popularity: 0.6,
          poster_path: null,
          release_date: '',
          title: 'Clueless',
          video: false,
          vote_average: 0,
          vote_count: 0,
        },
        {
          adult: false,
          backdrop_path: '/oRLTORPsK43SfQvLpaLLghmKdhf.jpg',
          genre_ids: [
            9648,
            53,
            18,
          ],
          id: 939992,
          original_language: 'en',
          original_title: 'Clueless',
          overview: 'A group of friends start playing a board game towards the end of summer. Things start looking deadly though when they start dying off and they have to figure out how they’re being killed and who among them is committing murder.',
          popularity: 0.6,
          poster_path: '/3i2BSjjzotn40nRFGUlsQa7o7P6.jpg',
          release_date: '2021-09-10',
          title: 'Clueless',
          video: false,
          vote_average: 0,
          vote_count: 0,
        },
      ],
      total_pages: 2,
      total_results: 3,
    }
    const response = SearchResponse.fromTmdbResponse(input)

    expect(response.page).toBe(1)
    expect(response.totalPages).toBe(2)
    expect(response.totalResults).toBe(3)
    expect(response.results).toEqual([
      new MovieResponse(
        false,
        '/2FonLz0RPxbBriOlZ9mWhYdlqCp.jpg',
        9603,
        'en',
        'Clueless',
        'Shallow, rich and socially successful Cher is at the top of her Beverly Hills high school\'s pecking scale. Seeing herself as a matchmaker, Cher first coaxes two teachers into dating each other. Emboldened by her success, she decides to give hopelessly klutzy new student Tai a makeover. When Tai becomes more popular than she is, Cher realizes that her disapproving ex-stepbrother was right about how misguided she was -- and falls for him.',
        32.244,
        '/8AwVTcgpTnmeOs4TdTWqcFDXEsA.jpg',
        '1995-07-19',
        'Clueless',
        false,
        7.282,
        3953,
      ),
      new MovieResponse(
        false,
        null,
        556767,
        'en',
        'Clueless',
        'A remake of the 1995 film.',
        0.6,
        null,
        '',
        'Clueless',
        false,
        0,
        0,
      ),
      new MovieResponse(
        false,
        '/oRLTORPsK43SfQvLpaLLghmKdhf.jpg',
        939992,
        'en',
        'Clueless',
        'A group of friends start playing a board game towards the end of summer. Things start looking deadly though when they start dying off and they have to figure out how they’re being killed and who among them is committing murder.',
        0.6,
        '/3i2BSjjzotn40nRFGUlsQa7o7P6.jpg',
        '2021-09-10',
        'Clueless',
        false,
        0,
        0,
      ),
    ])
  })
})
