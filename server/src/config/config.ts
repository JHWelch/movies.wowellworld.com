export default class Config {
  adminEmail: string
  apiPassword: string
  appUrl: string
  calendarUrl: string
  googleCloudProject: string
  nodeEnv: string
  notionMovieDatabaseId: string
  notionToken: string
  notionEventDatabaseId: string
  port: number
  tmdbApiKey: string

  constructor () {
    this.adminEmail = this.requiredVariable('ADMIN_EMAIL')
    this.apiPassword = this.requiredVariable('API_PASSWORD')
    this.appUrl = this.requiredVariable('APP_URL')
    this.calendarUrl = this.requiredVariable('CALENDAR_URL')
    this.googleCloudProject = this.requiredVariable('GOOGLE_CLOUD_PROJECT')
    this.nodeEnv = this.optionalVariable('NODE_ENV', 'development')
    this.notionMovieDatabaseId = this.requiredVariable('NOTION_MOVIE_DATABASE_ID')
    this.notionEventDatabaseId = this.requiredVariable('NOTION_WEEK_DATABASE_ID')
    this.notionToken = this.requiredVariable('NOTION_TOKEN')
    this.port = parseInt(this.optionalVariable('PORT', '8080'))
    this.tmdbApiKey = this.requiredVariable('TMDB_READ_KEY')
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
