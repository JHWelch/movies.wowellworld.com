import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import assetRouter from '../routers/assetRouter.js'

export default function setupExpress (): express.Express {
  const app = express()
  app.set('view engine', 'ejs')
  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)
  app.use('/public', express.static(`${dirname}/../../public`))
  app.use(
    '/made-with',
    express.static(`${dirname}/../../node_modules/@jhwelch/made-with`),
  )
  app.use(bodyParser.json())
  app.use('/src', assetRouter)

  return app
}
