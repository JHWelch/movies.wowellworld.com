import { getDocs, getDoc, Timestamp, WithFieldValue } from 'firebase/firestore'
import { jest } from '@jest/globals'
import { FirestoreWeek } from '../../src/data/firestore/firestoreTypes'
import Week from '../../src/models/week'

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
            movies: [],
          }),
        })),
      }
    })
  }

  static mockGetWeek (week: FirebaseWeek) {
    (getDoc as unknown as jest.Mock).mockImplementation(() => ({
      data: () => ({
        id: week.id,
        theme: week.theme,
        date: Timestamp.fromDate(week.date),
        isSkipped: week.isSkipped,
        movies: [],
      }),
      exists: () => true,
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
    date: string
  ): WithFieldValue<FirestoreWeek> =>
    new Week(id, theme, new Date(date), false).toFirebaseDTO()

  static mockCollection = (collectionPath: string): {
    firestore: { firestore: 'firestore' },
    collectionPath: string,
  } => ({
    firestore: { firestore: 'firestore' },
    collectionPath,
  })
}

type FirebaseWeek = {
  date: Date,
  id: string,
  isSkipped: boolean,
  theme: string,
}
