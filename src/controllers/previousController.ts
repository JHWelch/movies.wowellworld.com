/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type Request, type Response } from 'express'

class PreviousController {
  static PATHS = {
    index: '/previous',
  }

  static async index (_req: Request, res: Response): Promise<void> {
    res.render('previous/index', { path: PreviousController.PATHS.index })
  }
}

export default PreviousController
