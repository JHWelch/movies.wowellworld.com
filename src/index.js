import * as dotenv from 'dotenv';
import Application from './app.js';
import FakeApplication from './dev/fakeApp.js';
import Notion from './data/notion.js';

dotenv.config();

const app = process.env.NODE_ENV === 'development'
  ? new FakeApplication()
  : new Application(new Notion());

app.listen();
