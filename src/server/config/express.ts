import bodyParser from 'body-parser'
import express from 'express'
import directoryPath from '@server/helpers/directoryPath'

export default function setupExpress (): express.Express {
  const dirname = directoryPath()
  const app = express()
  app.use(
    '/made-with',
    express.static(`${dirname}/../../../node_modules/@jhwelch/made-with`),
  )
  app.use(bodyParser.json())

  return app
}
