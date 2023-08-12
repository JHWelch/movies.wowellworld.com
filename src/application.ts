import DashboardController from './controllers/dashboardController.js'
import WeekController from './controllers/weekController.js'
import { type Express, type Request, type Response } from 'express'
import type NotionAdapter from './data/notionAdapter.js'
import PreviousController from './controllers/previousController.js'
import CacheController from './controllers/cacheController.js'
import FirestoreAdapter from './data/firestoreAdapter.js'
import TmdbAdapter from './data/tmdb/tmdbAdapter.js'

class Application {
  constructor (
    private express: Express,
    private firestore: FirestoreAdapter,
    private notion: NotionAdapter,
    private tmdb: TmdbAdapter,
  ) {
    this.registerRoutes()
  }

  /**
   * This currently only works for GET requests
   */
  routes (): Map<string, (req: Request, res: Response) => void> {
    const cacheController = new CacheController(
      this.firestore,
      this.notion,
      this.tmdb
    )
    const weekController = new WeekController(this.firestore)

    return new Map([
      [DashboardController.PATHS.index, DashboardController.index],
      [PreviousController.PATHS.index, PreviousController.index],
      ['/api/weeks', weekController.index.bind(weekController)],
      // ['/api/weeks/:date', weekController.show.bind(weekController)],
      ['/api/cache', cacheController.cache.bind(cacheController)],
    ])
  }

  registerRoutes (): void {
    this.routes().forEach((handler, route) => {
      this.express.get(route, handler)
    })
  }

  listen (): void {
    const port = process.env.PORT ?? 8080

    this.express.listen(port, () => {
      console.log(`Listening on port ${port}...`) // eslint-disable-line no-console
    })
  }
}

export default Application
