import {
  getDocs,
  getDoc,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore'
import { jest } from '@jest/globals'
import { FirestoreWeek } from '../../src/data/firestore/firestoreTypes'
import Week from '../../src/models/week'
import Movie from '../../src/models/movie'

export class FirebaseMock {
  static mockWeeks (weeks: FirebaseWeek[]) {
    (getDocs as unknown as jest.Mock).mockImplementation(() => {
      return {
        docs: weeks.map((week) => ({
          data: () => ({
            id: week.id,
            theme: week.theme,
            date: Timestamp.fromDate(week.date),
            isSkipped: week.isSkipped,
            slug: week.slug,
            movies: [],
          }),
        })),
      }
    })
  }

  static mockGetWeek (week?: FirebaseWeek) {
    (getDoc as unknown as jest.Mock).mockImplementation(() => ({
      data: () => (week ? {
        id: week.id,
        theme: week.theme,
        date: Timestamp.fromDate(week.date),
        isSkipped: week.isSkipped,
        movies: [],
      } : undefined),
      exists: () => Boolean(week),
    }))
  }

  static mockGetUser (user?: FirebaseUser) {
    (getDoc as unknown as jest.Mock).mockImplementation(() => ({
      data: () => user,
      exists: () => Boolean(user),
    }))
  }

  static mockDoc (collectionPath: string, documentPath: string) {
    return {
      firestore: { firestore: 'firestore' },
      collectionPath,
      documentPath,
    }
  }

  static mockWeek = (
    id: string,
    theme: string,
    date: string,
    movies: Movie[] = [],
    slug: string | null = null,
  ): WithFieldValue<FirestoreWeek> =>
    new Week(id, theme, new Date(date), false, slug, movies).toFirebaseDTO()

  static mockCollection = (collectionPath: string): {
    firestore: { firestore: 'firestore' },
    collectionPath: string,
  } => ({
    firestore: { firestore: 'firestore' },
    collectionPath,
  })
}

type FirebaseWeek = {
  id: string,
  theme: string,
  date: Date,
  slug: string | null,
  isSkipped: boolean,
}

type FirebaseUser = {
  id: string,
  email: string,
  reminders: boolean,
}
