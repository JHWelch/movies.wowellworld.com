import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { Week } from "./models/week.js";
import { Notion } from './data/notion.js';
import { fileURLToPath } from 'url';
import fake from './dev/fake.json' assert { type: 'json' };
import { Movie } from './models/movie.js';


dotenv.config();

const app = express();
app.set('view engine', 'ejs');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public', express.static(__dirname + "/../public"));

const notion = new Notion();

app.get('/', async function (req, res) {
  if (process.env.NODE_ENV === 'development') {
    res.render('week', {
      week: Week.fromObject(fake.week),
      movie1: Movie.fromObject(fake.movie1),
      movie2: Movie.fromObject(fake.movie2),
    });

    return;
  }

  const record = await notion.getCurrentWeek();

  res.render('week', {
    week: Week.fromNotion(record),
    movie1: await notion.getMovie(record.properties['Movie 1'].relation[0].id),
    movie2: await notion.getMovie(record.properties['Movie 2'].relation[0].id),
  });
})

app.listen(3000)
