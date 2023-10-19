import { type Request, type Response } from 'express'

export default class RedirectController {
  static async redirect (
    _req: Request,
    res: Response,
    url: string
  ): Promise<void> {
    res.redirect(url)
  }
}
