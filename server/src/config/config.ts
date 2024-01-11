export default class Config {
  adminEmail: string
  appUrl: string
  calendarUrl: string
  googleCloudProject: string
  notionMovieDatabaseId: string
  notionWeekDatabaseId: string
  notionToken: string
  port: number
  tmdbApiKey: string
  nodeEnv: string

  constructor () {
    this.adminEmail = this.requiredVariable('ADMIN_EMAIL')
    this.appUrl = this.requiredVariable('APP_URL')
    this.calendarUrl = this.requiredVariable('CALENDAR_URL')
    this.googleCloudProject = this.requiredVariable('GOOGLE_CLOUD_PROJECT')
    this.notionMovieDatabaseId = this.requiredVariable('NOTION_MOVIE_DATABASE_ID') // eslint-disable-line max-len
    this.notionWeekDatabaseId = this.requiredVariable('NOTION_WEEK_DATABASE_ID')
    this.notionToken = this.requiredVariable('NOTION_TOKEN')
    this.port = parseInt(this.optionalVariable('PORT', '8080'))
    this.tmdbApiKey = this.requiredVariable('TMDB_READ_KEY')
    this.nodeEnv = this.optionalVariable('NODE_ENV', 'development')
  }

  get isProduction (): boolean {
    return this.nodeEnv === 'production'
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
