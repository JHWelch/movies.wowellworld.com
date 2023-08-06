import setupExpress from './config/express.js'
import DashboardController from './controllers/dashboardController.js'
import WeekController from './controllers/weekController.js'
import { type Express, type Request, type Response } from 'express'
import type Notion from './data/notion'
import PreviousController from './controllers/previousController.js'
import CacheController from './controllers/cacheController.js'
import { Firestore } from 'firebase/firestore'
import setupFirestore from './config/firestore.js'

class Application {
  express: Express
  firestore: Firestore
  notion: Notion

  constructor (notion: Notion) {
    this.express = setupExpress()
    this.firestore = setupFirestore()
    this.notion = notion
    this.registerRoutes()
  }

  /**
   * This currently only works for GET requests
   */
  routes (): Map<string, (req: Request, res: Response) => void> {
    const cacheController = new CacheController(this.firestore, this.notion)
    const weekController = new WeekController(this.notion)

    return new Map([
      [DashboardController.PATHS.index, DashboardController.index],
      [PreviousController.PATHS.index, PreviousController.index],
      ['/api/weeks', weekController.index.bind(weekController)],
      ['/api/weeks/:date', weekController.show.bind(weekController)],
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
