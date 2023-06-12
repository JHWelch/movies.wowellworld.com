import * as dotenv from 'dotenv';
import Application from './app.js';
import Notion from './data/notion.js';

dotenv.config();

const app = new Application(new Notion());

app.listen();
