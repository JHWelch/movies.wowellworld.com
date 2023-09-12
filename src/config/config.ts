export default class Config {
  adminEmail: string
  calendarUrl: string
  googleCloudProject: string
  notionDatabaseId: string
  notionToken: string
  port: number
  tmdbApiKey: string

  constructor () {
    this.adminEmail = this.requiredVariable('ADMIN_EMAIL')
    this.calendarUrl = this.requiredVariable('CALENDAR_URL')
    this.googleCloudProject = this.requiredVariable('GOOGLE_CLOUD_PROJECT')
    this.notionDatabaseId = this.requiredVariable('DATABASE_ID')
    this.notionToken = this.requiredVariable('NOTION_TOKEN')
    this.port = parseInt(this.optionalVariable('PORT', '8080'))
    this.tmdbApiKey = this.requiredVariable('TMDB_READ_KEY')
  }

  requiredVariable (name: string): string {
    const value = process.env[name]
    if (value == null) {
      throw new Error(`${name} is missing`)
    }

    return value
  }

  optionalVariable (name: string, fallback: string): string {
    return process.env[name] ?? fallback
  }
}