import WeekController from '@server/controllers/weekController'
import { Router } from 'express'
import type NotionAdapter from '@server/data/notion/notionAdapter'
import CacheController from '@server/controllers/cacheWeeksController'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import RsvpController from '@server/controllers/rsvpController'
import HealthCheckController from '@server/controllers/healthCheckController'
import SuggestionController from '@server/controllers/suggestionController'
import Config from '@server/config/config'
import CalendarController from '@server/controllers/calendarController'
import { parseManifest } from '@server/config/vite'
import { HttpVerb, Route, registerRoutes } from '@server/routers/routes'
import SubscriptionController from '@server/controllers/subscriptionController'
import { CronController } from '@server/controllers/cronController'
import WeekEventController from '@server/controllers/weekEventController'

export default function createAppRouter (
  config: Config,
  firestore: FirestoreAdapter,
  notion: NotionAdapter,
  tmdb: TmdbAdapter,
): Router {
  const router = Router()

  registerRoutes(router, routes(config, firestore, notion, tmdb))

  router.all(/(.*)/, (_req, res) => {
    try {
      res.render('index.html.ejs', {
        environment: config.nodeEnv,
        manifest: parseManifest(config),
      })
    } catch (_) {
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
  const cronController = new CronController(config, firestore)
  const rsvpController = new RsvpController(firestore)
  const subscriptionController = new SubscriptionController(firestore)
  const suggestionController = new SuggestionController(notion)
  const weekController = new WeekController(firestore)
  const weekEventController = new WeekEventController(firestore)

  return [
    new Route('/health_check', HealthCheckController.index),
    new Route('/api/weeks', weekController.index),
    new Route('/api/weeks/:weekId/rsvp', rsvpController.store, HttpVerb.POST),
    new Route('/api/cache/weeks', cacheController.cacheWeeks, HttpVerb.POST),
    new Route('/api/cache/email-templates', cacheController.cacheEmailTemplates),
    new Route('/suggestions', suggestionController.store, HttpVerb.POST),
    new Route('/calendar', calendarController.index),
    new Route('/api/subscriptions', subscriptionController.store, HttpVerb.POST),
    new Route('/unsubscribe', subscriptionController.destroy),
    new Route('/cron/reminders', cronController.reminders),
    new Route('/weeks/:weekId/event', weekEventController.show),
  ]
}
