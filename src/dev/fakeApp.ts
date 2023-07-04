import Application from '../application'
import FakeWeekController from './fakeWeekController'

class FakeApplication extends Application {
  routes () {
    const routes = super.routes()
    const fakeRoutes = new Map([
      ['/api/weeks/:date', FakeWeekController.show]
    ])

    return new Map([...routes, ...fakeRoutes])
  }
}

export default FakeApplication
