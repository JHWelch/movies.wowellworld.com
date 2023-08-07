import { describe, expect, it } from '@jest/globals'
import MovieResponse from '../../../../src/data/tmdb/dtos/movieResponse'

describe('fromTmdbResponse', () => {
  it('should assign all fields correctly', () => {
    const response = MovieResponse.fromTmdbResponse({
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
    })

    expect(response.adult).toEqual(false)
    expect(response.backdropPath).toEqual('/2FonLz0RPxbBriOlZ9mWhYdlqCp.jpg')
    expect(response.genreIds).toEqual([ 35, 10749 ])
    expect(response.id).toEqual(9603)
    expect(response.originalLanguage).toEqual('en')
    expect(response.originalTitle).toEqual('Clueless')
    expect(response.overview).toEqual('Shallow, rich and socially successful Cher is at the top of her Beverly Hills high school\'s pecking scale. Seeing herself as a matchmaker, Cher first coaxes two teachers into dating each other. Emboldened by her success, she decides to give hopelessly klutzy new student Tai a makeover. When Tai becomes more popular than she is, Cher realizes that her disapproving ex-stepbrother was right about how misguided she was -- and falls for him.')
    expect(response.popularity).toEqual(32.244)
    expect(response.posterPath).toEqual('/8AwVTcgpTnmeOs4TdTWqcFDXEsA.jpg')
    expect(response.releaseDate).toEqual('1995-07-19')
    expect(response.title).toEqual('Clueless')
    expect(response.video).toEqual(false)
    expect(response.voteAverage).toEqual(7.282)
    expect(response.voteCount).toEqual(3953)
  })
})
