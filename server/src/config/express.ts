import bodyParser from 'body-parser'
import express from 'express'
import assetRouter from '../routers/assetRouter.js'
import directoryPath from '../helpers/directoryPath.js'

export default function setupExpress (): express.Express {
  const dirname = directoryPath()
  const app = express()
  app.set('view engine', 'ejs')
  app.use('/public', express.static(`${dirname}/../../../public`))
  app.use(
    '/made-with',
    express.static(`${dirname}/../../../node_modules/@jhwelch/made-with`),
  )
  app.use(bodyParser.json())
  app.use('/src', assetRouter)

  return app
}
