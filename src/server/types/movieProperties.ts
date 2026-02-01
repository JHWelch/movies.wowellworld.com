export default interface MovieProperties {
  Title: {
    title: Array<{
      plain_text: string
    }>
  }
  Director: {
    rich_text: Array<{
      plain_text: string
    }>
  }
  Year: {
    number: number
  }
  'Length (mins)': {
    number: number
  }
  'TMDB Id': {
    number: number
  }
  Time: {
    rich_text: Array<{
      plain_text: string
    }>
  }
  URL: {
    url: string
  }
  Poster: {
    url: string
  }
  'Theater Name': {
    rich_text: Array<{
      plain_text: string
    }>
  }
  'Showing URL': {
    url: string
  }
  'Watch Where?': {
    multi_select: Array<{
      name: string
    }>
  }
}
