import path from 'path'
import { fileURLToPath } from 'url'

const directoryPath = () => path.dirname(fileURLToPath(import.meta.url))

export default directoryPath
