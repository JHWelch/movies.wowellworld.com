import * as dotenv from 'dotenv'
import Application from './application'
import Notion from './data/notion'

dotenv.config()

const app = new Application(new Notion())

app.listen()
