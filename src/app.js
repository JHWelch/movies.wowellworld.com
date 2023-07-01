import setupExpress from './config/express.js';
import DashboardController from './controllers/dashboardController.js';

class Application {
  constructor(notion) {
    this.express = setupExpress();
    this.notion = notion;
    this.setupRoutes();
  }

  static routes() {
    return new Map([
      ['/', DashboardController.index],
    ]);
  }

  setupRoutes() {
    Application.routes().forEach((handler, route) => {
      this.express.get(route, handler);
    });

    this.express.get('/api/weeks/:date', async (req, res) => {
      const week = await this.notion.getWeek(req.params.date);

      if (!week) {
        res.status(404).json({ error: 'Week not found' });
        return;
      }

      res.json(week.toDTO());
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
