import { expect, it } from '@jest/globals'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import NotionAdapter from '@server/data/notion/notionAdapter'
import TmdbAdapter from '@server/data/tmdb/tmdbAdapter'
import createAppRouter from '@server/routers/appRouter'
import { mockConfig } from '@tests/support/mockConfig'

it('registers all routes', () => {
  const config = mockConfig()
  const firestore = new FirestoreAdapter(config)
  const notion = new NotionAdapter(config)
  const tmdbAdapter = new TmdbAdapter(config)

  const router = createAppRouter(config, firestore, notion, tmdbAdapter)

  const routes = Object.fromEntries(
    router.stack
      .filter((layer) => layer.route)
      .map((layer) => [
        layer.route?.path,
        layer.route?.methods,
      ])
  )

  expect(routes).toEqual( {
    '/health_check':  { get: true },
    '/api/events':  { get: true },
    '/api/events/:id':  { get: true },
    '/api/events/:eventId/rsvp':  { post: true },
    '/api/cache/events':  { post: true },
    '/api/cache/email-templates':  { post: true },
    '/api/subscriptions':  { post: true },
    '/api/movies':  { get: true },
    '/suggestions':  { post: true },
    '/calendar':  { get: true },
    '/unsubscribe':  { get: true },
    '/cron/reminders':  { get: true },
    '/events/:eventId/event':  { get: true },
    '/(.*)/':  { _all: true },
  })
})
