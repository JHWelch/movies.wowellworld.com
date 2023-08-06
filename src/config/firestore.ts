import { getFirestore, Firestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'

export default function setupFirestore (): Firestore {
  const firebaseConfig = {
    credential: applicationDefault(),
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
  }

  const app = initializeApp(firebaseConfig)

  return getFirestore(app)
}
