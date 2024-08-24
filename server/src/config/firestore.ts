import { getFirestore, Firestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'
import Config from '@server/config/config'

export default function setupFirestore (config: Config): Firestore {
  const firebaseConfig = {
    credential: applicationDefault(),
    projectId: config.googleCloudProject,
  }

  const app = initializeApp(firebaseConfig)

  return getFirestore(app)
}
