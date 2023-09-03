import DashboardController from './controllers/dashboardController.js'
import WeekController from './controllers/weekController.js'
import { type Express, type Request, type Response } from 'express'
import type NotionAdapter from './data/notion/notionAdapter.js'
import PreviousController from './controllers/previousController.js'
import CacheController from './controllers/cacheController.js'
import FirestoreAdapter from './data/firestore/firestoreAdapter.js'
import TmdbAdapter from './data/tmdb/tmdbAdapter.js'
import RsvpController from './controllers/rsvpController.js'
import HealthCheckController from './controllers/healthCheckController.js'

export function registerRoutes (
  express: Express,
  firestore: FirestoreAdapter,
  notion: NotionAdapter,
  tmdb: TmdbAdapter,
): void {
  routes(firestore, notion,tmdb)
    .forEach((route) => {
      switch (route.method) {
      case HttpMethod.GET:
        express.get(route.path, route.handler); break
      case HttpMethod.POST:
        express.post(route.path, route.handler); break
      case HttpMethod.PUT:
        express.put(route.path, route.handler); break
      case HttpMethod.DELETE:
        express.delete(route.path, route.handler); break
      }
    })
}

function routes (
  firestore: FirestoreAdapter,
  notion: NotionAdapter,
  tmdb: TmdbAdapter,
): Route[] {
  const cacheController = new CacheController(
    firestore,
    notion,
    tmdb
  )
  const rsvpController = new RsvpController(firestore)
  const weekController = new WeekController(firestore)

  return [
    new Route(HealthCheckController.PATHS.index, HealthCheckController.index),
    new Route(DashboardController.PATHS.index, DashboardController.index),
    new Route(PreviousController.PATHS.index, PreviousController.index),
    new Route('/api/weeks', weekController.index.bind(weekController)),
    new Route(
      RsvpController.PATHS.store,
      rsvpController.store.bind(rsvpController),
      HttpMethod.POST,
    ),
    new Route('/api/cache', cacheController.cache.bind(cacheController)),
  ]
}

class Route {
  constructor (
    public path: string,
    public handler: RouteHandler,
    public method: HttpMethod = HttpMethod.GET,
  ) {}
}

enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE,
}

type RouteHandler = (req: Request, res: Response) => void
