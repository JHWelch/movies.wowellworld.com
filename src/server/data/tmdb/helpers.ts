import { Width } from '@server/types/tmdb'
import { TMDB_POSTER_URL } from '@server/data/tmdb/constants'

const tmdbUrl = (width: Width): string =>
  TMDB_POSTER_URL + width

export const posterUrl = (
  posterPath: string | null,
  width: Width = 'w500',
): string => {
  if (!posterPath){
    return ''
  }

  if (posterPath.startsWith('/events/')) {
    return posterPath
  }

  return `${tmdbUrl(width)}${posterPath}`
}
