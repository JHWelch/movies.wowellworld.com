import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import Config from '../../src/config/config'

beforeEach(() => {
  jest.resetModules()
  process.env = {
    NODE_ENV: 'production',
    NOTION_TOKEN: 'NOTION_TOKEN',
    NOTION_WEEK_DATABASE_ID: 'NOTION_WEEK_DATABASE_ID',
    NOTION_MOVIE_DATABASE_ID: 'NOTION_MOVIE_DATABASE_ID',
    PORT: '3000',
    GOOGLE_CLOUD_PROJECT: 'GOOGLE_CLOUD_PROJECT',
    ADMIN_EMAIL: 'ADMIN_EMAIL@example.com',
    TMDB_READ_KEY: 'TMDB_READ_KEY',
    CALENDAR_URL: 'https://CALENDAR_URL',
  }
})

describe('env variables all present', () => {
  it('returns the config', () => {
    const config = new Config()

    expect(config.nodeEnv).toBe('production')
    expect(config.notionToken).toBe('NOTION_TOKEN')
    expect(config.notionWeekDatabaseId).toBe('NOTION_WEEK_DATABASE_ID')
    expect(config.notionMovieDatabaseId).toBe('NOTION_MOVIE_DATABASE_ID')
    expect(config.port).toBe(3000)
    expect(config.googleCloudProject).toBe('GOOGLE_CLOUD_PROJECT')
    expect(config.adminEmail).toBe('ADMIN_EMAIL@example.com')
    expect(config.tmdbApiKey).toBe('TMDB_READ_KEY')
    expect(config.calendarUrl).toBe('https://CALENDAR_URL')
  })
})

describe('env missing NOTION_TOKEN', () => {
  beforeEach(() => {
    delete process.env.NOTION_TOKEN
  })

  it('throws an error', () => {
    expect(() => new Config()).toThrowError('NOTION_TOKEN is missing')
  })
})

describe('env missing NOTION_MOVIE_DATABASE_ID', () => {
  beforeEach(() => {
    delete process.env.NOTION_MOVIE_DATABASE_ID
  })

  it('throws an error', () => {
    expect(() => new Config()).toThrowError(
      'NOTION_MOVIE_DATABASE_ID is missing',
    )
  })
})

describe('env missing NOTION_WEEK_DATABASE_ID', () => {
  beforeEach(() => {
    delete process.env.NOTION_WEEK_DATABASE_ID
  })

  it('throws an error', () => {
    expect(() => new Config()).toThrowError(
      'NOTION_WEEK_DATABASE_ID is missing',
    )
  })
})

describe('env missing PORT', () => {
  beforeEach(() => {
    delete process.env.PORT
  })

  it('defaults to 8080', () => {
    expect(new Config().port).toBe(8080)
  })
})

describe('env missing GOOGLE_CLOUD_PROJECT', () => {
  beforeEach(() => {
    delete process.env.GOOGLE_CLOUD_PROJECT
  })

  it('throws an error', () => {
    expect(() => new Config()).toThrowError('GOOGLE_CLOUD_PROJECT is missing')
  })
})

describe('env missing ADMIN_EMAIL', () => {
  beforeEach(() => {
    delete process.env.ADMIN_EMAIL
  })

  it('throws an error', () => {
    expect(() => new Config()).toThrowError('ADMIN_EMAIL is missing')
  })
})

describe('env missing TMDB_READ_KEY', () => {
  beforeEach(() => {
    delete process.env.TMDB_READ_KEY
  })

  it('throws an error', () => {
    expect(() => new Config()).toThrowError('TMDB_READ_KEY is missing')
  })
})

describe('env missing CALENDAR_URL', () => {
  beforeEach(() => {
    delete process.env.CALENDAR_URL
  })

  it('throws an error', () => {
    expect(() => new Config()).toThrowError('CALENDAR_URL is missing')
  })
})

describe('env missing NODE_ENV', () => {
  beforeEach(() => {
    delete process.env.NODE_ENV
  })

  it('defaults to development', () => {
    expect(new Config().nodeEnv).toBe('development')
  })
})

describe('isProduction', () => {
  describe('when NODE_ENV is production', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
    })

    it('returns true', () => {
      expect(new Config().isProduction).toBe(true)
    })
  })

  describe('when NODE_ENV is development', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
    })

    it('returns false', () => {
      expect(new Config().isProduction).toBe(false)
    })
  })
})
