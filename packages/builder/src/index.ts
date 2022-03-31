import {
  existsSync, readdirSync, statSync, mkdirSync,
} from 'fs'
import {
  join, extname, sep, dirname
} from 'path'
import { SlashnotesItem, SlashnotesFile } from '@slashnotes/types'
import { Md } from '@slashnotes/md'

type Files = {
  [type: string]: SlashnotesFile
}

function findFiles (dir: string, cwd: string, files: Files, prev?: SlashnotesItem[]): SlashnotesItem[] {
  if (!prev) prev = []

  readdirSync(dir).forEach(f => {
    const subPath = join(dir, f)
    if (statSync(subPath).isDirectory() && !subPath.includes('node_modules'))
      return findFiles(subPath, cwd, files, prev)

    const ext = extname(f)
    if (files[ext]) {
      const path = subPath.replace(cwd, '')
      const paths = path.split(sep)
      prev.push({
        path,
        name: paths[paths.length - 1],
        type: ext
      })
    }
  })

  return prev
}

export class Builder {
  public readonly folder: string
  public readonly files: Files

  constructor (options: { folder: string }) {
    this.folder = options.folder
    this.files = { '.md': Md }
  }

  public build (destination: string): void {
    const files = findFiles(this.folder, this.folder + sep, this.files)

    for (const file of files) {
      const to = join(destination, file.path).replace('.md', '.html')

      const dir = dirname(to)
      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true })

      this.files[file.type].build({
        source: join(this.folder, file.path),
        destination: to
      })
    }
  }
}
