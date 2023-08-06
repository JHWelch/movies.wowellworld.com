import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { NotionMock } from '../support/notionMock'
import { getMockReq, getMockRes } from '@jest-mock/express'
import Notion from '../../src/data/notion'
import CacheController from '../../src/controllers/cacheController'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'
import { doc, getFirestore, Firestore, runTransaction, Transaction } from 'firebase/firestore'
import { Request } from 'express'


let notionMock: NotionMock

const { res, mockClear } = getMockRes()

beforeAll(() => {
  jest.mock('@notionhq/client')
  jest.mock('firebase-admin/app')
  jest.mock('firebase/app')

  notionMock = new NotionMock()
})

beforeEach(() => {
  jest.clearAllMocks()
  notionMock.mockNotionEnv()
  mockClear()
})

describe('constructor', () => {
  it('initializes the db', () => {
    const notion = new Notion()
    const cacheController = new CacheController(notion)

    expect (applicationDefault).toHaveBeenCalledTimes(1)
    expect (initializeApp).toHaveBeenCalledTimes(1)
    expect (getFirestore).toHaveBeenCalledTimes(1)
    expect(cacheController.db).toBeDefined()
  })
})
