import SuggestionController from '../../src/controllers/suggestionController'
import { beforeEach, describe, expect, it } from '@jest/globals'
import { getMockReq, getMockRes } from '@jest-mock/express'
import NotionAdapter from '../../src/data/notion/notionAdapter'
import { mockConfig } from '../support/mockConfig'

const { res, mockClear } = getMockRes()

beforeEach(() => {
  mockClear()
})

const newSuggestionController = () => {
  const config = mockConfig()
  const notion = new NotionAdapter(config)

  return new SuggestionController(notion)
}

describe('create', () => {
  it('should render create view', async () => {
    const req = getMockReq()

    await newSuggestionController().create(req, res)

    expect(res.render).toHaveBeenCalledWith(
      'suggestions/create',
      { path: '/suggestions/create' }
    )
  })
})
