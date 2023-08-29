import DashboardController from './controllers/dashboardController.js'
import WeekController from './controllers/weekController.js'
import { type Express, type Request, type Response } from 'express'
import type NotionAdapter from './data/notion/notionAdapter.js'
import PreviousController from './controllers/previousController.js'
import CacheController from './controllers/cacheController.js'
import FirestoreAdapter from './data/firestore/firestoreAdapter.js'
import TmdbAdapter from './data/tmdb/tmdbAdapter.js'
// import RsvpController from './controllers/rsvpController.js'

export function registerRoutes (
  express: Express,
  firestore: FirestoreAdapter,
  notion: NotionAdapter,
  tmdb: TmdbAdapter,
): void {
  routes(firestore, notion,tmdb)
    .forEach((route) => {
      express.get(route.path, route.handler)
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
  const weekController = new WeekController(firestore)
  // const rsvpController = new RsvpController(firestore)

  return [
    new Route(DashboardController.PATHS.index, DashboardController.index),
    new Route(PreviousController.PATHS.index, PreviousController.index),
    new Route('/api/weeks', weekController.index.bind(weekController)),
    new Route('/api/cache', cacheController.cache.bind(cacheController)),
  ]
}

class Route {
  constructor (
    public path: string,
    public handler: (req: Request, res: Response) => void,
    public method: HttpMethod = HttpMethod.GET,
  ) {}
}

enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE,
}
