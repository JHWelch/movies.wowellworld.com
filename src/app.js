import setupExpress from './config/express.js';
import renderFake from './dev/renderFake.js';

class Application {
  constructor(notion) {
    this.express = setupExpress();
    this.notion = notion;
    this.setupRoutes();
  }

  setupRoutes() {
    this.express.get('/', async (req, res) => {
      if (process.env.NODE_ENV === 'development') {
        renderFake(res);

        return;
      }

      const currentWeek = await this.notion.getCurrentWeek();
      const upcoming = await this.notion.getUpcomingWeeks();

      res.render('index', { currentWeek, upcoming });
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
