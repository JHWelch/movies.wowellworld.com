/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type Request, type Response } from 'express'
import fake from './fake'

class FakeWeekController {
  static async show (_req: Request, res: Response): Promise<void> {
    res.json(fake.week1)
  }
}

export default FakeWeekController
