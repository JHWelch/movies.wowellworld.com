import setupExpress from './config/express'
import DashboardController from './controllers/dashboardController'
import WeekController from './controllers/weekController'

class Application {
  constructor (notion) {
    this.express = setupExpress()
    this.notion = notion
    this.registerRoutes()
  }

  /**
   * This currently only works for GET requests
   */
  routes () {
    const weekController = new WeekController(this.notion)

    return new Map([
      ['/', DashboardController.index],
      ['/api/weeks', weekController.index.bind(weekController)],
      ['/api/weeks/:date', weekController.show.bind(weekController)]
    ])
  }

  registerRoutes () {
    this.routes().forEach((handler, route) => {
      this.express.get(route, handler)
    })
  }

  listen () {
    const port = process.env.PORT || 8080

    this.express.listen(port, () => {
      console.log(`Listening on port ${port}...`) // eslint-disable-line no-console
    })
  }
}

export default Application
