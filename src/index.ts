import * as dotenv from 'dotenv'
import Application from './application.js'
import Notion from './data/notionAdapter.js'

dotenv.config()

const app = new Application(new Notion())

app.listen()
