import { TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

export default interface EventProperties {
  Theme: {
    title: Array<{
      plain_text: string
    }>
  }
  Date: {
    date: {
      start: string
    }
  }
  Skipped: {
    checkbox: boolean
  }
  Movies: {
    relation: Array<{
      id: string
    }>
  }
  Slug: {
    rich_text: Array<{
      plain_text: string
    }>
  }
  'Styled Theme': {
    rich_text: Array<TextRichTextItemResponse>
  }
  'Submitted By': {
    rich_text: Array<{
      plain_text: string
    }>
  }
  'Last edited time': {
    last_edited_time: string
  }
  'Last edited movie time': {
    formula: {
      type: 'string'
      string: string | null
    } | {
      type: 'date'
      date: {
        start: string
      }
    }
  }
}
