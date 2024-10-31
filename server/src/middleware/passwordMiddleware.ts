import Config from '@server/config/config'
import { NextFunction, Request, Response } from 'express'

const passwordMiddleware = (config: Config) => (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (!request.headers || !request.headers['authorization']) {
    response.status(401).json({ error: 'Unauthorized' })

    return
  }

  if (request.headers['authorization'] !== config.apiPassword) {
    response.status(403).json({ error: 'Forbidden' })

    return
  }

  next()
}

export default passwordMiddleware
