export type MovieDto = {
  title: string,
  director: string | null,
  year: number | null,
  length: number | null,
  time: string | null,
  url: string | null,
  posterUrl: string,
  theaterName: string | null,
  showingUrl: string | null,
  isFieldTrip: boolean,
  displayLength: string | null,
}

export type WeekDto = {
  id: string,
  weekId: string,
  theme: string,
  date: string,
  isSkipped: boolean,
  slug: string | null,
  movies: MovieDto[],
}
