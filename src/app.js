import setupExpress from './config/express.js';
import DashboardController from './controllers/dashboardController.js';
import WeekController from './controllers/weekController.js';

class Application {
  constructor(notion) {
    this.express = setupExpress();
    this.notion = notion;
    this.setupRoutes();
  }

  /**
   * This currently only works for GET requests
   */
  routes() {
    const weekController = new WeekController(this.notion);
    return new Map([
      ['/', DashboardController.index],
      ['/api/weeks/:date', weekController.show.bind(weekController)],
    ]);
  }

  setupRoutes() {
    this.routes().forEach((handler, route) => {
      this.express.get(route, handler);
    });
  }

  listen() {
    const port = process.env.PORT || 8080;

    this.express.listen(port, () => {
      console.log(`Listening on port ${port}...`); // eslint-disable-line no-console
    });
  }
}

export default Application;
