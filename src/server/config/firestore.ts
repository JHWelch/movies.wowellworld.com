import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'
import Config from '@server/config/config'

export default function setupFirestore (config: Config): Firestore {
  const firebaseConfig = {
    credential: applicationDefault(),
    projectId: config.googleCloudProject,
  }

  const app = getFirestore(initializeApp(firebaseConfig))

  if (!config.isProduction) {
    connectFirestoreEmulator(app, 'localhost', 8888)
  }

  return app
}
