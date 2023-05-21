import * as dotenv from 'dotenv';
import Week from './models/week.js';
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

  const record = await notion.getCurrentWeek();

  const week = Week.fromNotion(record)
    .setMovies(
      await notion.getMovie(record.properties['Movie 1'].relation[0].id),
      await notion.getMovie(record.properties['Movie 2'].relation[0].id),
    );

  res.render('week', { week });
});

app.listen(process.env.PORT || 8080);
