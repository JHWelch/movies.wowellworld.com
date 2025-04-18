export type MovieDto = {
  title: string
  director: string | null
  year: number | null
  length: number | null
  time: string | null
  url: string | null
  posterUrl: string
  theaterName: string | null
  showingUrl: string | null
  isFieldTrip: boolean
  displayLength: string | null
}

export type EventDto = {
  id: string
  eventId: string
  theme: string
  date: string
  isSkipped: boolean
  slug: string | null
  styledTheme: RichText[]
  movies: MovieDto[]
  submittedBy: string | null
}

export type TextStyle = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red' | 'default_background' | 'gray_background' | 'brown_background' | 'orange_background' | 'yellow_background' | 'green_background' | 'blue_background' | 'purple_background' | 'pink_background' | 'red_background'
}

export type RichText = {
  type: 'text'
  text: {
    content: string
    link: {
      url: string
    } | null
  }
  annotations: TextStyle
  plain_text: string
  href: string | null
}

export type CacheEventsOutput = {
  updatedEvents: number
  previousLastUpdated: string | null
  newLastUpdated: string | null
  tmdbMoviesSynced: MovieDto[]
}

export type MovieSearchDto = {
  title: string
  year: number
  tmdbId: number
  posterPath: string
}
