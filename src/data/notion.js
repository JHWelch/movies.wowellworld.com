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
        date: {
          equals: date,
        },
      },
    });
    const record = records.results[0];

    return this.recordToWeek(record);
  }

  async getCurrentWeek() {
    const records = await this.notion.databases.query({
      database_id: process.env.DATABASE_ID,
      filter: {
        property: 'Date',
        date: {
          equals: DateUtils.getThursday(),
        },
      },
    });

    const record = records.results[0];

    return this.recordToWeek(record);
  }

  async getUpcomingWeeks() {
    const [from, to] = DateUtils.getNextTwoThursdays();
    const records = await this.notion.databases.query({
      database_id: process.env.DATABASE_ID,
      filter: {
        and: [{
          property: 'Date',
          date: {
            on_or_after: from,
          },
        },
        {
          property: 'Date',
          date: {
            on_or_before: to,
          },
        }],
      },
      sorts: [
        {
          property: 'Date',
          direction: 'ascending',
        },
      ],
    });

    return Promise.all(records.results.map((record) => this.recordToWeek(record)));
  }

  async recordToWeek(record) {
    return Week.fromNotion(record)
      .setMovies([
        await this.getMovie(record.properties['Movie 1'].relation[0].id),
        await this.getMovie(record.properties['Movie 2'].relation[0].id),
      ]);
  }
}
