/* eslint-disable @stylistic/max-len */
import EventController from '@server/controllers/eventController'
import { Router } from 'express'
import type NotionAdapter from '@server/data/notion/notionAdapter'
import CacheEventsController from '@server/controllers/cacheEventsController'
import CacheEmailTemplatesController from '@server/controllers/cacheEmailTemplatesController'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import RsvpController from '@server/controllers/rsvpController'
import HealthCheckController from '@server/controllers/healthCheckController'
import SuggestionController from '@server/controllers/suggestionController'
import Config from '@server/config/config'
import CalendarController from '@server/controllers/calendarController'
import { parseManifest } from '@server/config/vite'
import { Route, registerRoutes } from '@server/routers/routes'
import SubscriptionController from '@server/controllers/subscriptionController'
import { CronController } from '@server/controllers/cronController'
import EventEventController from '@server/controllers/eventEventController'
import MovieController from '@server/controllers/movieController'

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
  const cacheEventsController = new CacheEventsController(firestore, notion, tmdb)
  const cacheEmailTemplatesController = new CacheEmailTemplatesController(firestore)
  const calendarController = new CalendarController(config)
  const cronController = new CronController(config, firestore)
  const movieController = new MovieController(tmdb)
  const rsvpController = new RsvpController(firestore)
  const subscriptionController = new SubscriptionController(firestore)
  const suggestionController = new SuggestionController(notion, tmdb)
  const eventController = new EventController(firestore)
  const eventEventController = new EventEventController(firestore)

  return [
    Route.get('/health_check', HealthCheckController.index),

    Route.get('/api/events', eventController.index),
    Route.get('/api/events/:id', eventController.show),
    Route.post('/api/events/:eventId/rsvp', rsvpController.store),
    Route.get('/api/cache/events', cacheEventsController.show),
    Route.post('/api/cache/events', cacheEventsController.store),
    Route.post('/api/cache/email-templates', cacheEmailTemplatesController.store),
    Route.post('/api/subscriptions', subscriptionController.store),
    Route.get('/api/movies', movieController.show),

    Route.post('/suggestions', suggestionController.store),
    Route.get('/calendar', calendarController.index),
    Route.get('/unsubscribe', subscriptionController.destroy),
    Route.get('/cron/reminders', cronController.reminders),
    Route.get('/events/:eventId/event', eventEventController.show),
  ]
}
