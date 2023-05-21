import * as dotenv from 'dotenv';
import Week from './models/week.js';
import Notion from './data/notion.js';
import fake from './dev/fake.json' assert { type: 'json' };
import Movie from './models/movie.js';
import setupExpress from './config/express.js';

dotenv.config();

const app = setupExpress();

const notion = new Notion();

app.get('/', async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    const week = Week.fromObject(fake.week)
      .setMovies(
        Movie.fromObject(fake.week.movie1),
        Movie.fromObject(fake.week.movie2),
      );
    res.render('index', { week });

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
