import { getDocs, Timestamp } from 'firebase/firestore'
import { jest } from '@jest/globals'

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

  static mockDoc (collectionPath: string, documentPath: string) {
    return {
      firestore: { firestore: 'firestore' },
      collectionPath,
      documentPath,
    }
  }
}

type FirebaseWeek = {
  date: Date,
  id: string,
  isSkipped: boolean,
  theme: string,
}
