import { describe, expect, it } from 'vitest'
import CrewResponse from '@server/data/tmdb/dtos/crewResponse'

describe('fromTmdbResponse', () => {
  it('should assign all fields correctly', () => {
    const input = {
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
    }
    const response = CrewResponse.fromTmdbResponse(input)

    expect(response.name).toEqual('Amy Heckerling')
    expect(response.job).toEqual('Director')
  })
})
