import Config from './config'
import fs from 'fs/promises'
import path from 'path'

export const parseManifest = async (config: Config) => {
  if (config.nodeEnv !== 'production') return {}

  const manifestPath = path.join(path.resolve(), 'dist', 'manifest.json')
  const manifestFile = await fs.readFile(manifestPath)

  return JSON.parse(manifestFile.toString())
}
