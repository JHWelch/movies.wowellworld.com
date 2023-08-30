import { type Request, type Response } from 'express'

class HealthCheckController {
  static PATHS = {
    index: '/health_check',
  }

  static async index (_req: Request, res: Response): Promise<void> {
    res.status(200).send('ok')
  }
}

export default HealthCheckController
