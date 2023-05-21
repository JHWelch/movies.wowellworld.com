import { Client } from '@notionhq/client';
import Movie from '../models/movie.js';

export default class Notion {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  async getMovie(id) {
    const page = await this.notion.pages.retrieve({ page_id: id });

    return Movie.fromNotion(page);
  }

  async getCurrentWeek() {
    const records = await this.notion.databases.query({
      database_id: process.env.DATABASE_ID,
    });

    return records.results[0];
  }
}
