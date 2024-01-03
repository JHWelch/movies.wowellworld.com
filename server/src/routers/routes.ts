import { type Request, type Response } from 'express'

class Route {
  constructor (
    public path: string,
    public handler: RouteHandler,
    public method: HttpVerb = HttpVerb.GET,
  ) {}
}

enum HttpVerb {
  GET,
  POST,
  PUT,
  DELETE,
}

type RouteHandler = (req: Request, res: Response) => void

export {
  Route,

  HttpVerb,

  type RouteHandler,
}
