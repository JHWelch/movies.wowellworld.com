import Config from '@server/config/config'
import fs from 'fs'
import path from 'path'

export const parseManifest = (config: Config) => {
  if (config.nodeEnv !== 'production') return {}

  const manifestPath = path.join(
    path.resolve(),
    'built',
    'public',
    '.vite',
    'manifest.json',
  )
  const manifestFile = fs.readFileSync(manifestPath)

  return JSON.parse(manifestFile.toString())
}
