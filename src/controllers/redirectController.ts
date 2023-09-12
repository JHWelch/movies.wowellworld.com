import { type Request, type Response } from 'express'

export default class RedirectController {
  static PATHS = {
    sept21: '/sep21',
  }
  static sep21Url = 'https://ginger-flood-c72.notion.site/The-2023-Celebration-of-Rachel-s-32nd-Birthday-Also-Known-As-Halloween-in-September-a17c5537f8594c30bb301a48c988f7ec'

  static async sept21 (_req: Request, res: Response): Promise<void> {
    res.redirect(RedirectController.sep21Url)
  }
}
