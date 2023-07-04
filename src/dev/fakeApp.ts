import { type Request, type Response } from 'express'
import Application from '../application'
import FakeWeekController from './fakeWeekController'

class FakeApplication extends Application {
  routes (): Map<string, (req: Request, res: Response) => void> {
    const routes = super.routes()
    const fakeRoutes = new Map([
      ['/api/weeks/:date', FakeWeekController.show]
    ])

    return new Map([...routes, ...fakeRoutes])
  }
}

export default FakeApplication
