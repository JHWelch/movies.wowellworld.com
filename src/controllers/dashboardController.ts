/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type Request, type Response } from 'express'

class DashboardController {
  static async index (_req: Request, res: Response): Promise<void> {
    res.render('index')
  }
}

export default DashboardController
