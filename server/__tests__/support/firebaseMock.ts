import {
  getDocs,
  getDoc,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore'
import { jest } from '@jest/globals'
import { FirestoreWeek } from '@server/data/firestore/firestoreTypes'
import { Week } from '@server/models/week'
import { Movie } from '@server/models/movie'
import { RichText } from '@server/models/commonTypes'

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
            styledTheme: week.styledTheme ?? [],
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
    week: FirebaseWeekConstructor,
  ): WithFieldValue<FirestoreWeek> =>
    new Week({
      id: week.id,
      theme: week.theme,
      date: new Date(week.date),
      movies: week.movies ?? [],
      isSkipped: week.isSkipped ?? false,
      slug: week.slug ?? null,
      styledTheme: week.styledTheme ?? [],
    }).toFirebaseDTO()

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
  styledTheme?: RichText[],
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

type FirebaseWeekConstructor = {
  id: string,
  theme: string,
  date: Date|string,
  styledTheme?: RichText[],
  isSkipped?: boolean,
  slug?: string | null,
  movies?: Movie[],
}
