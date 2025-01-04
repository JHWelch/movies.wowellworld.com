import { Movie } from '@server/models/movie'
import { MockFetch } from '@tests/support/fetchMock'

export class TmdbMock {
  constructor (
    private mockFetch: MockFetch,
  ) {}

  mockSearchMovie (movie?: Movie | Movie[]) {
    const movies = movie ? [movie].flat() : []
    this.mockFetch
      .mockImplementationOnce(async () => new Response(JSON.stringify({
        page: 1,
        results: movies.map(movie => ({
          id: movie.tmdbId,
          original_title: movie.title,
          poster_path: movie.posterPath,
          release_date: `${movie.year}-07-19`,
          title: movie.title,
          adult: false,
          backdrop_path: '/2FonLz0RPxbBriOlZ9mWhYdlqCp.jpg',
          genre_ids: [ 35, 10749 ],
          original_language: 'en',
          overview: 'Shallow, rich and socially successful Cher is at the...',
          popularity: 32.244,
          video: false,
          vote_average: 7.282,
          vote_count: 3953,
        })),
        total_pages: 1,
        total_results: movies.length,
      })))
  }

  mockMovieDetails = (movie: Movie, id = 1234) => {
    this.mockFetch
      .mockImplementationOnce(async () => new Response(JSON.stringify({
        id: id,
        original_title: movie.title,
        poster_path: movie.posterPath,
        release_date: `${movie.year}-07-19`,
        title: movie.title,
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
        imdb_id: 'tt0112697',
        original_language: 'en',
        overview: 'Shallow, rich and socially successful Cher is at the...',
        popularity: 32.244,
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
        revenue: 56631572,
        runtime: movie.length,
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
              name: movie.director,
              original_name: movie.director,
              popularity: 7.914,
              profile_path: '/hIc3bQxLOPAcpGJ1CVFuzpzJRZ0.jpg',
              credit_id: '52fe4510c3a36847f80ba261',
              department: 'Directing',
              job: 'Director',
            },
          ],
        },
      })))
  }
}
