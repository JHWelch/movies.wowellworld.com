import Config from '@server/config/config'
import { NextFunction, Request, Response } from 'express'

const passwordMiddleware = (config: Config) => (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (!request.headers || !request.headers['authorization']) {
    response.status(401).json({
      error: 'Something went wrong authenticating you',
    })

    return
  }

  if (request.headers['authorization'] !== config.apiPassword) {
    response.status(403).json({ error: 'Password incorrect' })

    return
  }

  next()
}

export default passwordMiddleware
