import WeekController from '../controllers/weekController.js'
import { type Request, type Response, Router } from 'express'
import type NotionAdapter from '../data/notion/notionAdapter.js'
import CacheController from '../controllers/cacheController.js'
import FirestoreAdapter from '../data/firestore/firestoreAdapter.js'
import TmdbAdapter from '../data/tmdb/tmdbAdapter.js'
import RsvpController from '../controllers/rsvpController.js'
import HealthCheckController from '../controllers/healthCheckController.js'
import SuggestionController from '../controllers/suggestionController.js'
import Config from '../config/config.js'
import CalendarController from '../controllers/calendarController.js'
import { parseManifest } from '../config/vite.js'

export default function createAppRouter (
  config: Config,
  firestore: FirestoreAdapter,
  notion: NotionAdapter,
  tmdb: TmdbAdapter,
): Router {
  const router = Router()

  routes(config, firestore, notion, tmdb)
    .forEach((route) => {
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

  router.all('*', (_req, res) => {
    try {
      res.render('index.html.ejs', {
        environment: config.nodeEnv,
        manifest: parseManifest(config),
      })
    } catch (error) {
      res.json({ success: false, message: 'Something went wrong' })
    }
  })

  return router
}

function routes (
  config: Config,
  firestore: FirestoreAdapter,
  notion: NotionAdapter,
  tmdb: TmdbAdapter,
): Route[] {
  const cacheController = new CacheController(firestore, notion, tmdb)
  const rsvpController = new RsvpController(firestore)
  const weekController = new WeekController(firestore)
  const suggestionController = new SuggestionController(notion)
  const calendarController = new CalendarController(config)

  return [
    new Route(HealthCheckController.PATHS.index, HealthCheckController.index),
    new Route('/api/weeks', weekController.index),
    new Route(RsvpController.PATHS.store, rsvpController.store, HttpVerb.POST),
    new Route(CacheController.PATHS.weeks, cacheController.cacheWeeks),
    new Route(
      CacheController.PATHS.emailTemplates,
      cacheController.cacheEmailTemplates,
    ),
    new Route(
      SuggestionController.PATHS.store,
      suggestionController.store,
      HttpVerb.POST,
    ),
    new Route(
      CalendarController.PATH,
      calendarController.index,
    ),
  ]
}

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
