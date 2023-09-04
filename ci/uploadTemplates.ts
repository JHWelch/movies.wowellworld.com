/* eslint-disable no-console */
import * as dotenv from 'dotenv'
import fs from 'fs'
import Config from '../src/config/config.js'
import FirestoreAdapter from '../src/data/firestore/firestoreAdapter.js'
import emails from '../emails/emails.js'

dotenv.config()

const adapter = new FirestoreAdapter(new Config())

const getHtml = (name: string | null) =>
  fs.readFileSync(`./emails/built/${name}.html`, 'utf8')

console.log('Templates to update:')
console.table(emails.templates)

console.log('Updating templates...')
adapter.updateTemplates(emails.templates.map(email => ({
  ...email,
  html: getHtml(email.name),
})))

console.log('Templates successfully updated!')
