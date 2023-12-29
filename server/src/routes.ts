import WeekController from './controllers/weekController.js'
import { type Express, type Request, type Response } from 'express'
import type NotionAdapter from './data/notion/notionAdapter.js'
import CacheController from './controllers/cacheController.js'
import FirestoreAdapter from './data/firestore/firestoreAdapter.js'
import TmdbAdapter from './data/tmdb/tmdbAdapter.js'
import RsvpController from './controllers/rsvpController.js'
import HealthCheckController from './controllers/healthCheckController.js'
import SuggestionController from './controllers/suggestionController.js'
import Config from './config/config.js'
import CalendarController from './controllers/calendarController.js'

export function registerRoutes (
  config: Config,
  express: Express,
  firestore: FirestoreAdapter,
  notion: NotionAdapter,
  tmdb: TmdbAdapter,
): void {
  routes(config, firestore, notion, tmdb)
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

  express.all('*', (_req, res) => {
    try {
      res.render('index.html.ejs')
    } catch (error) {
      res.json({ success: false, message: 'Something went wrong' })
    }
  })
}

function routes (
  config: Config,
  firestore: FirestoreAdapter,
  notion: NotionAdapter,
  tmdb: TmdbAdapter,
): Route[] {
  const cacheController = new CacheController(
    firestore,
    notion,
    tmdb,
  )
  const rsvpController = new RsvpController(firestore)
  const weekController = new WeekController(firestore)
  const suggestionController = new SuggestionController(notion)
  const calendarController = new CalendarController(config)

  return [
    new Route(HealthCheckController.PATHS.index, HealthCheckController.index),
    new Route('/api/weeks', weekController.index.bind(weekController)),
    new Route(
      RsvpController.PATHS.store,
      rsvpController.store.bind(rsvpController),
      HttpMethod.POST,
    ),
    new Route(
      CacheController.PATHS.weeks,
      cacheController.cacheWeeks.bind(cacheController),
    ),
    new Route(
      CacheController.PATHS.emailTemplates,
      cacheController.cacheEmailTemplates.bind(cacheController),
    ),
    new Route(
      SuggestionController.PATHS.store,
      suggestionController.store.bind(suggestionController),
      HttpMethod.POST,
    ),
    new Route(
      CalendarController.PATH,
      calendarController.index.bind(calendarController),
    ),
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
