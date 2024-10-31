import Config from '@server/config/config'

export function mockConfig ({
  nodeEnv = 'production',
} = {}): Config {
  process.env = {
    ADMIN_EMAIL: 'ADMIN_EMAIL@example.com',
    API_PASSWORD: 'API_PASSWORD',
    APP_URL: 'http://APP_URL.example.com',
    CALENDAR_URL: 'https://CALENDAR_URL',
    GOOGLE_CLOUD_PROJECT: 'GOOGLE_CLOUD_PROJECT',
    NODE_ENV: nodeEnv,
    NOTION_MOVIE_DATABASE_ID: 'NOTION_MOVIE_DATABASE_ID',
    NOTION_TOKEN: 'NOTION_TOKEN',
    NOTION_WEEK_DATABASE_ID: 'NOTION_WEEK_DATABASE_ID',
    PORT: '3000',
    TMDB_READ_KEY: 'TMDB_READ_KEY',
  }

  return new Config()
}
