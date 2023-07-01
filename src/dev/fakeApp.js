import Application from '../app.js';
import FakeWeekController from './fakeWeekController.js';

class FakeApplication extends Application {
  routes() {
    const routes = super.routes();
    const fakeRoutes = new Map([
      ['/api/weeks/:date', FakeWeekController.show],
    ]);

    return new Map([...routes, ...fakeRoutes]);
  }
}

export default FakeApplication;
