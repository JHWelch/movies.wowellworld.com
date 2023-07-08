/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type Request, type Response } from 'express'

class PreviousController {
  static async index (_req: Request, res: Response): Promise<void> {
    res.render('previous/index')
  }
}

export default PreviousController
