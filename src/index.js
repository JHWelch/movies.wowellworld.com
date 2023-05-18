import * as dotenv from 'dotenv';
import express from 'express';
import { Week } from "./models/week.js";
import { Notion } from './data/notion.js';

dotenv.config();

const app = express();
app.set('view engine', 'ejs');

const notion = new Notion();

app.get('/', async function (req, res) {
  const record = await notion.getCurrentWeek();

  res.render('week', {
    week: Week.fromNotion(record),
    movie1: await notion.getMovie(record.properties['Movie 1'].relation[0].id),
    movie2: await notion.getMovie(record.properties['Movie 2'].relation[0].id),
  });
})

app.listen(3000)
