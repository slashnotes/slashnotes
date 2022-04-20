import { join } from 'path'
import {
  existsSync, mkdirSync, renameSync
} from 'fs'

export function Folder (name: string, params: any) {
  switch (name) {
    case 'rename': {
      const dir = join(params.folder, params.to)
      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true })
      renameSync(join(params.folder, params.from), join(params.folder, params.to))
      return
    }
    default:
      throw Error('Unknown command: folder/' + name)
  }
}
