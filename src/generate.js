import * as dotenv from 'dotenv';
import * as ejs from 'ejs';
import { Client } from "@notionhq/client";
import { Week } from "./models/week.js";
import { Movie } from "./models/movie.js";
dotenv.config();

const DATABASE_ID = '998af5d921dc41fe851443b57eec98bc';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function getMovie(id) {
  const page = await notion.pages.retrieve({page_id: id});

  return Movie.fromNotion(page);
}

(async () => {
  const records = await notion.databases.query({
    database_id: DATABASE_ID
  });

  const record = records.results[0];
  const movie1 = await getMovie(record.properties['Movie 1'].relation[0].id);
  const movie2 = await getMovie(record.properties['Movie 2'].relation[0].id);

  const week = Week.fromNotion(record);

  console.log(await ejs.renderFile('./src/views/week.ejs', { week, movie1, movie2 }));
})();
