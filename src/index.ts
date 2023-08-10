import * as dotenv from 'dotenv'
import Application from './application.js'
import NotionAdapter from './data/notionAdapter.js'
import FirestoreAdapter from './data/firestoreAdapter.js'
import setupExpress from './config/express.js'
import TmdbAdapter from './data/tmdb/tmdbAdapter.js'

dotenv.config()

const app = new Application(
  setupExpress(),
  new FirestoreAdapter(),
  new NotionAdapter(),
  new TmdbAdapter(),
)

app.listen()
