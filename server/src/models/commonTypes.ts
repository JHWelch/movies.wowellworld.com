import { TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

export type RichText = TextRichTextItemResponse

export type TextStyle = TextRichTextItemResponse['annotations']

export const DefaultTextStyle: TextStyle = {
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false,
  code: false,
  color: 'default',
}
