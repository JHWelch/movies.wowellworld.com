import WeekProperties from '../../src/types/weekProperties'
import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

export const nCheckbox = (checked: boolean) => ({ checkbox: checked })
export const nDate = (start: string) => ({ date: { start } })

export const nNumber = (number: number | null): {
  type: 'number';
  number: number | null;
  id: string;
} => ({
  type: 'number',
  number: number,
  id: 'mockedId',
})

export const nRichText = (text: string): {
  type: 'rich_text';
  rich_text: Array<RichTextItemResponse>;
  id: string;
} => ({
  type: 'rich_text',
  rich_text: [richTextItem(text)],
  id: 'some-id',
})

export const nTitle = (title: string): {
  type: 'title';
  title: Array<RichTextItemResponse>;
  id: string;
} => ({
  type: 'title',
  title: [richTextItem(title)],
  id: 'some-id',
})

export const richTextItem = (text: string): RichTextItemResponse => ({
  type: 'text',
  text: {
    content: text,
    link: null,
  },
  annotations: {
    bold: false,
    italic: false,
    strikethrough: false,
    underline: false,
    code: false,
    color: 'default',
  },
  plain_text: text,
  href: null,
})

export const nUrl = (url: string) => ({ url })

export type QueryBody = {
  database_id: string
  page_size?: number
  filter?: {
    property: string
    date?: {
      equals?: string
      on_or_after?: string
    }
    sorts?: {
      property: string
      direction: string
    }[]
  }
}

export type WeekResponse = {
  id: string
  properties: WeekProperties
}

export type WithAuth<P> = P & {
  auth?: string;
};
