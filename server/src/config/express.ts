import bodyParser from 'body-parser'
import express from 'express'
import assetRouter from '@server/routers/assetRouter'
import directoryPath from '@server/helpers/directoryPath'

export default function setupExpress (): express.Express {
  const dirname = directoryPath()
  const app = express()
  app.set('view engine', 'ejs')
  app.use('/', express.static(`${dirname}/../../../public`))
  app.use(
    '/made-with',
    express.static(`${dirname}/../../../node_modules/@jhwelch/made-with`),
  )
  app.use(bodyParser.json())
  app.use('/src', assetRouter)

  return app
}
