import * as dotenv from 'dotenv'
import fs from 'fs'
import Config from '../src/config/config.js'
import FirestoreAdapter from '../src/data/firestore/firestoreAdapter.js'
import emails from '../emails/emails.js'

dotenv.config()

const adapter = new FirestoreAdapter(new Config())

const getHtml = (name: string | null) => {
  const path = `./emails/built/${name}.html`

  return fs.readFileSync(path, 'utf8')
}

adapter.updateTemplates(emails.templates.map(email => {
  const html = getHtml(email.name)

  return {
    name: email.name,
    subject: email.subject,
    html: html,
  }
}))
