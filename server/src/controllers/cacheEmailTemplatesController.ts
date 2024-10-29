import { Request, Response } from 'express'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import fs from 'fs'
import emails from '@server/emails/emails'
import directoryPath from '@server/helpers/directoryPath'

export default class CacheEmailTemplatesController {
  constructor (
    private firestore: FirestoreAdapter,
  ) {}

  store = async (_req: Request, res: Response): Promise<void> => {
    this.firestore.updateTemplates(emails.templates.map(email => ({
      name: email.name,
      data: {
        ...email.data,
        html: this.getHtml(email.name),
      },
    })))

    res.sendStatus(200)
  }

  private getHtml = (name: string | null): string =>
    fs.readFileSync(`${directoryPath()}/../../../emails/built/${name}.html`, 'utf8')
}
