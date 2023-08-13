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
}
