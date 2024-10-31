import { Router, type Request, type Response } from 'express'

class Route {
  constructor (
    public path: string,
    public handler: RouteHandler,
    public method: HttpVerb = HttpVerb.GET,
  ) {}

  static get (path: string, handler: RouteHandler): Route {
    return new Route(path, handler, HttpVerb.GET)
  }

  static post (path: string, handler: RouteHandler): Route {
    return new Route(path, handler, HttpVerb.POST)
  }

  static put (path: string, handler: RouteHandler): Route {
    return new Route(path, handler, HttpVerb.PUT)
  }

  static delete (path: string, handler: RouteHandler): Route {
    return new Route(path, handler, HttpVerb.DELETE)
  }
}

enum HttpVerb {
  GET,
  POST,
  PUT,
  DELETE,
}

type RouteHandler = (req: Request, res: Response) => void

const registerRoutes = (router: Router, routes: Route[]) =>
  routes.forEach((route) => {
    switch (route.method) {
      case HttpVerb.GET:
        router.get(route.path, route.handler); break
      case HttpVerb.POST:
        router.post(route.path, route.handler); break
      case HttpVerb.PUT:
        router.put(route.path, route.handler); break
      case HttpVerb.DELETE:
        router.delete(route.path, route.handler); break
    }
  })

export {
  Route,

  HttpVerb,

  type RouteHandler,

  registerRoutes,
}
