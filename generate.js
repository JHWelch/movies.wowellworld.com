import * as dotenv from 'dotenv';
import { Client } from "@notionhq/client";
import { Week } from "./src/models/week.js";
import { Movie } from "./src/models/movie.js";
dotenv.config();

const DATABASE_ID = '998af5d921dc41fe851443b57eec98bc';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

(async () => {
  const records = await notion.databases.query({
    database_id: DATABASE_ID
  });

  const x = records.results[0];

  const movieId = x.properties['Movie 1'].relation[0].id;

  const page = await notion.pages.retrieve({
    page_id: movieId
  });

  const movie = Movie.fromNotion(page);

  const week = Week.fromNotion(x);

  console.log(week.toString());
  console.log(movie.toString());
})();
