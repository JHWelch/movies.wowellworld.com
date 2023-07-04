import * as dotenv from 'dotenv'
import Application from './application'
import FakeApplication from './dev/fakeApp'
import Notion from './data/notion'

dotenv.config()

const app = process.env.NODE_ENV === 'development'
  ? new FakeApplication()
  : new Application(new Notion())

app.listen()
