import { NextFunction, Request, Response } from 'express'

const cronMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (!request.headers || !request.headers['x-appengine-cron']) {
    response.status(401).json({
      error: 'Missing X-Appengine-Cron header',
    })
  } else {
    next()
  }
}

export default cronMiddleware
