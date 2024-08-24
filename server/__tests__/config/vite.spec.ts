import Config from '@server/config/config'
import { mockConfig } from '@tests/support/mockConfig'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { parseManifest } from '@server/config/vite'
import path from 'path'
import fs from 'fs'

let config: Config

describe('local nodeEnv', () => {
  beforeEach(() => {
    config = mockConfig({ nodeEnv: 'local' })
  })

  it('should not parse manifest', async () => {
    const manifest = await parseManifest(config)

    expect(manifest).toEqual({})
  })
})

describe('production nodeEnv', () => {
  beforeEach(() => {
    jest.mock('path')
    jest.mock('fs')
    config = mockConfig({ nodeEnv: 'production' })
    jest.spyOn(path, 'resolve').mockReturnValue('/path/to/project')
    jest.spyOn(path, 'join')
      .mockReturnValue('/path/to/project/dist/manifest.json')
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"key": "value"}')
  })

  it('should parse manifest', async () => {
    const manifest = await parseManifest(config)

    expect(manifest).toEqual({
      'key': 'value',
    })
  })
})
