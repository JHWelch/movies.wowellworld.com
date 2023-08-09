import { PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

export const nCheckbox = (checked: boolean): {
  type: 'checkbox';
  checkbox: boolean;
  id: string;
} => ({
  checkbox: checked,
  type: 'checkbox',
  id: 'mockedId',
})

export const nDate = (start: string): {
  type: 'date';
  date: {
    start: string,
    end: null,
    time_zone: null,
  };
  id: string;
} => ({
  type: 'date',
  date: {
    start,
    end: null,
    time_zone: null,
  },
  id: 'mockedId',
})

export const nNumber = (number: number | null): {
  type: 'number';
  number: number | null;
  id: string;
} => ({
  type: 'number',
  number: number,
  id: 'mockedId',
})

export const nRichText = (text: string | null): {
  type: 'rich_text';
  rich_text: Array<RichTextItemResponse>;
  id: string;
} => ({
  type: 'rich_text',
  rich_text: text ? [richTextItem(text)] : [],
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

export const nUrl = (url: string | null): {
  type: 'url';
  url: string | null;
  id: string;
} => ({
  url,
  type: 'url',
  id: 'mockedId',
})

export const nRelation = (relation: NotionMovie[]): {
  type: 'relation';
  relation: {
    id: string;
  }[];
  id: string;
} => ({
  type: 'relation',
  relation: relation.map(movie => movie.toPageObjectResponse()),
  id: 'mockedId',
})

export const pageObjectResponse = (
  id: string,
  properties: PageObjectResponse['properties']
): PageObjectResponse => ({
  id,
  properties,
  object: 'page',
  created_time: '',
  last_edited_time: '',
  archived: false,
  parent: { type: 'database_id', database_id: '' },
  icon: null,
  cover: null,
  public_url: '',
  last_edited_by: {
    id: 'string',
    object: 'user',
  },
  created_by: {
    id: 'string',
    object: 'user',
  },
  url: '',
})

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

export type WithAuth<P> = P & {
  auth?: string;
};

export class NotionMovie {
  constructor(
    public id: string,
    public title: string,
    public director: string | null,
    public year: number | null,
    public length: number | null,
    public imdbUrl: string | null,
    public posterUrl: string | null,
    public theaterName: string | null,
    public showingUrl: string | null,
  ) {}

  toPageObjectResponse(): PageObjectResponse {
    return pageObjectResponse(this.id, {
      Title: nTitle(this.title),
      Director: nRichText(this.director),
      Year: nNumber(this.year),
      'Length (mins)': nNumber(this.length),
      IMDb: nUrl(this.imdbUrl),
      Poster: nUrl(this.posterUrl),
      'Theater Name': nRichText(this.theaterName),
      'Showing URL': nUrl(this.showingUrl),
    })
  }
}
