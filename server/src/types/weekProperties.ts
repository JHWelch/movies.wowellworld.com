export default interface WeekProperties {
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
}
