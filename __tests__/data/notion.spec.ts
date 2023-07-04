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
    describe('when NOTION_TOKEN and DATABASE_ID are set', () => {
      beforeEach(() => {
        process.env = {
          NOTION_TOKEN: 'NOTION_TOKEN',
          DATABASE_ID: 'DATABASE_ID',
        }
      })

      it('should set the database id', () => {
        expect(new Notion()._databaseId).toEqual('DATABASE_ID')
      })

      it('should set the notion client', () => {
        expect(new Notion().notion).toBeDefined()
      })
    })


    describe('when NOTION_TOKEN is not set', () => {
      beforeEach(() => {
        process.env = {
          DATABASE_ID: 'DATABASE_ID',
        }
      })

      it('should throw an error', () => {
        expect(() => new Notion()).toThrowError('Missing NOTION_TOKEN environment variable')
      })
    })

    describe('when DATABASE_ID is not set', () => {
      beforeEach(() => {
        process.env = {
          NOTION_TOKEN: 'NOTION_TOKEN',
        }
      })

      it('should throw an error', () => {
        expect(() => new Notion()).toThrowError('Missing DATABASE_ID environment variable')
      })
    })
  })
})
