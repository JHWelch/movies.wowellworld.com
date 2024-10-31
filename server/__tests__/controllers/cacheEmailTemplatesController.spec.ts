import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { getMockRes } from '@jest-mock/express'
import CacheEmailTemplatesController from '@server/controllers/cacheEmailTemplatesController'
import { transaction } from '@mocks/firebase/firestore'
import { Request } from 'express'
import { FirebaseMock } from '@tests/support/firebaseMock'
import FirestoreAdapter from '@server/data/firestore/firestoreAdapter'
import { mockConfig } from '@tests/support/mockConfig'
import fs from 'fs'
import MockDate from 'mockdate'

const { res, mockClear } = getMockRes()
let req: Request

const newCacheController = () => {
  const config = mockConfig()
  const firestore = new FirestoreAdapter(config)

  return new CacheEmailTemplatesController(firestore)
}

beforeAll(() => {
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')
  jest.mock('firebase/firestore')
  MockDate.set('2021-01-01')
})

beforeEach(() => {
  jest.clearAllMocks()
  mockClear()
  jest.mock('@server/helpers/directoryPath')
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('cacheEmailTemplates', () => {
  it('uploads email templates to firestore', async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('html')
    await newCacheController().store(req, res)

    expect(res.sendStatus).toHaveBeenCalledWith(200)
    expect(transaction.set).toHaveBeenCalledWith(
      FirebaseMock.mockDoc('mail-templates', 'reminder'),
      {
        subject: 'Reminder: {{ theme }} is Tomorrow',
        html: 'html',
      },
    )
  })
})
