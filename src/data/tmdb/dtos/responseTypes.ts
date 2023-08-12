export type MovieResponseTmdb = {
  adult: boolean,
  backdrop_path: string | null,
  id: number,
  original_language: string,
  original_title: string,
  overview: string,
  popularity: number,
  poster_path: string | null,
  release_date: string,
  title: string,
  video: boolean,
  vote_average: number,
  vote_count: number,
  credits: {
    crew: CrewResponseTmdb[]
  } | undefined,
  runtime: number | null | undefined,
}

export type CrewResponseTmdb = {
  name: string,
  job: string,
}

type CreditsTmdb = {
  crew: CrewResponseTmdb[]
}

export function isMovieResponseTmdb(movie: unknown): movie is MovieResponseTmdb {
  return (
    !!movie &&
    typeof movie === 'object' &&
    'adult' in movie &&
    'backdrop_path' in movie &&
    'id' in movie &&
    'original_language' in movie &&
    'original_title' in movie &&
    'overview' in movie &&
    'popularity' in movie &&
    'poster_path' in movie &&
    'release_date' in movie &&
    'title' in movie &&
    'video' in movie &&
    'vote_average' in movie &&
    'vote_count' in movie &&
    (!('credits' in movie) || isCreditsTmdb(movie.credits)) &&
    typeof movie.adult === 'boolean' &&
    (typeof movie.backdrop_path === 'string' || movie.backdrop_path === null) &&
    typeof movie.id === 'number' &&
    typeof movie.original_language === 'string' &&
    typeof movie.original_title === 'string' &&
    typeof movie.overview === 'string' &&
    typeof movie.popularity === 'number' &&
    (typeof movie.poster_path === 'string' || movie.poster_path === null) &&
    typeof movie.release_date === 'string' &&
    typeof movie.title === 'string' &&
    typeof movie.video === 'boolean' &&
    typeof movie.vote_average === 'number' &&
    typeof movie.vote_count === 'number' &&
    (!('runtime' in movie) || typeof movie.runtime === 'number' || movie.runtime === null)
  )
}

function isCreditsTmdb(credits: unknown): credits is CreditsTmdb {
  return (
    !!credits &&
    typeof credits === 'object' &&
    'crew' in credits &&
    Array.isArray(credits.crew) &&
    credits.crew.reduce((acc: boolean, crew: unknown) => acc && isCrewResponseTmdb(crew), true)
  )
}

export function isCrewResponseTmdb(crew: unknown): crew is CrewResponseTmdb {
  return (
    !!crew &&
    typeof crew === 'object' &&
    'name' in crew &&
    'job' in crew &&
    typeof crew.name === 'string' &&
    typeof crew.job === 'string'
  )
}
