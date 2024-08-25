import {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { Movie } from '@server/models/movie'

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
  properties: PageObjectResponse['properties'],
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

type NotionMovieConstructor = {
  id: string,
  title: string,
  director?: string | null,
  year?: number | null,
  length?: number | null,
  time?: string | null,
  url?: string | null,
  posterPath?: string | null,
  theaterName?: string | null,
  showingUrl?: string | null,
}

export class NotionMovie {
  public id: string = ''
  public title: string = ''
  public director: string | null = null
  public year: number | null = null
  public length: number | null = null
  public time: string | null = null
  public url: string | null = null
  public posterPath: string | null = null
  public theaterName: string | null = null
  public showingUrl: string | null = null

  constructor (movie: NotionMovieConstructor) {
    Object.keys(movie).forEach((key) => {
      const typedKey = key as keyof NotionMovieConstructor
      if (movie[typedKey] === undefined) {
        delete movie[typedKey]
      }
    })
    Object.assign(this, movie)
  }

  toPageObjectResponse (): PageObjectResponse {
    return pageObjectResponse(this.id, {
      Title: nTitle(this.title),
      Director: nRichText(this.director),
      Year: nNumber(this.year),
      'Length (mins)': nNumber(this.length),
      Time: nRichText(this.time),
      URL: nUrl(this.url),
      Poster: nUrl(this.posterPath),
      'Theater Name': nRichText(this.theaterName),
      'Showing URL': nUrl(this.showingUrl),
    })
  }

  static demo (): NotionMovie {
    return new NotionMovie({
      id: 'movieId',
      title: 'movieTitle',
      director: 'movieDirector',
      year: 2021,
      length: 120,
      time: '8:00 PM',
      url: 'movieUrl',
      posterPath: 'moviePosterPath',
      theaterName: 'movieTheaterName',
      showingUrl: 'movieShowingUrl',
    })
  }

  static fromMovie (movie: Movie): NotionMovie {
    return new NotionMovie({
      id: movie.notionId || '',
      title: movie.title,
      director: movie.director,
      year: movie.year,
      length: movie.length,
      time: movie.time,
      url: movie.url,
      posterPath: movie.posterPath,
      theaterName: movie.theaterName,
      showingUrl: movie.showingUrl,
    })
  }
}
