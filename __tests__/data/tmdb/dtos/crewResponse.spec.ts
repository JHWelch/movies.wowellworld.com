import { describe, expect, it } from '@jest/globals'
import CrewResponse from '../../../../src/data/tmdb/dtos/crewResponse.js'

describe('fromTmdbResponse', () => {
  it('should assign all fields correctly', () => {
    const response = CrewResponse.fromTmdbResponse(          {
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
    })

    expect(response.name).toEqual('Amy Heckerling')
    expect(response.job).toEqual('Director')
  })
})
