import * as dotenv from 'dotenv';
import express from 'express';
import { Client } from "@notionhq/client";
import { Week } from "./models/week.js";
import { Movie } from "./models/movie.js";
dotenv.config();

var app = express();
app.set('view engine', 'ejs');

const DATABASE_ID = '998af5d921dc41fe851443b57eec98bc';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

app.get('/', async function (req, res) {
  const records = await notion.databases.query({
    database_id: DATABASE_ID
  });

  const record = records.results[0];
  const movie1 = await getMovie(record.properties['Movie 1'].relation[0].id);
  const movie2 = await getMovie(record.properties['Movie 2'].relation[0].id);

  const week = Week.fromNotion(record);

  res.render('week', { week, movie1, movie2 });
})

app.listen(3000)

async function getMovie(id) {
  const page = await notion.pages.retrieve({page_id: id});

  return Movie.fromNotion(page);
}
