import { NextFunction, Request, Response } from 'express'

const cronMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (!request.headers || !request.headers['X-Appengine-Cron']) {
    response.statusCode = 403
    response.json({
      error: 'Missing X-Appengine-Cron header',
    })
  } else {
    next()
  }
}

export default cronMiddleware
