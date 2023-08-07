import { describe, expect, it } from '@jest/globals'
import MovieResponse from '../../../../src/data/tmdb/dtos/movieResponse'

describe('fromTmdbResponse', () => {
  it('should assign all fields correctly from search', () => {
    const response = MovieResponse.fromTmdbResponse({
      adult: false,
      backdrop_path: '/2FonLz0RPxbBriOlZ9mWhYdlqCp.jpg',
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
    expect(response.crew).toEqual([])
  })


  it('should assign all fields correctly', () => {
    const response = MovieResponse.fromTmdbResponse({
      adult: false,
      backdrop_path: '/2FonLz0RPxbBriOlZ9mWhYdlqCp.jpg',
      belongs_to_collection: null,
      budget: 12000000,
      genres: [
        {
          id: 35,
          name: 'Comedy',
        },
        {
          id: 10749,
          name: 'Romance',
        },
      ],
      homepage: '',
      id: 9603,
      imdb_id: 'tt0112697',
      original_language: 'en',
      original_title: 'Clueless',
      overview: 'Shallow, rich and socially successful Cher is at the top of her Beverly Hills high school\'s pecking scale. Seeing herself as a matchmaker, Cher first coaxes two teachers into dating each other. Emboldened by her success, she decides to give hopelessly klutzy new student Tai a makeover. When Tai becomes more popular than she is, Cher realizes that her disapproving ex-stepbrother was right about how misguided she was -- and falls for him.',
      popularity: 32.244,
      poster_path: '/8AwVTcgpTnmeOs4TdTWqcFDXEsA.jpg',
      production_companies: [
        {
          id: 4,
          logo_path: '/gz66EfNoYPqHTYI4q9UEN4CbHRc.png',
          name: 'Paramount',
          origin_country: 'US',
        },
      ],
      production_countries: [
        {
          iso_3166_1: 'US',
          name: 'United States of America',
        },
      ],
      release_date: '1995-07-19',
      revenue: 56631572,
      runtime: 97,
      spoken_languages: [
        {
          english_name: 'Spanish',
          iso_639_1: 'es',
          name: 'Español',
        },
        {
          english_name: 'English',
          iso_639_1: 'en',
          name: 'English',
        },
      ],
      status: 'Released',
      tagline: 'Sex. Clothes. Popularity. Is there a problem here?',
      title: 'Clueless',
      video: false,
      vote_average: 7.282,
      vote_count: 3953,
      credits: {
        cast: [
          {
            adult: false,
            gender: 1,
            id: 5588,
            known_for_department: 'Acting',
            name: 'Alicia Silverstone',
            original_name: 'Alicia Silverstone',
            popularity: 23.419,
            profile_path: '/pyxqkP4i0ubVdoRe5hoiiiwkHkb.jpg',
            cast_id: 8,
            character: 'Cher Horowitz',
            credit_id: '52fe4510c3a36847f80ba283',
            order: 0,
          },
          {
            adult: false,
            gender: 1,
            id: 58150,
            known_for_department: 'Acting',
            name: 'Stacey Dash',
            original_name: 'Stacey Dash',
            popularity: 9.118,
            profile_path: '/mn9QUB95Hxkk5hVjKTZlSAMWGin.jpg',
            cast_id: 9,
            character: 'Dionne Davenport',
            credit_id: '52fe4510c3a36847f80ba287',
            order: 1,
          },
        ],
        crew: [
          {
            adult: false,
            gender: 2,
            id: 2997,
            known_for_department: 'Production',
            name: 'Scott Rudin',
            original_name: 'Scott Rudin',
            popularity: 1.247,
            profile_path: '/zIeKeFgBERBHmabgmqZFmgcxqvO.jpg',
            credit_id: '52fe4510c3a36847f80ba273',
            department: 'Production',
            job: 'Producer',
          },
          {
            adult: false,
            gender: 0,
            id: 7240,
            known_for_department: 'Sound',
            name: 'Cary Weitz',
            original_name: 'Cary Weitz',
            popularity: 0.694,
            profile_path: null,
            credit_id: '60db8cc4a12856005eaa867f',
            department: 'Sound',
            job: 'Boom Operator',
          },
          {
            adult: false,
            gender: 1,
            id: 57434,
            known_for_department: 'Directing',
            name: 'Amy Heckerling',
            original_name: 'Amy Heckerling',
            popularity: 7.914,
            profile_path: '/hIc3bQxLOPAcpGJ1CVFuzpzJRZ0.jpg',
            credit_id: '52fe4510c3a36847f80ba261',
            department: 'Directing',
            job: 'Director',
          },
        ],
      },
    })

    expect(response.adult).toEqual(false)
    expect(response.backdropPath).toEqual('/2FonLz0RPxbBriOlZ9mWhYdlqCp.jpg')
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
