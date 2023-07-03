import * as dotenv from 'dotenv';
import Application from './application.js';
import FakeApplication from './dev/fakeApp.js';
import Notion from './data/notion.js';

dotenv.config();

console.log(process.env.NODE_ENV);
console.log(process.env.CALENDAR_URL);

// const app = process.env.NODE_ENV === 'development'
//   ? new FakeApplication()
//   : new Application(new Notion());

// app.listen();
