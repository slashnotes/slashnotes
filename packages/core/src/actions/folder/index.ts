import type { SlashnotesFile, SlashnotesItem } from '@slashnotes/types'
import type { Options } from '..'
import {
  join, extname, sep, dirname, basename,
} from 'path'
import {
  existsSync, mkdirSync, renameSync, readdirSync, statSync, writeFileSync,
} from 'fs'
import { renderToStaticMarkup } from 'react-dom/server'

type Files = {
  [type: string]: SlashnotesFile
}

type AllFiles = {
  [path: string]: SlashnotesItem & {
    mode: 'view'
    title?: string
    body?: JSX.Element
  }
}

export function findFiles (dir: string, cwd: string, files: Files, prev?: AllFiles): AllFiles {
  if (!prev) prev = {}

  readdirSync(dir).forEach(f => {
    const subPath = join(dir, f)
    if (statSync(subPath).isDirectory() && !subPath.includes('node_modules'))
      return findFiles(subPath, cwd, files, prev)

    const ext = extname(f)
    if (files[ext]) {
      const path = subPath.replace(cwd, '')
      const paths = path.split(sep)
      prev[path] = {
        path,
        name: paths[paths.length - 1],
        type: ext,
        mode: 'view',
      }
    }
  })

  return prev
}

const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{title}}</title>
  </head>
  <body>
    {{body}}
  </body>
</html>`

export type TemplateOptions = {
  title: string
  sidebar: string
  body: JSX.Element
}

export function Folder (name: string, params: any, options: Options) {
  switch (name) {
    case 'list':
      return findFiles(params.folder, params.folder + sep, options.files)
    case 'rename': {
      const dir = join(params.folder, params.to)
      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true })
      renameSync(join(params.folder, params.from), join(params.folder, params.to))
      return
    }
    case 'generate': {
      const files = Object.values(findFiles(params.source, params.source + sep, options.files))

      for (const file of files) {
        const dir = dirname(join(params.target, 'slashnotes', file.path))

        if (!existsSync(dir))
          mkdirSync(dir, { recursive: true })

        file.body = options.files[file.type].build({ source: join(params.source, file.path) })
      }

      for (const file of files) {
        const body = renderToStaticMarkup(options.web({ body: file.body }))
        const title = body.match(/<h1>(.*?)<\/h1>/)[1] || basename(file.path).replace(extname(file.path), '')

        writeFileSync(join(params.target, 'slashnotes', file.path).replace(extname(file.path), '.html'), template
          .replace('{{title}}', title)
          .replace('{{body}}', body))
      }

      return
    }
    default:
      throw Error('Unknown command: folder/' + name)
  }
}
