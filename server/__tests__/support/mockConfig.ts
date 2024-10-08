import Config from '@server/config/config'

export function mockConfig ({
  nodeEnv = 'production',
} = {}): Config {
  process.env = {
    APP_URL: 'http://APP_URL.example.com',
    NODE_ENV: nodeEnv,
    NOTION_TOKEN: 'NOTION_TOKEN',
    NOTION_MOVIE_DATABASE_ID: 'NOTION_MOVIE_DATABASE_ID',
    NOTION_WEEK_DATABASE_ID: 'NOTION_WEEK_DATABASE_ID',
    PORT: '3000',
    GOOGLE_CLOUD_PROJECT: 'GOOGLE_CLOUD_PROJECT',
    ADMIN_EMAIL: 'ADMIN_EMAIL@example.com',
    TMDB_READ_KEY: 'TMDB_READ_KEY',
    CALENDAR_URL: 'https://CALENDAR_URL',
  }

  return new Config()
}
