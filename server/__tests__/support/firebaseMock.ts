import {
  getDocs,
  getDoc,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore'
import { jest } from '@jest/globals'
import { FirestoreWeek } from '@server/data/firestore/firestoreTypes'
import Week from '@server/models/week'
import Movie from '@server/models/movie'

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
        movies: week.movies ?? [],
      } : undefined),
      exists: () => Boolean(week),
    }))
  }

  static mockGetUserByEmail (user?: FirebaseUser) {
    (getDocs as unknown as jest.Mock).mockImplementation(() => ({
      docs: user ? [{
        id: user.id,
        data: () => ({
          email: user.email,
          reminders: user.reminders,
        }),
      }] : [],
    }))
  }

  static mockGetUsers (users: FirebaseUser[]) {
    (getDocs as unknown as jest.Mock).mockImplementation(() => ({
      docs: users.map((user) => ({
        id: user.id,
        data: () => ({
          email: user.email,
          reminders: user.reminders,
        }),
      })),
    }))
  }

  static mockDoc (
    collectionPath: string,
    documentPath?: string | unknown,
  ) {
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
  movies?: FirebaseMovie[],
}

type FirebaseMovie = {
  director: string,
  length: number,
  notionId: string,
  posterPath: string,
  showingUrl: string | null,
  theaterName: string | null,
  time: string | null,
  title: string,
  tmdbId: number | null,
  url: string | null,
  year: number | null,
}

type FirebaseUser = {
  id: string,
  email: string,
  reminders: boolean,
}
