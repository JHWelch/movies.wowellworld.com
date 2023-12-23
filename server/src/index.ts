import * as dotenv from 'dotenv'
import Application from './application.js'
import NotionAdapter from './data/notion/notionAdapter.js'
import FirestoreAdapter from './data/firestore/firestoreAdapter.js'
import setupExpress from './config/express.js'
import TmdbAdapter from './data/tmdb/tmdbAdapter.js'
import Config from './config/config.js'

dotenv.config()

const config = new Config()

const app = new Application(
  setupExpress(),
  new FirestoreAdapter(config),
  new NotionAdapter(config),
  new TmdbAdapter(config),
)

app.listen()
