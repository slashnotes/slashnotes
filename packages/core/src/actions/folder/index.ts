import type { SlashnotesFile, SlashnotesItem } from '@slashnotes/types'
import type { Options } from '..'
import {
  join, extname, sep, dirname, basename,
} from 'path'
import {
  existsSync, mkdirSync, renameSync, readdirSync, statSync, writeFileSync,
} from 'fs'
import { renderToString } from 'react-dom/server'

type Files = {
  [type: string]: SlashnotesFile
}

type AllFiles = {
  [path: string]: SlashnotesItem & {
    mode: 'view'
    title?: string
    body?: string
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
    <ul class="sidebar">{{sidebar}}</ul>
    <div class="content">{{body}}</div>
  </body>
</html>`

export type TemplateOptions = {
  title: string
  sidebar: string
  body: string
}

export function templateRender (options: TemplateOptions) {
  return template
    .replace('{{title}}', options.title)
    .replace('{{sidebar}}', options.sidebar)
    .replace('{{body}}', options.body)
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

        file.body = renderToString(options.files[file.type].build({ source: join(params.source, file.path) }))

        file.title = file.body.match(/<h1>(.*?)<\/h1>/)[1] || basename(file.path).replace(extname(file.path), '')
      }

      let sidebar = ''
      let parent = ''

      for (const f of files) {
        if (f.path.includes(sep) && !parent.includes(dirname(f.path))) {
          parent = parent ? `</ul></li><li>${dirname(f.path)}<ul>` : `<li>${dirname(f.path)}<ul>`

          sidebar += parent
        }

        sidebar += `<li><a href="${f.path}">${f.title}</a></li>`
      }

      for (const file of files) {
        writeFileSync(join(params.target, 'slashnotes', file.path).replace(extname(file.path), '.html'), templateRender({
          title: file.title,
          sidebar,
          body: file.body,
        }))
      }

      return
    }
    default:
      throw Error('Unknown command: folder/' + name)
  }
}
