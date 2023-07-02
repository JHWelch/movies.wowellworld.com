import { Client } from '@notionhq/client';
import Movie from '../models/movie.js';
import Week from '../models/week.js';
import DateUtils from './dateUtils.js';

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

  async getWeek(date) {
    const records = await this.notion.databases.query({
      database_id: process.env.DATABASE_ID,
      filter: {
        property: 'Date',
        date: { equals: date },
      },
    });
    const record = records.results[0];

    return record ? this.recordToWeek(record) : null;
  }

  async getUpcomingWeeks() {
    const records = await this.notion.databases.query({
      database_id: process.env.DATABASE_ID,
      page_size: 10,
      filter: {
        property: 'Date',
        date: { on_or_after: DateUtils.today() },
      },
      sorts: [{
        property: 'Date',
        direction: 'ascending',
      }],
    });

    return Promise.all(records.results.map((record) => this.recordToWeek(record)));
  }

  async recordToWeek(record) {
    const movies = await Promise.all(
      record.properties.Movies.relation
        .map((relation) => this.getMovie(relation.id)),
    );

    return Week.fromNotion(record).setMovies(movies);
  }

  async movieOrNull(record, movie) {
    const relation = record.properties[movie].relation[0];

    if (!relation) {
      return null;
    }

    return this.getMovie(record.properties[movie].relation[0].id);
  }
}
