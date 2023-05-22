import * as dotenv from 'dotenv';
import Notion from './data/notion.js';
import setupExpress from './config/express.js';
import renderFake from './dev/render_fake.js';

dotenv.config();

const app = setupExpress();

const notion = new Notion();

app.get('/', async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    renderFake(res);

    return;
  }

  const currentWeek = await notion.getCurrentWeek();
  const upcoming = await notion.getUpcomingWeeks();

  res.render('index', { currentWeek, upcoming });
});

app.listen(process.env.PORT || 8080);
