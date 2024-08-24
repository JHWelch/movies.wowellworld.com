import { type Express } from 'express'
import type NotionAdapter from '@server/data/notion/notionAdapter'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import createAppRouter from '@server/routers/appRouter'
import Config from '@server/config/config'
import cronMiddleware from '@server/middleware/cronMiddleware'

export default class Application {
  constructor (
    private config: Config,
    private express: Express,
    private firestore: FirestoreAdapter,
    private notion: NotionAdapter,
    private tmdb: TmdbAdapter,
  ) {
    express.use('/cron', cronMiddleware)
    express.use(createAppRouter(config, firestore, notion, tmdb))
  }

  listen (): void {
    const port = process.env.PORT ?? 8080

    this.express.listen(port, () => {
      console.log(`Listening on port ${port}...`) // eslint-disable-line no-console
    })
  }
}
