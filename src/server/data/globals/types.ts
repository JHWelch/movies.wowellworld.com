import { MovieDto } from '@shared/dtos'
import { Timestamp } from 'firebase/firestore'

export type LastUpdated = {
  updatedEvents: number
  previousLastUpdated: Timestamp | null
  newLastUpdated: Timestamp | null
  tmdbMoviesSynced: MovieDto[]
}
