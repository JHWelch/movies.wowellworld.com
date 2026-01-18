import { describe, expect, it } from 'vitest'
import { TMDB_POSTER_URL } from '@server/data/tmdb/constants'
import { posterUrl } from '@server/data/tmdb/helpers'

describe('posterUrl', () => {
  it('appends the posterPath to the base url with 500 width', () => {
    expect(posterUrl('/imagePath.png')).toEqual(
      `${TMDB_POSTER_URL}w500/imagePath.png`,
    )
  })

  it('can accept a different width', () => {
    expect(posterUrl('/imagePath.png', 'w92')).toEqual(
      `${TMDB_POSTER_URL}w92/imagePath.png`,
    )
  })

  describe('posterPath is null', () => {
    it('returns an empty string', () => {
      expect(posterUrl(null)).toEqual('')
    })
  })

  describe('posterPath starts with /events', () => {
    it('returns the posterPath', () => {
      expect(posterUrl('/events/poster.jpg')).toEqual('/events/poster.jpg')
    })
  })
})
