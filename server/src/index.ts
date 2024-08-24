import * as dotenv from 'dotenv'
import Application from '@server/application'
import NotionAdapter from '@server/data/notion/notionAdapter'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import setupExpress from '@server/config/express'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import Config from '@server/config/config'

dotenv.config()

const config = new Config()

const app = new Application(
  config,
  setupExpress(),
  new FirestoreAdapter(config),
  new NotionAdapter(config),
  new TmdbAdapter(config),
)

app.listen()
