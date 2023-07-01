import setupExpress from './config/express.js';
import DateUtils from './data/dateUtils.js';

class Application {
  constructor(notion) {
    this.express = setupExpress();
    this.notion = notion;
    this.setupRoutes();
  }

  setupRoutes() {
    this.express.get('/', async (_req, res) => {
      res.render('index', {
        currentWeek: DateUtils.getThursday(),
        upcoming: DateUtils.getNextTwoThursdays(),
      });
    });

    this.express.get('/api/weeks/:date', async (req, res) => {
      res.json((await this.notion.getWeek(req.params.date)).toDTO());
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
