import setupExpress from './config/express.js'
import DashboardController from './controllers/dashboardController.js'
import WeekController from './controllers/weekController.js'
import { type Express, type Request, type Response } from 'express'
import type Notion from './data/notion'

class Application {
  express: Express
  notion: Notion

  constructor (notion: Notion) {
    this.express = setupExpress()
    this.notion = notion
    this.registerRoutes()
  }

  /**
   * This currently only works for GET requests
   */
  routes (): Map<string, (req: Request, res: Response) => void> {
    const weekController = new WeekController(this.notion)

    return new Map([
      ['/', DashboardController.index],
      ['/api/weeks', weekController.index.bind(weekController)],
      ['/api/weeks/:date', weekController.show.bind(weekController)],
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
