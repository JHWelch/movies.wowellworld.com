import WeekController from '../controllers/weekController.js'
import { Router } from 'express'
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
import { HttpVerb, Route, registerRoutes } from './routes.js'
import SubscriptionController from '../controllers/subscriptionController.js'
import { CronController } from '../controllers/cronController.js'

export default function createAppRouter (
  config: Config,
  firestore: FirestoreAdapter,
  notion: NotionAdapter,
  tmdb: TmdbAdapter,
): Router {
  const router = Router()

  registerRoutes(router, routes(config, firestore, notion, tmdb))

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
  const calendarController = new CalendarController(config)
  const cronController = new CronController(firestore)
  const rsvpController = new RsvpController(firestore)
  const subscriptionController = new SubscriptionController(firestore)
  const suggestionController = new SuggestionController(notion)
  const weekController = new WeekController(firestore)

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
    new Route(
      SubscriptionController.PATHS.store,
      subscriptionController.store,
      HttpVerb.POST,
    ),
    new Route(
      SubscriptionController.PATHS.destroy,
      subscriptionController.destroy,
    ),
    new Route(CronController.PATHS.reminders, cronController.reminders),
  ]
}
