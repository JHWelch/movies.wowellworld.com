import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

export default function setupExpress (): express.Express {
  const app = express()
  app.set('view engine', 'ejs')
  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)
  app.use('/public', express.static(`${dirname}/../../public`))

  return app
}
