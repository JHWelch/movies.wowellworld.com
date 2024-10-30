/* eslint-disable @stylistic/max-len */
import WeekController from '@server/controllers/weekController'
import { Router } from 'express'
import type NotionAdapter from '@server/data/notion/notionAdapter'
import CacheWeeksController from '@server/controllers/cacheWeeksController'
import CacheEmailTemplatesController from '@server/controllers/cacheEmailTemplatesController'
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
  const cacheWeeksController = new CacheWeeksController(firestore, notion, tmdb)
  const cacheEmailTemplatesController = new CacheEmailTemplatesController(firestore)
  const calendarController = new CalendarController(config)
  const cronController = new CronController(config, firestore)
  const rsvpController = new RsvpController(firestore)
  const subscriptionController = new SubscriptionController(firestore)
  const suggestionController = new SuggestionController(notion)
  const weekController = new WeekController(firestore)
  const weekEventController = new WeekEventController(firestore)

  return [
    Route.get('/health_check', HealthCheckController.index),
    Route.get('/api/weeks', weekController.index),
    Route.post('/api/weeks/:weekId/rsvp', rsvpController.store),
    Route.get('/api/cache/weeks', cacheWeeksController.show),
    Route.post('/api/cache/weeks', cacheWeeksController.store),
    Route.post('/api/cache/email-templates', cacheEmailTemplatesController.store),
    Route.post('/suggestions', suggestionController.store),
    Route.get('/calendar', calendarController.index),
    Route.post('/api/subscriptions', subscriptionController.store),
    Route.get('/unsubscribe', subscriptionController.destroy),
    Route.get('/cron/reminders', cronController.reminders),
    Route.get('/weeks/:weekId/event', weekEventController.show),
  ]
}
