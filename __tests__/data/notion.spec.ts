import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import Notion from '../../src/data/notion'

beforeAll(() => {
  jest.mock('@notionhq/client')
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('notion', () => {
  describe('constructor', () => {
    it('should set the database id', () => {
      process.env = {
        NOTION_TOKEN: 'NOTION_TOKEN',
        DATABASE_ID: 'DATABASE_ID',
      }
      const notion = new Notion()

      expect(notion._databaseId).toEqual('DATABASE_ID')
    })
  })
})
