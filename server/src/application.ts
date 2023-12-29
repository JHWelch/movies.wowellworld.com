import { type Express } from 'express'
import type NotionAdapter from './data/notion/notionAdapter.js'
import FirestoreAdapter from './data/firestore/firestoreAdapter.js'
import TmdbAdapter from './data/tmdb/tmdbAdapter.js'
import { registerRoutes } from './routes.js'
import Config from './config/config.js'

export default class Application {
  constructor (
    private config: Config,
    private express: Express,
    private firestore: FirestoreAdapter,
    private notion: NotionAdapter,
    private tmdb: TmdbAdapter,
  ) {
    registerRoutes(config, express, firestore, notion, tmdb)
  }

  listen (): void {
    const port = process.env.PORT ?? 8080

    this.express.listen(port, () => {
      console.log(`Listening on port ${port}...`) // eslint-disable-line no-console
    })
  }
}
