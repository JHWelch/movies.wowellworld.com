import { type Request, type Response } from 'express'

export default class DashboardController {
  static PATHS = {
    index: '/',
  }

  static async index (_req: Request, res: Response): Promise<void> {
    res.render('index', { path: DashboardController.PATHS.index })
  }
}
