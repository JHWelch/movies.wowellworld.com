import * as dotenv from 'dotenv'
import Application from './application.js'
import NotionAdapter from './data/notionAdapter.js'
import FirestoreAdapter from './data/firestoreAdapter.js'

dotenv.config()

const app = new Application(
  new FirestoreAdapter(),
  new NotionAdapter()
)

app.listen()
