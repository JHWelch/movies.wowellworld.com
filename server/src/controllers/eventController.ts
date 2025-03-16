import { type Request, type Response } from 'express'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { isWidth, Width } from '@server/types/tmdb'

export default class EventController {
  constructor (
    protected firestore: FirestoreAdapter,
  ) {}

  index = async (req: Request, res: Response): Promise<void> => {
    const { past, limit, posterWidth } = this.parseIndexQuery(req)

    const events = past
      ? await this.firestore.getPastEvents()
      : await this.firestore.getUpcomingEvents({ limit })

    res.json(events.map((event) => event.toDTO({
      movies: { posterWidth },
    })))
  }

  show = async (req: Request, res: Response): Promise<void> => {
    const event = await this.firestore.getEvent(req.params.id)
    if (!event) {
      res.status(404).json({ error: 'Event not found' })

      return
    }

    res.json(event.toDTO())
  }

  parseIndexQuery = (req: Request): {
    past: boolean
    limit?: number
    posterWidth: Width
  } =>
    ({
      past: req.query.past === 'true',
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      posterWidth: isWidth(req.query.posterWidth) ? req.query.posterWidth : 'w500',
    })
}
